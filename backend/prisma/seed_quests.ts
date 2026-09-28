import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Quests...');
  const quests = [
    {
      title: 'Selesaikan 1 Modul',
      description: 'Dapatkan XP dari modul pertama',
      type: 'MODULE_COMPLETED',
      rewardXp: 100,
      targetCount: 1
    },
    {
      title: 'Daily Login',
      description: 'Login 3 hari berturut-turut',
      type: 'DAILY_LOGIN',
      rewardXp: 50,
      targetCount: 3
    },
    {
      title: 'Kalahkan Boss HTML',
      description: 'Selesaikan kuis akhir di House of Tech',
      type: 'QUIZ_BOSS_COMPLETED',
      rewardXp: 300,
      targetCount: 1
    },
    {
      title: 'Klaim SBT First House Master',
      description: 'Selesaikan evaluasi tahap 4 mini project',
      type: 'SBT_CLAIMED',
      rewardXp: 500,
      targetCount: 1
    }
  ];

  for (const q of quests) {
    const exists = await prisma.questDefinition.findFirst({ where: { title: q.title } });
    if (!exists) {
      await prisma.questDefinition.create({ data: q });
    }
  }

  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
