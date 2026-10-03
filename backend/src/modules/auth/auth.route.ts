import { FastifyInstance } from "fastify";
import { extractBearerToken, verifyPrivyAccessToken } from "../../lib/privy";
import { syncBodySchema } from "./auth.schema";
import { getUserById, syncUserFromPrivy } from "./auth.service";

export default async function authRoutes(fastify: FastifyInstance) {
  // -------------------------------------------------------------------
  // POST /api/auth/sync
  // Body: { email?, name? }  (opsional, profil tambahan)
  // Header: Authorization: Bearer <privy_access_token>
  // -------------------------------------------------------------------
  fastify.post("/api/auth/sync", async (request, reply) => {
    try {
      let privyId: string;
      try {
        const token = extractBearerToken(request.headers.authorization);
        const claims = await verifyPrivyAccessToken(token);
        privyId = claims.privyId;
      } catch (err) {
        return reply.code(401).send({
          error: "Unauthorized",
          message: err instanceof Error ? err.message : "Token Privy tidak valid",
        });
      }

      const parsedBody = syncBodySchema.safeParse(request.body ?? {});
      if (!parsedBody.success) {
        return reply.code(400).send({
          error: "ValidationError",
          details: parsedBody.error.flatten().fieldErrors,
        });
      }

      const user = await syncUserFromPrivy(privyId, parsedBody.data);

      // Terbitkan JWT sesi aplikasi kita sendiri — dipakai untuk request
      // berikutnya, TIDAK perlu kirim token Privy lagi ke rute lain.
      const appToken = await reply.jwtSign({
        userId: user.id,
        roleName: user.role?.name ?? null,
      });

      return reply.code(200).send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          // role berisi metadata lengkap; null kalau user belum pilih role
          role: user.role
            ? { name: user.role.name, displayName: user.role.displayName }
            : null,
          walletAddress: user.walletAddress,
        },
        token: appToken,
      });
    } catch (err) {
      request.log.error({ err }, 'Error di POST /api/auth/sync');
      return reply.code(500).send({
        error: 'InternalError',
        message: 'Gagal menyinkronkan akun ke backend.',
      });
    }
  });

  // -------------------------------------------------------------------
  // GET /api/me — contoh rute terproteksi, sekaligus dipakai Frontend
  // buat re-hydrate state user setelah refresh halaman.
  // -------------------------------------------------------------------
  fastify.get(
    "/api/me",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const user = await getUserById(userId);

      if (!user) {
        return reply.code(404).send({ error: "NotFound", message: "User tidak ditemukan" });
      }

      return reply.code(200).send({ user });
    }
  );
}
