import { prisma } from '../../lib/prisma';

export type NotificationDbLike = {
  notification: {
    create: (args: { data: any }) => Promise<any>;
  };
};

export async function createSystemNotification(
  db: NotificationDbLike | typeof prisma,
  userId: string,
  title: string,
  body: string
) {
  return db.notification.create({
    data: {
      userId,
      type: 'SYSTEM_MESSAGE',
      title,
      body,
    },
  });
}

export async function createCertificateNotification(
  db: NotificationDbLike | typeof prisma,
  userId: string,
  title: string,
  body: string
) {
  return db.notification.create({
    data: {
      userId,
      type: 'CERTIFICATE_STATUS_CHANGED',
      title,
      body,
    },
  });
}

export async function maybeCreateLevelUpNotification(
  db: NotificationDbLike | typeof prisma,
  userId: string,
  previousXp: number,
  newXp: number
) {
  const previousLevel = Math.max(1, Math.floor(previousXp / 1000) + 1);
  const nextLevel = Math.max(1, Math.floor(newXp / 1000) + 1);

  if (nextLevel <= previousLevel) return null;

  return createSystemNotification(
    db,
    userId,
    `Level naik ke ${nextLevel}!`,
    `Selamat! Kamu naik level dan membuka tantangan baru di PathTrick.`
  );
}
