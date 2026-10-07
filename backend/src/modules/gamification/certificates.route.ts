import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";

const DEADLINE_TTL_SECONDS = 30 * 60; // 30 menit

export default async function certificatesRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/certificates/prepare-mint
   * 1. Verifikasi user lulus course
   * 2. Baca nonce dari chain
   * 3. Cek hasCertificate on-chain
   * 4. Generate EIP-712 signature dengan deadline
   * 5. Return signature payload ke FE
   */
  fastify.post(
    "/api/certificates/prepare-mint",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const body = request.body as { courseId?: string; walletAddress?: string };
      if (!body?.courseId) {
        return reply.code(400).send({ error: "ValidationError", message: "courseId wajib diisi" });
      }

      const { userId } = request.user;

      // 1. Ambil wallet address user
      let user = await prisma.user.findUnique({
        where: { id: userId },
        select: { walletAddress: true },
      });
      // If backend does not yet have the user's walletAddress but the
      // client provided one (frontend knows the connected wallet), try
      // to persist it here. This improves UX when the client just linked
      // a wallet but the earlier /api/auth/sync PUT hasn't been applied yet.
      if (!user?.walletAddress) {
        const provided = typeof body.walletAddress === 'string' ? body.walletAddress.trim() : undefined;
        if (provided && /^0x[a-fA-F0-9]{40}$/.test(provided)) {
          // Ensure wallet is not already claimed by another user.
          const owner = await prisma.user.findUnique({ where: { walletAddress: provided } });
          if (!owner) {
            try {
              await prisma.user.update({ where: { id: userId }, data: { walletAddress: provided } });
              request.log.info({ userId, walletAddress: provided }, 'prepare-mint: synced wallet from request body');
            } catch (err) {
              request.log.warn({ err, userId, provided }, 'prepare-mint: failed to persist walletAddress');
            }
          } else {
            request.log.warn({ userId, provided }, 'prepare-mint: walletAddress already owned by another user');
          }
        }

        // Re-fetch user's walletAddress after attempted sync
        user = await prisma.user.findUnique({ where: { id: userId }, select: { walletAddress: true } });
        if (!user?.walletAddress) {
          return reply
            .code(400)
            .send({ error: "BadRequest", message: "Hubungkan wallet terlebih dahulu sebelum klaim sertifikat." });
        }
      }

      const walletAddress = user.walletAddress;

      // 2. Cari course dan pastikan user lulus (ada SkillBadge)
      // Accept either internal Course.id (cuid string) or numeric on-chain id
      const isNumericId = /^[0-9]+$/.test(body.courseId);
      let badge;
      if (isNumericId) {
        // match by denormalized courseOnChainId
        badge = await prisma.skillBadge.findFirst({
          where: {
            userId,
            courseOnChainId: BigInt(body.courseId),
          },
          include: {
            certificate: true,
            courseProgress: { select: { course: { select: { onChainId: true, title: true } } } },
          },
        });
      } else {
        badge = await prisma.skillBadge.findFirst({
          where: {
            userId,
            courseProgress: { courseId: body.courseId },
          },
          include: {
            certificate: true,
            courseProgress: { select: { course: { select: { onChainId: true, title: true } } } },
          },
        });
      }

      if (!badge) {
        // Log and return user's existing badges to help debugging client-side mismatches
        request.log.info({ userId, attemptedCourseId: body.courseId, isNumericId }, 'prepare-mint: badge not found');
        const userBadges = await prisma.skillBadge.findMany({
          where: { userId },
          select: { courseOnChainId: true, courseProgress: { select: { courseId: true } } },
        });
        return reply
          .code(403)
          .send({
            error: "Forbidden",
            message: "User belum lulus course ini.",
            availableBadges: userBadges.map((b) => ({
              courseOnChainId: b.courseOnChainId?.toString?.(),
              courseId: b.courseProgress?.courseId,
            })),
          });
      }

      const courseOnChainId = BigInt(badge.courseOnChainId);

      // 3. Import blockchain utils
      const { getNonce, checkHasCertificate, generateMintSignature } = await import("../../lib/blockchain");

      // 4. Cek apakah sudah punya sertifikat on-chain
      try {
        const alreadyCertified = await checkHasCertificate(walletAddress, courseOnChainId);
        if (alreadyCertified) {
          // Sync ke DB juga kalau belum
          if (badge.certificate && badge.certificate.mintStatus !== "MINTED") {
            await prisma.certificate.update({
              where: { id: badge.certificate.id },
              data: { mintStatus: "MINTED" },
            });
          }
          return reply
            .code(400)
            .send({ error: "AlreadyCertified", message: "Sertifikat untuk course ini sudah ada on-chain." });
        }
      } catch (chainErr) {
        request.log.warn(chainErr, "Gagal cek hasCertificate dari chain, lanjut sign");
      }

      // 5. Baca nonce dari chain
      let nonce = 0n;
      try {
        nonce = await getNonce(walletAddress, courseOnChainId);
      } catch (nonceErr) {
        request.log.warn(nonceErr, "Gagal baca nonce dari chain, pakai 0");
      }

      // 6. Buat deadline (now + 30 menit)
      const deadline = BigInt(Math.floor(Date.now() / 1000) + DEADLINE_TTL_SECONDS);

      // 7. Generate EIP-712 signature
      const signature = await generateMintSignature(walletAddress, courseOnChainId, nonce, deadline);

      // 8. Simpan/update Certificate record
      if (badge.certificate) {
        await prisma.certificate.update({
          where: { id: badge.certificate.id },
          data: { signature, nonce, deadline, mintStatus: "PENDING" },
        });
      } else {
        await prisma.certificate.create({
          data: {
            userId,
            skillBadgeId: badge.id,
            courseOnChainId,
            signature,
            nonce,
            deadline,
            mintStatus: "PENDING",
          },
        });
      }

      await prisma.notification.create({
        data: {
          userId,
          type: "CERTIFICATE_STATUS_CHANGED",
          title: "Sertifikat Sedang Diproses",
          body: `Transaksi minting sertifikat untuk ${badge.courseProgress.course.title} sedang disiapkan. Harap konfirmasi transaksi di wallet Anda.`,
        }
      });

      return reply.code(200).send({
        courseId: courseOnChainId.toString(),
        nonce: nonce.toString(),
        deadline: deadline.toString(),
        signature,
      });
    }
  );

  /**
   * POST /api/certificates/confirm-mint
   * FE memanggil ini setelah transaksi on-chain berhasil.
   * Backend verifikasi receipt dan event sebelum mark MINTED.
   */
  fastify.post(
    "/api/certificates/confirm-mint",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const body = request.body as { courseId?: string; txHash?: string };
      if (!body?.courseId || !body?.txHash) {
        return reply
          .code(400)
          .send({ error: "ValidationError", message: "courseId dan txHash wajib diisi" });
      }

      const { userId } = request.user;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { walletAddress: true },
      });
      if (!user?.walletAddress) {
        return reply.code(400).send({ error: "BadRequest", message: "Wallet belum terhubung." });
      }

      // Ambil certificate record
      const isNumericId = /^[0-9]+$/.test(body.courseId);
      let badge;
      if (isNumericId) {
        badge = await prisma.skillBadge.findFirst({
          where: { userId, courseOnChainId: BigInt(body.courseId) },
          include: { certificate: true },
        });
      } else {
        badge = await prisma.skillBadge.findFirst({
          where: { userId, courseProgress: { courseId: body.courseId } },
          include: { certificate: true },
        });
      }

      if (!badge?.certificate) {
        return reply
          .code(404)
          .send({ error: "NotFound", message: "Certificate record tidak ditemukan. Panggil prepare-mint dulu." });
      }

      if (badge.certificate.mintStatus === "MINTED") {
        return reply.code(400).send({ error: "BadRequest", message: "Sertifikat sudah dikonfirmasi." });
      }

      // Verifikasi receipt on-chain via public RPC
      const { publicClient } = await import("../../lib/blockchain");
      const CONTRACT_ADDRESS = env.CONTRACT_ADDRESS.toLowerCase();

      let receipt: Awaited<ReturnType<typeof publicClient.getTransactionReceipt>>;
      try {
        receipt = await publicClient.getTransactionReceipt({
          hash: body.txHash as `0x${string}`,
        });
      } catch {
        return reply.code(400).send({ error: "BadRequest", message: "Transaksi tidak ditemukan di chain." });
      }

      // Verifikasi: tx target = contract address
      if (receipt.to?.toLowerCase() !== CONTRACT_ADDRESS) {
        return reply.code(400).send({ error: "BadRequest", message: "Transaksi bukan ke contract PathtrickSBT." });
      }

      // Verifikasi: status sukses
      if (receipt.status !== "success") {
        return reply.code(400).send({ error: "BadRequest", message: "Transaksi gagal / reverted." });
      }

      // Verifikasi: ada event CertificateMinted dari contract yang benar
      // CertificateMinted(address indexed to, uint256 indexed courseId)
      // topic[0] = keccak256("CertificateMinted(address,uint256)")
      const MINTED_SIG = "0xe351802b022b8ba03353eafd05148198c0dc13061427df4dbbbbfc5c726a1b9e";
      const mintLog = receipt.logs.find(
        (log) =>
          log.address.toLowerCase() === CONTRACT_ADDRESS &&
          log.topics[0]?.toLowerCase() === MINTED_SIG
      );

      if (!mintLog) {
        return reply
          .code(400)
          .send({ error: "BadRequest", message: "Event CertificateMinted tidak ditemukan di receipt." });
      }

      // Verifikasi: topic[1] = to address (padded 32 bytes)
      const toAddress = "0x" + mintLog.topics[1]?.slice(26); // ambil 20 byte terakhir
      if (toAddress.toLowerCase() !== user.walletAddress.toLowerCase()) {
        return reply
          .code(400)
          .send({ error: "BadRequest", message: "Penerima sertifikat tidak sesuai wallet user." });
      }

      // Mark MINTED di DB
      const updated = await prisma.certificate.update({
        where: { id: badge.certificate.id },
        data: {
          mintStatus: "MINTED",
          txHash: body.txHash,
          mintedAt: new Date(),
        },
      });

      await prisma.notification.create({
        data: {
          userId,
          type: "CERTIFICATE_STATUS_CHANGED",
          title: "Sertifikat Berhasil Di-mint!",
          body: "Sertifikat Anda telah berhasil dicatat di blockchain.",
        }
      });

      return reply.code(200).send({
        message: "Sertifikat berhasil dikonfirmasi!",
        certificate: {
          id: updated.id,
          mintStatus: updated.mintStatus,
          txHash: updated.txHash,
          mintedAt: updated.mintedAt,
        },
      });
    }
  );
}
