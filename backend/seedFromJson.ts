// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function run() {
  const filePath = path.join(__dirname, 'course_template.json');
  if (!fs.existsSync(filePath)) {
    console.error('File course_template.json tidak ditemukan!');
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const courseData = JSON.parse(raw);

  console.log('Ensuring house-health exists...');
  const houseHealth = await prisma.house.upsert({
    where: { id: 'house-health' },
    update: {},
    create: {
      id: 'house-health',
      title: 'House of Health & Welfare',
      description: 'Kedokteran, Keperawatan, Farmasi & Pekerjaan Sosial',
      icon: '🏥',
      houseNumber: 9,
      gradient: 'from-rose-400 via-red-400 to-pink-500',
      skillsOverview: ['Diagnosis Klinis', 'Asuhan Keperawatan', 'Farmakologi', 'Konseling Psikologi', 'Manajemen Kesehatan'],
      idealFor: ['Sangat peduli dan ingin membantu orang sakit', 'Tahan banting menghadapi situasi darurat', 'Teliti dalam memberikan obat', 'Punya empati tinggi'],
      status: 'active',
      isPublished: true,
    }
  });

  console.log('Creating course:', courseData.title);
  
  await prisma.course.deleteMany({
    where: { title: courseData.title }
  });

  const course = await prisma.course.create({
    data: {
      houseId: houseHealth.id,
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
              category: sec.isBossLevel ? 'milestone' : 'skill',
              xpReward: sec.isBossLevel ? 500 : 100,
              quiz: sec.quiz ? {
                create: {
                  title: sec.quiz.title || ("Kuis: " + (sec.levelTitle || sec.title)),
                  passingScore: sec.quiz.passingScore || 75,
                  questions: {
                    create: (sec.quiz.pertanyaan || sec.quiz.questions || []).map((q: any, qIdx: number) => ({
                      prompt: q.pertanyaan || q.prompt,
                      type: q.tipe || q.type || 'MULTIPLE_CHOICE',
                      options: (q.pilihan || q.options || []).map((opt: any) => ({
                        id: opt.id,
                        text: opt.teks || opt.text
                      })),
                      correctAnswer: (q.tipe || q.type) === 'ESSAY' 
                        ? { text: q.jawabanBenar || q.correctAnswer, keywords: q.keywords || [] } 
                        : (q.jawabanBenar || q.correctAnswer),
                      points: (q.tipe || q.type) === 'ESSAY' ? 10 : 1,
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
