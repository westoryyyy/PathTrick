import { prisma } from "../../lib/prisma";
import { UpsertRoleBody } from "./roles.schema";

// -----------------------------------------------------------------------
// Selector standar untuk response publik (tanpa field internal)
// -----------------------------------------------------------------------
const PUBLIC_ROLE_SELECT = {
  id: true,
  name: true,
  displayName: true,
  title: true,
  description: true,
  perks: true,
  iconUrl: true,
  color: true,
  glow: true,
  tag: true,
  isSelectable: true,
  sortOrder: true,
} as const;

/**
 * GET /api/roles
 * Ambil semua role yang bisa dipilih user (isSelectable = true),
 * diurutkan berdasarkan sortOrder.
 * Endpoint ini PUBLIK — tidak butuh auth.
 */
export async function getSelectableRoles() {
  return prisma.role.findMany({
    where: { isSelectable: true },
    select: PUBLIC_ROLE_SELECT,
    orderBy: { sortOrder: "asc" },
  });
}

/**
 * GET /api/admin/roles
 * Ambil SEMUA role termasuk ADMIN — untuk panel admin.
 */
export async function getAllRoles() {
  return prisma.role.findMany({
    select: { ...PUBLIC_ROLE_SELECT, createdAt: true, updatedAt: true },
    orderBy: { sortOrder: "asc" },
  });
}

/**
 * GET /api/admin/roles/:id
 */
export async function getRoleById(id: string) {
  return prisma.role.findUnique({
    where: { id },
    select: { ...PUBLIC_ROLE_SELECT, createdAt: true, updatedAt: true },
  });
}

/**
 * POST /api/admin/roles
 * Buat role baru.
 */
export async function createRole(body: UpsertRoleBody) {
  const existing = await prisma.role.findUnique({ where: { name: body.name } });
  if (existing) {
    throw new Error("ROLE_NAME_TAKEN");
  }

  return prisma.role.create({
    data: {
      name: body.name,
      displayName: body.displayName,
      title: body.title,
      description: body.description,
      perks: body.perks,
      iconUrl: body.iconUrl ?? null,
      color: body.color,
      glow: body.glow,
      tag: body.tag ?? null,
      isSelectable: body.isSelectable,
      sortOrder: body.sortOrder,
    },
    select: PUBLIC_ROLE_SELECT,
  });
}

/**
 * PATCH /api/admin/roles/:id
 * Update role. name tidak bisa diubah lewat endpoint ini
 * (nama role adalah identifier sistem — DREAMER/CHASER/ADMIN).
 */
export async function updateRole(id: string, body: Partial<UpsertRoleBody>) {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) throw new Error("ROLE_NOT_FOUND");

  // Kalau name diubah, cek duplikat
  if (body.name && body.name !== role.name) {
    const conflict = await prisma.role.findUnique({ where: { name: body.name } });
    if (conflict) throw new Error("ROLE_NAME_TAKEN");
  }

  return prisma.role.update({
    where: { id },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.displayName && { displayName: body.displayName }),
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description && { description: body.description }),
      ...(body.perks && { perks: body.perks }),
      ...(body.iconUrl !== undefined && { iconUrl: body.iconUrl }),
      ...(body.color && { color: body.color }),
      ...(body.glow && { glow: body.glow }),
      ...(body.tag !== undefined && { tag: body.tag }),
      ...(body.isSelectable !== undefined && { isSelectable: body.isSelectable }),
      ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
    },
    select: PUBLIC_ROLE_SELECT,
  });
}

/**
 * DELETE /api/admin/roles/:id
 * Hapus role. Tidak bisa menghapus DREAMER, CHASER, atau ADMIN
 * (role sistem yang sudah ada user-nya).
 */
export async function deleteRole(id: string) {
  const role = await prisma.role.findUnique({
    where: { id },
    include: { _count: { select: { users: true } } },
  });

  if (!role) throw new Error("ROLE_NOT_FOUND");

  const SYSTEM_ROLES = ["DREAMER", "CHASER", "ADMIN"];
  if (SYSTEM_ROLES.includes(role.name)) {
    throw new Error("ROLE_SYSTEM_PROTECTED");
  }

  if (role._count.users > 0) {
    throw new Error("ROLE_HAS_USERS");
  }

  await prisma.role.delete({ where: { id } });
  return { deleted: true, id };
}
