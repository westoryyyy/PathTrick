const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const log = await prisma.aIInteractionLog.findFirst({
    orderBy: { createdAt: 'desc' }
  });
  console.log(JSON.stringify(log, null, 2));
}

main().finally(() => prisma.$disconnect());
