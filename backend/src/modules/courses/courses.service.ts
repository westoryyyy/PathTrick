import { prisma } from "../../lib/prisma";

// -----------------------------------------------------------------------
// Courses service — query & business logic untuk Learning Mission & Houses.
// Semua fungsi di sini murni deterministik (tidak ada AI call).
// -----------------------------------------------------------------------

/**
 * Ambil daftar course dari roadmap aktif user.
 * Diurutkan berdasar `order` di RoadmapCourse.
 */
export async function getCoursesForUser(userId: string) {
  // Cari roadmap aktif
  const roadmap = await prisma.roadmap.findFirst({
    where: { userId, status: "ACTIVE" },
    include: {
      courses: {
        orderBy: { order: "asc" },
        include: {
          course: {
            select: {
              id: true,
              onChainId: true,
              title: true,
              description: true,
              coverImageUrl: true,
              level: true,
              facultyTags: true,
              houseId: true,
              skills: { select: { id: true, name: true, coverImageUrl: true } },
              chapters: {
                select: {
                  id: true,
                  _count: { select: { sections: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!roadmap) return { roadmapId: null, courses: [] };

  // Ambil progress user untuk course-course ini
  const courseIds = roadmap.courses.map((rc) => rc.courseId);
  const progressList = await prisma.courseProgress.findMany({
    where: { userId, courseId: { in: courseIds } },
    select: { courseId: true, status: true, currentChapterOrder: true, currentSectionOrder: true, finalScore: true },
  });
  const progressMap = new Map(progressList.map((p) => [p.courseId, p]));

  return {
    roadmapId: roadmap.id,
    courses: roadmap.courses.map((rc) => {
      const totalSections = rc.course.chapters.reduce((sum, ch) => sum + ch._count.sections, 0);
      return {
        order: rc.order,
        reasonRecommended: rc.reasonRecommended,
        ...rc.course,
        sectionCount: totalSections,
        progress: progressMap.get(rc.courseId) ?? {
          status: "NOT_STARTED",
          currentChapterOrder: 1,
          currentSectionOrder: 1,
          finalScore: null,
        },
      };
    }),
  };
}

/**
 * Ambil detail 1 course + chapters + sections + quiz (tanpa correctAnswer — jangan
 * ekspos jawaban ke user sebelum submit).
 */
export async function getCourseDetail(courseId: string, userId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId, isPublished: true },
    include: {
      skills: { select: { id: true, name: true } },
      house: true,
      chapters: {
        orderBy: { order: "asc" },
        include: {
          sections: {
            orderBy: { order: "asc" },
            include: {
              quiz: {
                include: {
                  questions: {
                    orderBy: { order: "asc" },
                    select: {
                      id: true,
                      prompt: true,
                      options: true, // opsi pilihan ganda
                      points: true,
                      difficulty: true,
                      order: true,
                      // correctAnswer SENGAJA TIDAK DI-SELECT — tidak boleh bocor ke FE
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!course) return null;

  // Ambil atau buat CourseProgress
  let progress = await prisma.courseProgress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (!progress) {
    progress = await prisma.courseProgress.create({
      data: { userId, courseId, status: "NOT_STARTED", currentChapterOrder: 1, currentSectionOrder: 1 },
    });
  }

  // Filter section yang bisa diakses berdasarkan currentChapterOrder dan currentSectionOrder
  const accessibleChapters = course.chapters.map((chapter) => {
    const isChapterUnlocked = chapter.order <= progress!.currentChapterOrder;
    const accessibleSections = chapter.sections.map((section) => {
      const isLocked =
        chapter.order > progress!.currentChapterOrder ||
        (chapter.order === progress!.currentChapterOrder && section.order > progress!.currentSectionOrder);
      return {
        ...section,
        locked: isLocked,
      };
    });

    return {
      ...chapter,
      locked: !isChapterUnlocked,
      sections: accessibleSections,
    };
  });

  return {
    ...course,
    chapters: accessibleChapters,
    progress: {
      status: progress.status,
      currentChapterOrder: progress.currentChapterOrder,
      currentSectionOrder: progress.currentSectionOrder,
      finalScore: progress.finalScore,
    },
  };
}

/**
 * Submit jawaban quiz untuk 1 section.
 * Grading deterministik — tidak ada AI.
 */
export async function submitQuiz(params: {
  userId: string;
  courseId: string;
  sectionId: string;
  answers: Array<{ questionId: string; selectedAnswer: string }>; // selectedAnswer = "a" | "b" | "c" | "d"
}) {
  // Validasi section ada dan milik course (via courseChapter)
  const section = await prisma.courseSection.findFirst({
    where: {
      id: params.sectionId,
      courseChapter: { courseId: params.courseId },
    },
    include: {
      courseChapter: true,
      quiz: {
        include: {
          questions: {
            select: { id: true, correctAnswer: true, points: true, order: true },
          },
        },
      },
    },
  });

  if (!section?.quiz) {
    throw new Error("QUIZ_NOT_FOUND");
  }

  // Ambil/buat CourseProgress
  let progress = await prisma.courseProgress.findUnique({
    where: { userId_courseId: { userId: params.userId, courseId: params.courseId } },
  });

  if (!progress) {
    progress = await prisma.courseProgress.create({
      data: {
        userId: params.userId,
        courseId: params.courseId,
        status: "IN_PROGRESS",
        currentChapterOrder: 1,
        currentSectionOrder: 1,
        startedAt: new Date(),
      },
    });
  }

  // Validasi section belum dikunci untuk user ini
  const isLocked =
    section.courseChapter.order > progress.currentChapterOrder ||
    (section.courseChapter.order === progress.currentChapterOrder && section.order > progress.currentSectionOrder);

  if (isLocked) {
    throw new Error("SECTION_LOCKED");
  }

  // Grading
  const answerMap = new Map(params.answers.map((a) => [a.questionId, a.selectedAnswer]));
  const questions = section.quiz.questions;

  let totalPoints = 0;
  let earnedPoints = 0;
  let correctAnswerCount = 0;
  const gradedAnswers: Array<{
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
  }> = [];

  for (const question of questions) {
    totalPoints += question.points;
    const selectedAnswer = answerMap.get(question.id);
    const correctAnswerObj = question.correctAnswer as { id: string } | null;
    const isCorrect = selectedAnswer !== undefined && selectedAnswer === correctAnswerObj?.id;
    if (isCorrect) {
      earnedPoints += question.points;
      correctAnswerCount++;
    }

    gradedAnswers.push({
      questionId: question.id,
      selectedAnswer: selectedAnswer ?? "",
      isCorrect,
    });
  }

  const scorePercent = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const passed = scorePercent >= section.quiz.passingScore;

  // Simpan QuizAttempt + QuizAnswer dalam transaksi
  const attempt = await prisma.$transaction(async (tx) => {
    if (progress!.status === "NOT_STARTED") {
      await tx.courseProgress.update({
        where: { id: progress!.id },
        data: { status: "IN_PROGRESS", startedAt: new Date() },
      });
    }

    const newAttempt = await tx.quizAttempt.create({
      data: {
        courseProgressId: progress!.id,
        quizId: section.quiz!.id,
        chapterOrder: section.courseChapter.order,
        sectionOrder: section.order,
        score: scorePercent,
        passed,
      },
    });

    await tx.quizAnswer.createMany({
      data: gradedAnswers.map((a) => ({
        attemptId: newAttempt.id,
        questionId: a.questionId,
        selectedAnswer: a.selectedAnswer,
        isCorrect: a.isCorrect,
      })),
    });

    // Kalau lulus, buka level berikutnya
    if (passed) {
      // Hitung total section di chapter ini
      const sectionsInChapter = await tx.courseSection.count({
        where: { courseChapterId: section.courseChapterId },
      });

      const isLastSectionInChapter = section.order >= sectionsInChapter;

      if (isLastSectionInChapter) {
        // Cek apakah ini chapter terakhir di course
        const totalChapters = await tx.courseChapter.count({
          where: { courseId: params.courseId },
        });

        const isLastChapter = section.courseChapter.order >= totalChapters;

        if (isLastChapter) {
          // Course selesai
          const allAttempts = await tx.quizAttempt.findMany({
            where: { courseProgressId: progress!.id },
            orderBy: { createdAt: "desc" },
          });

          const latestByQuiz = new Map<string, number>();
          for (const a of allAttempts) {
            if (!latestByQuiz.has(a.quizId)) {
              latestByQuiz.set(a.quizId, a.score);
            }
          }
          const avgScore =
            latestByQuiz.size > 0
              ? Math.round([...latestByQuiz.values()].reduce((sum, s) => sum + s, 0) / latestByQuiz.size)
              : scorePercent;

          await tx.courseProgress.update({
            where: { id: progress!.id },
            data: {
              status: "COMPLETED",
              finalScore: avgScore,
              completedAt: new Date(),
              currentChapterOrder: section.courseChapter.order,
              currentSectionOrder: section.order + 1,
            },
          });

          await createBadgeAndCertificate(tx, progress!.id, params.userId, params.courseId);
          await addXp(tx, params.userId, 100);
        } else {
          // Pindah ke Chapter berikutnya, section 1
          await tx.courseProgress.update({
            where: { id: progress!.id },
            data: {
              status: "IN_PROGRESS",
              currentChapterOrder: section.courseChapter.order + 1,
              currentSectionOrder: 1,
            },
          });
          await addXp(tx, params.userId, 20);
        }
      } else {
        // Pindah ke Section berikutnya dalam Chapter yang sama
        await tx.courseProgress.update({
          where: { id: progress!.id },
          data: {
            status: "IN_PROGRESS",
            currentSectionOrder: section.order + 1,
          },
        });
        await addXp(tx, params.userId, 10);
      }
    }

    return newAttempt;
  });

  return {
    attemptId: attempt.id,
    score: scorePercent,
    passed,
    passingScore: section.quiz.passingScore,
    correctCount: correctAnswerCount,
    totalQuestions: questions.length,
    nextSectionUnlocked: passed,
  };
}

// -----------------------------------------------------------------------
// Helper internal
// -----------------------------------------------------------------------

async function createBadgeAndCertificate(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  courseProgressId: string,
  userId: string,
  courseId: string
) {
  const course = await tx.course.findUnique({
    where: { id: courseId },
    select: { onChainId: true, title: true },
  });
  if (!course) return;

  await tx.skillBadge.create({
    data: {
      userId,
      courseProgressId,
      courseOnChainId: BigInt(course.onChainId),
      status: "EARNED",
    },
  });
}

async function addXp(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  userId: string,
  xpAmount: number
) {
  await tx.gamification.upsert({
    where: { userId },
    update: { xp: { increment: xpAmount } },
    create: { userId, xp: xpAmount },
  });
}

/**
 * Submit jawaban berupa raw code (Project/Boss phase).
 * Evaluasi dilakukan secara lokal dengan string matching (seperti mock sebelumnya).
 */
export async function submitProject(params: {
  userId: string;
  courseId: string;
  sectionId: string;
  code: string;
}) {
  const section = await prisma.courseSection.findFirst({
    where: {
      id: params.sectionId,
      courseChapter: { courseId: params.courseId },
    },
    include: { courseChapter: true },
  });

  if (!section) throw new Error("SECTION_NOT_FOUND");

  let progress = await prisma.courseProgress.findUnique({
    where: { userId_courseId: { userId: params.userId, courseId: params.courseId } },
  });

  if (!progress) {
    progress = await prisma.courseProgress.create({
      data: {
        userId: params.userId,
        courseId: params.courseId,
        status: "IN_PROGRESS",
        currentChapterOrder: 1,
        currentSectionOrder: 1,
        startedAt: new Date(),
      },
    });
  }

  const isLocked =
    section.courseChapter.order > progress.currentChapterOrder ||
    (section.courseChapter.order === progress.currentChapterOrder && section.order > progress.currentSectionOrder);

  if (isLocked) throw new Error("SECTION_LOCKED");

  let passed = false;
  let message = '';
  const cleanCode = params.code.replace('<!-- Tulis kodemu di bawah ini -->', '').replace('<!-- Tulis kodemu di sini -->', '').trim().toLowerCase();
  const openBrackets = cleanCode.split('<').length - 1;
  const closeBrackets = cleanCode.split('>').length - 1;

  if (!cleanCode) {
    passed = false;
    message = 'Kode masih kosong atau belum diubah. Silakan kerjakan tantangan ini!';
  } else if (openBrackets !== closeBrackets) {
    passed = false;
    message = 'Sintaks Error! Sepertinya ada tag HTML yang tidak ditutup dengan benar (kekurangan karakter "<" atau ">"). Harap lebih teliti ya, Ksatria!';
  } else {
    
    const expectedKeywords = section.expectedKeywords as string[];
    if (expectedKeywords && Array.isArray(expectedKeywords) && expectedKeywords.length > 0) {
      let missingKeywords = [];
      for (const kw of expectedKeywords) {
        if (!cleanCode.includes(kw.toLowerCase())) {
          missingKeywords.push(kw);
        }
      }
      
      if (missingKeywords.length === 0) {
        passed = true;
        message = 'Tantangan berhasil diselesaikan!';
      } else {
        passed = false;
        message = 'Hampir! Sepertinya kodemu kurang keyword berikut: ' + missingKeywords.join(', ');
      }
    } else {
      // Default fallback jika admin tidak set expectedKeywords
      passed = true;
      message = 'Tantangan berhasil diselesaikan (No keywords set).';
    }

  }

  if (passed) {
    await prisma.$transaction(async (tx) => {
      const sectionsInChapter = await tx.courseSection.count({
        where: { courseChapterId: section.courseChapterId },
      });

      const isLastSectionInChapter = section.order >= sectionsInChapter;
      
      // Update progress if this was the current active section
      if (progress.currentChapterOrder === section.courseChapter.order && progress.currentSectionOrder === section.order) {
        if (isLastSectionInChapter) {
          const totalChapters = await tx.courseChapter.count({
            where: { courseId: params.courseId },
          });

          const isLastChapter = section.courseChapter.order >= totalChapters;

          if (isLastChapter) {
            await tx.courseProgress.update({
              where: { id: progress.id },
              data: {
                status: "COMPLETED",
                finalScore: 100,
                completedAt: new Date(),
                currentChapterOrder: section.courseChapter.order,
                currentSectionOrder: section.order + 1,
              },
            });
            await createBadgeAndCertificate(tx, progress.id, params.userId, params.courseId);
            await addXp(tx, params.userId, 100);
          } else {
            await tx.courseProgress.update({
              where: { id: progress.id },
              data: {
                currentChapterOrder: section.courseChapter.order + 1,
                currentSectionOrder: 1,
              },
            });
            await addXp(tx, params.userId, 25);
          }
        } else {
          await tx.courseProgress.update({
            where: { id: progress.id },
            data: { currentSectionOrder: section.order + 1 },
          });
          await addXp(tx, params.userId, 10);
        }
      }
    });
  }

  return { passed, message, score: passed ? 100 : 40, nextSectionUnlocked: passed };
}

export async function getRoadmapNodes(userId: string) {
  const roadmap = await prisma.roadmap.findFirst({
    where: { userId, status: 'ACTIVE' },
    include: {
      courses: {
        orderBy: { order: 'asc' },
        include: {
          course: {
            select: {
              id: true,
              houseId: true,
              chapters: {
                orderBy: { order: 'asc' },
                select: {
                  id: true,
                  order: true,
                  sections: {
                    orderBy: { order: 'asc' },
                    select: {
                      id: true,
                      order: true,
                      title: true,
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!roadmap) return [];

  const courseIds = roadmap.courses.map(rc => rc.courseId);
  const progressList = await prisma.courseProgress.findMany({
    where: { userId, courseId: { in: courseIds } },
    select: { courseId: true, currentChapterOrder: true, currentSectionOrder: true, status: true }
  });
  const progressMap = new Map(progressList.map(p => [p.courseId, p]));

  const nodes: any[] = [];
  
  for (const rc of roadmap.courses) {
    const course = rc.course;
    const progress = progressMap.get(course.id) || { currentChapterOrder: 1, currentSectionOrder: 1, status: 'NOT_STARTED' };
    
    for (const chapter of course.chapters) {
      for (const section of chapter.sections) {
        const isLocked = chapter.order > progress.currentChapterOrder || 
          (chapter.order === progress.currentChapterOrder && section.order > progress.currentSectionOrder);
        
        const isCompleted = chapter.order < progress.currentChapterOrder || 
          (chapter.order === progress.currentChapterOrder && section.order < progress.currentSectionOrder) || progress.status === 'COMPLETED';

        nodes.push({
          houseId: course.houseId,
          courseId: course.id,
          chapterId: chapter.id,
          sectionId: section.id,
          order: section.order,
          title: section.title,
          locked: isLocked,
          completed: isCompleted,
          status: isCompleted ? 'completed' : (isLocked ? 'locked' : 'available')
        });
      }
    }
  }
  return nodes;
}
