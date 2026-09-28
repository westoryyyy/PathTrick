import { FastifyInstance } from "fastify";
import { requireAdmin } from "../admin/admin.middleware";
import { upsertRoleBodySchema } from "./roles.schema";
import {
  createRole,
  deleteRole,
  getAllRoles,
  getRoleById,
  getSelectableRoles,
  updateRole,
} from "./roles.service";

export default async function rolesRoutes(fastify: FastifyInstance) {
  // =====================================================================
  // PUBLIC — tidak butuh auth
  // =====================================================================

  /**
   * GET /api/roles
   * Ambil list role yang bisa dipilih user saat onboarding (isSelectable=true).
   * Dipakai FE untuk render kartu karakter di halaman "Pilih Karaktermu".
   *
   * Response contoh:
   * [
   *   { id, name:"DREAMER", displayName:"The Dreamer", title:"Siswa SMA",
   *     description:"...", perks:[...], iconUrl:"/NPC High School Student.png",
   *     color:"#a855f7", glow:"rgba(168,85,247,0.5)", tag:"POPULER", ... },
   *   { id, name:"CHASER", ... }
   * ]
   */
  fastify.get("/api/roles", async (_request, reply) => {
    const roles = await getSelectableRoles();
    return reply.code(200).send(roles);
  });

  // =====================================================================
  // ADMIN — butuh auth + role ADMIN
  // =====================================================================

  /**
   * GET /api/admin/roles
   * List SEMUA role termasuk ADMIN (untuk panel admin).
   */
  fastify.get(
    "/api/admin/roles",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (_request, reply) => {
      const roles = await getAllRoles();
      return reply.code(200).send(roles);
    }
  );

  /**
   * GET /api/admin/roles/:id
   */
  fastify.get(
    "/api/admin/roles/:id",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const role = await getRoleById(id);
      if (!role) {
        return reply.code(404).send({ error: "NotFound", message: "Role tidak ditemukan" });
      }
      return reply.code(200).send(role);
    }
  );

  /**
   * POST /api/admin/roles
   * Buat role baru (mis. "The Professional" untuk pekerja kantoran di masa depan).
   */
  fastify.post(
    "/api/admin/roles",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const parsed = upsertRoleBodySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "ValidationError", details: parsed.error.flatten() });
      }

      try {
        const role = await createRole(parsed.data);
        return reply.code(201).send(role);
      } catch (err: unknown) {
        if (err instanceof Error && err.message === "ROLE_NAME_TAKEN") {
          return reply.code(409).send({ error: "Conflict", message: `Role dengan name "${parsed.data.name}" sudah ada` });
        }
        request.log.error(err, "Unexpected error di POST /api/admin/roles");
        return reply.code(500).send({ error: "InternalError", message: "Terjadi kesalahan tak terduga" });
      }
    }
  );

  /**
   * PATCH /api/admin/roles/:id
   * Update metadata role — displayName, title, description, perks, warna, dll.
   */
  fastify.patch(
    "/api/admin/roles/:id",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parsed = upsertRoleBodySchema.partial().safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "ValidationError", details: parsed.error.flatten() });
      }

      try {
        const role = await updateRole(id, parsed.data);
        return reply.code(200).send(role);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.message === "ROLE_NOT_FOUND") {
            return reply.code(404).send({ error: "NotFound", message: "Role tidak ditemukan" });
          }
          if (err.message === "ROLE_NAME_TAKEN") {
            return reply.code(409).send({ error: "Conflict", message: "Nama role sudah dipakai" });
          }
        }
        request.log.error(err, "Unexpected error di PATCH /api/admin/roles/:id");
        return reply.code(500).send({ error: "InternalError", message: "Terjadi kesalahan tak terduga" });
      }
    }
  );

  /**
   * DELETE /api/admin/roles/:id
   * Hapus role. Tidak bisa menghapus DREAMER, CHASER, ADMIN (sistem),
   * dan tidak bisa menghapus role yang masih punya user.
   */
  fastify.delete(
    "/api/admin/roles/:id",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      try {
        const result = await deleteRole(id);
        return reply.code(200).send(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.message === "ROLE_NOT_FOUND") {
            return reply.code(404).send({ error: "NotFound", message: "Role tidak ditemukan" });
          }
          if (err.message === "ROLE_SYSTEM_PROTECTED") {
            return reply.code(403).send({ error: "Forbidden", message: "Role sistem (DREAMER/CHASER/ADMIN) tidak bisa dihapus" });
          }
          if (err.message === "ROLE_HAS_USERS") {
            return reply.code(409).send({ error: "Conflict", message: "Role masih memiliki user — pindahkan user dulu sebelum menghapus role" });
          }
        }
        request.log.error(err, "Unexpected error di DELETE /api/admin/roles/:id");
        return reply.code(500).send({ error: "InternalError", message: "Terjadi kesalahan tak terduga" });
      }
    }
  );
}
