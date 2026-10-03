import { prisma } from "../../lib/prisma";

/**
 * Set atau ganti role user (DREAMER atau CHASER \u2014 bukan ADMIN).
 * ADMIN hanya bisa di-assign manual lewat DB/Prisma Studio.
 *
 * Kalau sudah ada role sebelumnya dan diganti, roadmap lama yang ACTIVE
 * tidak dibatalkan di sini \u2014 itu terjadi saat user submit assessment baru
 * (supersedeActiveRoadmap di assessment.service.ts). Fungsi ini murni
 * update field User.roleId.
 *
 * Kenapa tidak dibatasi "hanya bisa di-set sekali"?
 * Keputusan produk: user boleh ganti role (misalnya SMA yang sudah lulus
 * lalu pindah ke Chaser). Assessment dan roadmap lama tetap tersimpan
 * sebagai histori (tidak dihapus), tapi tidak akan aktif lagi.
 */
export async function setUserRole(userId: string, roleName: string) {
  // Cegah user meng-assign diri sendiri jadi ADMIN lewat API
  if (roleName.toUpperCase() === "ADMIN") {
    throw new Error("ROLE_NOT_SELECTABLE");
  }

  const role = await prisma.role.findUnique({
    where: { name: roleName.toUpperCase() },
  });

  if (!role) {
    throw new Error("ROLE_NOT_FOUND");
  }

  if (!role.isSelectable) {
    throw new Error("ROLE_NOT_SELECTABLE");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { roleId: role.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: {
        select: { name: true, displayName: true, description: true, perks: true },
      },
    },
  });
}

/**
 * Set role user berdasarkan roleId (bukan roleName).
 * Dipakai oleh POST /api/users/me/role.
 */
export async function setUserRoleById(userId: string, roleId: string) {
  const role = await prisma.role.findUnique({ where: { id: roleId } });

  if (!role) throw new Error("ROLE_NOT_FOUND");
  if (!role.isSelectable) throw new Error("ROLE_NOT_SELECTABLE");
  // Cegah user assign diri sendiri jadi ADMIN
  if (role.name.toUpperCase() === "ADMIN") throw new Error("ROLE_NOT_SELECTABLE");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("USER_NOT_FOUND");

  return prisma.user.update({
    where: { id: userId },
    data: { roleId: role.id },
    select: {
      id: true,
      name: true,
      email: true,
      roleId: true,
      role: {
        select: { id: true, name: true, displayName: true, description: true, perks: true },
      },
    },
  });
}

/**
 * Ambil profil user lengkap \u2014 dipakai GET /api/users/me.
 */
export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: {
        select: {
          name: true,
          displayName: true,
          description: true,
          perks: true,
          iconUrl: true,
        },
      },
      walletAddress: true,
      walletConnectedAt: true,
      createdAt: true,
      gamification: { select: { xp: true } },
      roadmaps: {
        where: { status: "ACTIVE" },
        include: {
          universityMatches: { include: { university: true } },
          scholarshipMatches: { include: { scholarship: true } },
          jobMatches: { include: { job: true } },
          courses: {
            orderBy: { order: "asc" },
            include: {
              course: {
                include: {
                  house: true,
                  chapters: { include: { sections: true } },
                },
              },
            },
          },
        }
      },
    },
  });
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  return user;
}
