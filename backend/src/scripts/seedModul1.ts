import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function run() {
  // File JSON ada di root backend, dua level di atas src/scripts/
  const filePath = path.join(__dirname, '..', '..', 'modul1.json');
  if (!fs.existsSync(filePath)) {
    console.error('File modul1.json tidak ditemukan!');
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const courseData = JSON.parse(raw);

  console.log('Ensuring house-ict exists...');
  const houseBusiness = await prisma.house.findUnique({
    where: { id: 'house-ict' }
  });

  if (!houseBusiness) {
    console.error('house-ict not found in database. Run global seed first!');
    process.exit(1);
  }

  console.log('Creating course:', courseData.title);
  
  await prisma.course.deleteMany({
    where: { title: courseData.title }
  });

  const course = await prisma.course.create({
    data: {
      houseId: houseBusiness.id,
      title: courseData.title,
      description: courseData.description,
      facultyTags: courseData.facultyTags || [],
      level: courseData.level || "beginner",
      isPublished: true,
      isFallback: false,
      chapters: {
        create: (courseData.chapters || []).map((chap: any, cIdx: number) => ({
          title: chap.babTitle || chap.title,
          order: cIdx + 1,
          durationLabel: (chap.levels || chap.sections || []).length + " Levels",
          sections: {
            create: (chap.levels || chap.sections || []).map((sec: any, sIdx: number) => ({
              title: sec.levelTitle || sec.title,
              missionId: sec.missionId || null,
              order: sIdx + 1,
              content: sec.materi || sec.content,
              category: sec.isBossLevel || sec.title.toLowerCase().includes('boss') ? 'milestone' : 'skill',
              xpReward: sec.xpReward || (sec.isBossLevel || sec.title.toLowerCase().includes('boss') ? 500 : 100),
              quiz: sec.quiz ? {
                create: {
                  title: sec.quiz.title || ("Kuis: " + (sec.levelTitle || sec.title)),
                  passingScore: sec.quiz.passingScore || 75,
                  questions: {
                    create: (sec.quiz.pertanyaan || sec.quiz.questions || []).map((q: any, qIdx: number) => ({
                      prompt: q.pertanyaan || q.prompt,
                      type: q.tipe || q.type || 'MULTIPLE_CHOICE',
                      options: (q.pilihan || q.options || []).map((opt: any) => ({
                        id: opt.id || opt,
                        text: opt.teks || opt.text || opt
                      })),
                      correctAnswer: (q.tipe || q.type) === 'ESSAY' 
                        ? { text: q.jawabanBenar?.text || q.correctAnswer?.text || q.correctAnswer, keywords: q.jawabanBenar?.keywords || q.correctAnswer?.keywords || [] } 
                        : (q.jawabanBenar || q.correctAnswer),
                      points: q.points || ((q.tipe || q.type) === 'ESSAY' ? 40 : 25),
                      order: qIdx + 1
                    }))
                  }
                }
              } : undefined
            }))
          }
        }))
      }
    }
  });

  console.log('Successfully created course with ID:', course.id);
}

run()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
