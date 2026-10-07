import { prisma } from "../../lib/prisma";
import { UpsertRoleBody } from "./roles.schema";

const normalizeRolePerks = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const localeCandidates = [record.en, record.id, record.ms, record["in"]];

    for (const candidate of localeCandidates) {
      if (Array.isArray(candidate)) {
        return candidate.filter((item): item is string => typeof item === "string");
      }
    }
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return normalizeRolePerks(parsed);
    } catch {
      return [];
    }
  }

  return [];
};

type RoleRow = {
  id: string;
  name: string;
  displayName: string;
  title: string;
  description: string;
  perks: unknown;
  iconUrl: string | null;
  color: string;
  glow: string;
  tag: string | null;
  isSelectable: boolean;
  sortOrder: number;
  createdAt: string | Date;
  updatedAt: string | Date;
};

const mapRoleRow = (row: RoleRow) => ({
  ...row,
  perks: normalizeRolePerks(row.perks),
  createdAt: new Date(row.createdAt),
  updatedAt: new Date(row.updatedAt),
});

// -----------------------------------------------------------------------
// Selector standar untuk response publik (tanpa field internal)
// -----------------------------------------------------------------------
const PUBLIC_ROLE_SELECT = {
  id: true,
  name: true,
  displayName: true,
  title: true,
  description: true,
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
  const rows = await prisma.$queryRaw<RoleRow[]>`
    SELECT
      "id",
      "name",
      "displayName",
      "title",
      "description",
      "perks",
      "iconUrl",
      "color",
      "glow",
      "tag",
      "isSelectable",
      "sortOrder",
      "createdAt",
      "updatedAt"
    FROM "Role"
    WHERE "isSelectable" = true
    ORDER BY "sortOrder" ASC
  `;

  return rows.map(mapRoleRow);
}

/**
 * GET /api/admin/roles
 * Ambil SEMUA role termasuk ADMIN — untuk panel admin.
 */
export async function getAllRoles() {
  const rows = await prisma.$queryRaw<RoleRow[]>`
    SELECT
      "id",
      "name",
      "displayName",
      "title",
      "description",
      "perks",
      "iconUrl",
      "color",
      "glow",
      "tag",
      "isSelectable",
      "sortOrder",
      "createdAt",
      "updatedAt"
    FROM "Role"
    ORDER BY "sortOrder" ASC
  `;

  return rows.map(mapRoleRow);
}

/**
 * GET /api/admin/roles/:id
 */
export async function getRoleById(id: string) {
  const rows = await prisma.$queryRaw<RoleRow[]>`
    SELECT
      "id",
      "name",
      "displayName",
      "title",
      "description",
      "perks",
      "iconUrl",
      "color",
      "glow",
      "tag",
      "isSelectable",
      "sortOrder",
      "createdAt",
      "updatedAt"
    FROM "Role"
    WHERE "id" = ${id}
    LIMIT 1
  `;

  return rows[0] ? mapRoleRow(rows[0]) : null;
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
