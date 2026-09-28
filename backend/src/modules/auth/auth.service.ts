import { prisma } from "../../lib/prisma";
import { SyncBody } from "./auth.schema";

/**
 * Upsert User berdasarkan privyId yang SUDAH terverifikasi lewat token.
 * email/name di sini cuma data profil tambahan (best-effort), bukan
 * sumber identitas — jadi upsert-nya aman dipanggil berkali-kali tiap
 * kali user login ulang tanpa duplikasi.
 */
export async function syncUserFromPrivy(privyId: string, profile: SyncBody) {
  const user = await prisma.user.upsert({
    where: { privyId },
    create: {
      privyId,
      email: profile.email,
      name: profile.name,
      walletAddress: profile.walletAddress,
    },
    update: {
      // Hanya update field yang memang dikirim, jangan timpa data lama
      // dengan `undefined` kalau frontend kebetulan tidak mengirim field ini.
      ...(profile.email ? { email: profile.email } : {}),
      ...(profile.name ? { name: profile.name } : {}),
      ...(profile.walletAddress ? { walletAddress: profile.walletAddress } : {}),
    },
    // include role supaya auth.route.ts bisa baca user.role?.name
    // saat menerbitkan JWT tanpa perlu query tambahan.
    include: { role: true },
  });

  // Pastikan row Gamification selalu ada sejak user pertama kali sync —
  // supaya endpoint dashboard nanti tidak perlu handle kasus "belum ada".
  await prisma.gamification.upsert({
    where: { userId: user.id },
    create: { userId: user.id },
    update: {},
  });

  const dateStr = new Date().toISOString().split('T')[0];
  try {
    await prisma.userLoginEvent.upsert({
      where: { userId_dateStr: { userId: user.id, dateStr } },
      create: { userId: user.id, dateStr },
      update: {},
    });
  } catch (err) {
    // ignore
  }

  return user;
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { gamification: true, role: true },
  });
}