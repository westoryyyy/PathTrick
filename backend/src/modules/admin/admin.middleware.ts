import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";

/**
 * Middleware admin berbasis Role DB — cek apakah user memiliki
 * Role dengan name === "ADMIN". Wajib dipasang SETELAH fastify.authenticate.
 *
 * Menggantikan mekanisme lama yang bergantung pada ADMIN_USER_IDS di .env
 * (yang butuh restart server setiap kali ganti admin).
 *
 * Cara assign admin:
 *   Opsi 1 (Prisma Studio): Buka prisma studio → tabel User → ubah roleId
 *           ke id Role "ADMIN".
 *   Opsi 2 (SQL): UPDATE "User"
 *                 SET "roleId" = (SELECT id FROM "Role" WHERE name = 'ADMIN')
 *                 WHERE id = 'user-id-yang-diinginkan';
 *
 * Tidak perlu restart server setelah assign — cek dilakukan dari DB per-request.
 */
export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: request.user.userId },
    include: { role: true },
  });

  if (!user || user.role?.name !== "ADMIN") {
    return reply.code(403).send({
      error: "Forbidden",
      message: "Rute ini khusus admin. Hubungi tim untuk mendapatkan akses.",
    });
  }
}
