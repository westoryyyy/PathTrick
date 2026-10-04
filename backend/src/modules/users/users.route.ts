import { FastifyInstance } from "fastify";
import { z } from "zod";
import { setRoleSchema } from "../auth/auth.schema";
import { prisma } from "../../lib/prisma";
import { requireAdmin } from "../admin/admin.middleware";
import { getUserProfile, setUserRole, setUserRoleById } from "./users.service";

export default async function usersRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/users/me
   * Ambil profil user yang sedang login â€” dipakai FE untuk cek role
   * sudah dipilih atau belum sebelum lanjut ke assessment.
   */
  fastify.get(
    "/api/users/me",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const { userId } = request.user;
        const profile = await getUserProfile(userId);
        return reply.code(200).send(profile);
      } catch (err: unknown) {
        if (err instanceof Error && err.message === "USER_NOT_FOUND") {
          return reply.code(404).send({ error: "NotFound", message: "User tidak ditemukan" });
        }
        request.log.error(err, "Unexpected error di GET /api/users/me");
        return reply.code(500).send({ error: "InternalError", message: "Terjadi kesalahan tak terduga" });
      }
    }
  );

  /**
   * PUT /api/users/me
   * Update profil pengguna saat ini (misalnya nickname dan wallet address)
   */
  fastify.put(
    "/api/users/me",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const updateSchema = z.object({
        name: z.string().optional(),
        walletAddress: z.string().optional(),
      });
      const parsed = updateSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "ValidationError", details: parsed.error.flatten() });
      }

      try {
        const { userId } = request.user;
        const data = { ...parsed.data };
        if (data.walletAddress) {
          const owner = await prisma.user.findUnique({
            where: { walletAddress: data.walletAddress },
            select: { id: true },
          });
          // Wallet sudah dipakai akun lain (mis. akun Dreamer) -> jangan update wallet
          if (owner && owner.id !== userId) delete data.walletAddress;
        }
        const updated = await prisma.user.update({
          where: { id: userId },
          data,
        });
        return reply.code(200).send(updated);
      } catch (err: unknown) {
        request.log.error(err, "Unexpected error di PUT /api/users/me");
        return reply.code(500).send({ error: "InternalError", message: "Terjadi kesalahan tak terduga" });
      }
    }
  );

  /**
   * PATCH /api/users/role
   * Set atau ganti role user (DREAMER / CHASER).
   * Ini BLOCKER untuk flow assessment â€” assessment.route.ts menolak request
   * kalau user.role masih null.
   *
   * Body: { "roleName": "DREAMER" | "CHASER" }
   *
   * Catatan: ADMIN tidak bisa di-set lewat endpoint ini â€” hanya bisa
   * di-assign manual lewat DB/Prisma Studio. Kalau dikirim "ADMIN",
   * endpoint ini akan return 403.
   *
   * Setelah PATCH ini, FE cukup andalkan GET /api/users/me untuk membaca
   * role terkini â€” tidak perlu re-login / refresh token.
   */
  fastify.patch(
    "/api/users/role",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parsedBody = setRoleSchema.safeParse(request.body);
      if (!parsedBody.success) {
        return reply.code(400).send({
          error: "ValidationError",
          details: parsedBody.error.flatten(),
        });
      }

      try {
        const { userId } = request.user;
        const updated = await setUserRole(userId, parsedBody.data.roleName);
        return reply.code(200).send({
          message: `Role berhasil diatur ke ${updated.role?.displayName}`,
          user: updated,
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.message === "USER_NOT_FOUND") {
            return reply.code(404).send({ error: "NotFound", message: "User tidak ditemukan" });
          }
          if (err.message === "ROLE_NOT_FOUND") {
            return reply.code(400).send({ error: "RoleNotFound", message: "Role tidak ditemukan" });
          }
          if (err.message === "ROLE_NOT_SELECTABLE") {
            return reply
              .code(403)
              .send({ error: "Forbidden", message: "Role ini tidak bisa dipilih lewat API" });
          }
        }
        request.log.error(err, "Unexpected error di PATCH /api/users/role");
        return reply.code(500).send({ error: "InternalError", message: "Terjadi kesalahan tak terduga" });
      }
    }
  );

  /**
   * POST /api/users/me/role
   * Set role user berdasarkan roleId (sesuai spec mentor).
   * Ini adalah cara yang direkomendasikan â€” FE ambil roleId dari GET /api/roles,
   * lalu kirim ke sini. Tidak perlu kirim userId secara manual.
   */
  fastify.post(
    "/api/users/me/role",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const body = request.body as { roleId?: string };
      if (!body?.roleId) {
        return reply.code(400).send({ error: "ValidationError", message: "roleId wajib diisi" });
      }

      try {
        const { userId } = request.user;
        const updated = await setUserRoleById(userId, body.roleId);
        return reply.code(200).send({
          message: `Role berhasil diatur ke ${updated.role?.displayName}`,
          user: updated,
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.message === "USER_NOT_FOUND")
            return reply.code(404).send({ error: "NotFound", message: "User tidak ditemukan" });
          if (err.message === "ROLE_NOT_FOUND")
            return reply.code(400).send({ error: "RoleNotFound", message: "Role tidak ditemukan" });
          if (err.message === "ROLE_NOT_SELECTABLE")
            return reply.code(403).send({ error: "Forbidden", message: "Role ini tidak bisa dipilih" });
        }
        request.log.error(err, "Unexpected error di POST /api/users/me/role");
        return reply.code(500).send({ error: "InternalError", message: "Terjadi kesalahan tak terduga" });
      }
    }
  );

  /**
   * =========================================
   * ADMIN ROUTES (READ-ONLY)
   * =========================================
   */

  fastify.get(
    "/api/admin/users",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: { select: { name: true } }, walletAddress: true, gamification: { select: { xp: true } },
          createdAt: true,
        },
      });
      return reply.code(200).send({ total: users.length, users });
    }
  );

  fastify.get(
    "/api/admin/users/:id",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          role: true,
          gamification: true,
          courseProgress: {
            include: { course: true }
          },
          certificates: true,
        }
      });
      if (!user) {
        return reply.code(404).send({ error: "NotFound", message: "User tidak ditemukan" });
      }
      return reply.code(200).send(user);
    }
  );
}


