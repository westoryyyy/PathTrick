import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.join(__dirname, '..', '..', 'scholarship_template.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`File not found: ${jsonPath}`);
    process.exit(1);
  }

  const fileData = fs.readFileSync(jsonPath, 'utf-8');
  const scholarships = JSON.parse(fileData);

  console.log(`Found ${scholarships.length} scholarships in JSON. Seeding...`);

  for (const sch of scholarships) {
    // Parse deadline to ISO Date
    const parsedDeadline = sch.deadline ? new Date(sch.deadline) : new Date();
    
    // Upsert by name to prevent duplicates if run multiple times
    const existingSch = await prisma.scholarship.findFirst({
      where: { name: sch.name }
    });

    if (existingSch) {
      await prisma.scholarship.update({
        where: { id: existingSch.id },
        data: {
          country: sch.country,
          deadline: parsedDeadline,
          requirements: sch.requirements,
          requiredDocuments: sch.requiredDocuments || [],
          facultyTags: sch.facultyTags || [],
          scope: sch.scope,
          provider: sch.provider,
          amount: sch.amount,
          officialUrl: sch.officialUrl,
          coverImageUrl: sch.coverImageUrl,
        }
      });
      console.log(`✅ Updated: ${sch.name}`);
    } else {
      const createdSch = await prisma.scholarship.create({
        data: {
          name: sch.name,
          country: sch.country,
          deadline: parsedDeadline,
          requirements: sch.requirements,
          requiredDocuments: sch.requiredDocuments || [],
          facultyTags: sch.facultyTags || [],
          scope: sch.scope,
          provider: sch.provider,
          amount: sch.amount,
          officialUrl: sch.officialUrl,
          coverImageUrl: sch.coverImageUrl,
        }
      });
      console.log(`✅ Created: ${createdSch.name}`);
    }
  }

  console.log('🎉 Seeding scholarships completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
