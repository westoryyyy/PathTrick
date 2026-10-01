import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const houses = await prisma.house.findMany();
  console.log(JSON.stringify(houses, null, 2));
}

main().finally(() => prisma.$disconnect());
