import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  // File JSON ada di backend root, dua level di atas src/scripts/
  const jsonPath = path.join(__dirname, '..', '..', 'university_template.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`File not found: ${jsonPath}`);
    process.exit(1);
  }

  const fileData = fs.readFileSync(jsonPath, 'utf-8');
  const universities = JSON.parse(fileData);

  console.log(`Found ${universities.length} universities in JSON. Seeding...`);

  for (const uni of universities) {
    // Check if university + title (faculty) combination already exists
    const existingUni = await prisma.university.findFirst({
      where: { 
        name: uni.name,
        title: uni.title || null
      }
    });

    if (existingUni) {
      await prisma.university.update({
        where: { id: existingUni.id },
        data: {
          country: uni.country,
          location: uni.location,
          coverImageUrl: uni.coverImageUrl,
          riasecCode: uni.riasecCode,
          accreditation: uni.accreditation,
          description: uni.description,
          facultyTags: uni.facultyTags || [],
          estimatedCostMin: uni.estimatedCostMin,
          estimatedCostMax: uni.estimatedCostMax,
          admissionRequirements: uni.admissionRequirements,
          website: uni.website,
        },
      });
      console.log(`✅ Updated: ${uni.name} - ${uni.title || 'General'}`);
    } else {
      await prisma.university.create({
        data: {
          name: uni.name,
          title: uni.title || null,
          country: uni.country,
          location: uni.location,
          coverImageUrl: uni.coverImageUrl,
          riasecCode: uni.riasecCode,
          accreditation: uni.accreditation,
          description: uni.description,
          facultyTags: uni.facultyTags || [],
          estimatedCostMin: uni.estimatedCostMin,
          estimatedCostMax: uni.estimatedCostMax,
          admissionRequirements: uni.admissionRequirements,
          website: uni.website,
        },
      });
      console.log(`✅ Created: ${uni.name} - ${uni.title || 'General'}`);
    }
  }

  console.log('🎉 Seeding universities completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
