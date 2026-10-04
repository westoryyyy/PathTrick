import { prisma } from "../../lib/prisma";
import { evaluateEssay } from "../ai-agent/agent3-essay-evaluator/agent3.service";

// -----------------------------------------------------------------------
// Courses service — query & business logic untuk Learning Mission & Houses.
// Semua fungsi di sini murni deterministik (tidak ada AI call).
// -----------------------------------------------------------------------

/**
 * Chaser: modul = Skills yang dibuat admin (Course tanpa House, published).
 * Alasan rekomendasi diambil dari roadmap aktif bila course tsb ada di sana.
 */
async function getSkillModulesForChaser(userId: string) {
  const [roadmap, skills] = await Promise.all([
    prisma.roadmap.findFirst({
      where: { userId, status: "ACTIVE" },
      include: { courses: true },
    }),
    prisma.course.findMany({
      where: { isPublished: true, houseId: null },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        onChainId: true,
        title: true,
        description: true,
        coverImageUrl: true,
        level: true,
        facultyTags: true,
        skillTags: true,
        houseId: true,
        skills: { select: { id: true, name: true, coverImageUrl: true } },
        chapters: { orderBy: { order: "asc" }, select: { id: true, order: true, _count: { select: { sections: true } } } },
      },
    }),
  ]);

  const reasonMap = new Map((roadmap?.courses ?? []).map((rc) => [rc.courseId, rc.reasonRecommended]));
  const progressList = await prisma.courseProgress.findMany({
    where: { userId, courseId: { in: skills.map((s) => s.id) } },
    select: { courseId: true, status: true, currentChapterOrder: true, currentSectionOrder: true, finalScore: true },
  });
  const progressMap = new Map(progressList.map((p) => [p.courseId, p]));

  return {
    roadmapId: roadmap?.id ?? null,
    courses: skills.map((c, idx) => ({
      order: idx + 1,
      reasonRecommended: reasonMap.get(c.id) ?? null,
      ...c,
      sectionCount: c.chapters.reduce((sum, ch) => sum + ch._count.sections, 0),
      progress: progressMap.get(c.id) ?? {
        status: "NOT_STARTED",
        currentChapterOrder: 1,
        currentSectionOrder: 1,
        finalScore: null,
      },
    })),
  };
}

/**
 * Ambil daftar course dari roadmap aktif user.
 * Diurutkan berdasar `order` di RoadmapCourse.
 */
export async function getCoursesForUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: { select: { name: true } } } });
  if (user?.role?.name === "CHASER") return getSkillModulesForChaser(userId);

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
                      type: true,
                      prompt: true,
                      options: true, // opsi pilihan ganda
                      points: true,
                      difficulty: true,
                      order: true,
                      correctAnswer: true,
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

      const isCompleted = progress!.status === "COMPLETED" ||
        chapter.order < progress!.currentChapterOrder ||
        (chapter.order === progress!.currentChapterOrder && section.order < progress!.currentSectionOrder);

      return {
        ...section,
        locked: isLocked,
        completed: isCompleted,
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
 * Submit jawaban quiz untuk 1 section.
 * Grading deterministik untuk MCQ, Keyword Matching + AI Fallback untuk ESSAY.
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
            select: { id: true, type: true, prompt: true, correctAnswer: true, points: true, order: true },
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
    let isCorrect = false;

    if (question.type === 'MULTIPLE_CHOICE') {
      let expectedCorrect = "";
      if (typeof question.correctAnswer === "string") {
        expectedCorrect = question.correctAnswer;
      } else {
        const correctAnswerObj = question.correctAnswer as { id: string } | null;
        expectedCorrect = correctAnswerObj?.id || "";
      }
      isCorrect = selectedAnswer !== undefined && selectedAnswer === expectedCorrect;
    } else if (question.type === 'ESSAY') {
      const correctAnswerObj = question.correctAnswer as { text?: string; keywords?: string[]; minKeywordMatches?: number; minKeywordPercent?: number } | null;
      const keywords = correctAnswerObj?.keywords || [];
      const rawUserText = (selectedAnswer || "").toString();

      // Normalize: lowercase, remove punctuation/digits, collapse spaces
      const normalize = (s: string) => s
        .toLowerCase()
        .replace(/[0-9]+/g, ' ')
        .replace(/[\p{P}\p{S}]/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const userText = normalize(rawUserText);
      const userTokens = new Set(userText.split(' ').filter(Boolean));

      // Tahap 1: Cek Lokal dengan Keyword (gabungan absolute OR percent)
      let keywordScore = 0;
      const matchedKeywords: string[] = [];
      for (const kw of keywords) {
        const nk = normalize(kw || '');
        if (!nk) continue;

        // direct phrase match
        if (userText.includes(nk)) {
          keywordScore++;
          matchedKeywords.push(kw);
          continue;
        }

        // or any word in the expected keyword phrase appears in answer tokens
        const kwTokens = nk.split(' ').filter(Boolean);
        const anyTok = kwTokens.some(t => userTokens.has(t));
        if (anyTok) {
          keywordScore++;
          matchedKeywords.push(kw);
        }
      }

      const minAbsolute = typeof correctAnswerObj?.minKeywordMatches === 'number' ? correctAnswerObj!.minKeywordMatches! : 3;
      const minPercent = typeof correctAnswerObj?.minKeywordPercent === 'number' ? correctAnswerObj!.minKeywordPercent! : 0.5;
      const requiredByPercent = keywords.length > 0 ? Math.ceil(keywords.length * minPercent) : 0;

      // Debug logging to help investigate keyword vs sentence mismatch
      console.debug('[essay-eval] quiz check', {
        userId: params.userId,
        questionId: question.id,
        keywords,
        matchedKeywords,
        keywordScore,
        minAbsolute,
        minPercent,
        requiredByPercent,
        selectedAnswer: typeof selectedAnswer === 'string' ? (selectedAnswer.length > 200 ? selectedAnswer.slice(0, 200) + '...' : selectedAnswer) : selectedAnswer,
        normalizedAnswer: userText,
      });
      const passByKeywords = keywords.length > 0 && (keywordScore >= minAbsolute || keywordScore >= requiredByPercent);

      if (passByKeywords) {
        isCorrect = true; // Lulus murni lokal!
      } else if (selectedAnswer && typeof selectedAnswer === 'string' && selectedAnswer.length > 10) {
        // Tahap 2: Jika Keyword gagal (mungkin user pakai sinonim), kita panggil AI Evaluator
        let aiResult = false;
        try {
          aiResult = await evaluateEssay(question.prompt, correctAnswerObj?.text || "", selectedAnswer);
        } catch (err) {
          console.error('[essay-eval] AI evaluator threw error', { userId: params.userId, questionId: question.id, err });
          // fallback keep aiResult false
        }
        console.debug('[essay-eval] aiDecision', { userId: params.userId, questionId: question.id, aiResult });
        isCorrect = aiResult;
      }
    }

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

    // Cek apakah section ini sudah diselesaikan sebelumnya
    const isAlreadyCompleted =
      progress!.status === "COMPLETED" ||
      progress!.currentChapterOrder > section.courseChapter.order ||
      (progress!.currentChapterOrder === section.courseChapter.order && progress!.currentSectionOrder > section.order);

    // Kalau lulus dan belum pernah diselesaikan, buka level berikutnya & beri XP
    if (passed && !isAlreadyCompleted) {
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
          await addXp(tx, params.userId, section.xpReward);
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
          await addXp(tx, params.userId, section.xpReward);
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
        await addXp(tx, params.userId, section.xpReward);
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
  const userText = (params.code || "").toLowerCase();

  const expectedKeywords = (section.expectedKeywords as string[]) || [];
  let keywordScore = 0;
  for (const kw of expectedKeywords) {
    if (userText.includes(kw.toLowerCase())) keywordScore++;
  }

  const threshold = expectedKeywords.length > 0 ? Math.ceil(expectedKeywords.length * 0.5) : 0;

  if (!userText.trim()) {
    passed = false;
    message = 'Jawaban tidak boleh kosong. Silakan tuliskan analisamu!';
  } else if (expectedKeywords.length > 0 && keywordScore >= threshold) {
    passed = true;
    message = 'Analisis kasusmu sangat tepat sasaran dan menggunakan kata kunci yang relevan!';
  } else if (userText.length > 10) {
    // Fallback AI Evaluator
    const prompt = section.content || "Tugas essay";
    const expectedText = expectedKeywords.join(", ");
    try {
      const isCorrect = await evaluateEssay(prompt, expectedText, params.code);
      if (isCorrect) {
        passed = true;
        message = 'Jawabanmu benar dan telah disetujui oleh Sistem Evaluator AI!';
      } else {
        passed = false;
        message = 'Sepertinya analisamu masih kurang tepat. Coba perbaiki lagi!';
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'AiEvaluatorError') {
        throw err;
      }
      throw new Error('AiEvaluatorError'); // Ensure it gets thrown if unhandled
    }
  } else {
    passed = false;
    message = 'Jawabanmu terlalu singkat. Coba jelaskan lebih detail!';
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
                      missionId: true,
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
          missionId: section.missionId,
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

export async function getMissionBySectionSlug(missionId: string, userId: string) {
  let section = await prisma.courseSection.findUnique({
    where: { id: missionId },
    include: { courseChapter: true }
  });
  if (!section) {
    section = await prisma.courseSection.findUnique({
      where: { missionId },
      include: { courseChapter: true }
    });
  }

  if (!section) return null;

  // We can reuse getCourseDetail to get the properly formatted structure
  const courseData = await getCourseDetail(section.courseChapter.courseId, userId);

  if (!courseData) return null;

  // Find the specific chapter and section from the formatted data to inherit its 'locked' status
  let foundSection = null;
  for (const chapter of courseData.chapters) {
    if (chapter.id === section.courseChapterId) {
      foundSection = chapter.sections.find((s: any) => s.id === section.id);
      break;
    }
  }

  return {
    ...foundSection,
    courseId: section.courseChapter.courseId,
    houseId: courseData.houseId,
    courseChapterId: section.courseChapterId
  };
}

export async function submitQuizByMissionId(params: { userId: string; missionId: string; answers: Array<any> }) {
  let section = await prisma.courseSection.findUnique({
    where: { id: params.missionId },
    include: { courseChapter: true }
  });
  if (!section) {
    section = await prisma.courseSection.findUnique({
      where: { missionId: params.missionId },
      include: { courseChapter: true }
    });
  }

  if (!section) throw new Error("MISSION_NOT_FOUND");

  return submitQuiz({
    userId: params.userId,
    courseId: section.courseChapter.courseId,
    sectionId: section.id,
    answers: params.answers
  });
}

export async function submitProjectByMissionId(params: { userId: string; missionId: string; code: string }) {
  let section = await prisma.courseSection.findUnique({
    where: { id: params.missionId },
    include: { courseChapter: true }
  });
  if (!section) {
    section = await prisma.courseSection.findUnique({
      where: { missionId: params.missionId },
      include: { courseChapter: true }
    });
  }

  if (!section) throw new Error("MISSION_NOT_FOUND");

  return submitProject({
    userId: params.userId,
    courseId: section.courseChapter.courseId,
    sectionId: section.id,
    code: params.code
  });
}

export async function completeMissionById(params: { userId: string; missionId: string }) {
  let section = await prisma.courseSection.findUnique({
    where: { id: params.missionId },
    include: { courseChapter: true }
  });
  if (!section) {
    section = await prisma.courseSection.findUnique({
      where: { missionId: params.missionId },
      include: { courseChapter: true }
    });
  }

  if (!section) throw new Error("MISSION_NOT_FOUND");

  return completeSection({
    userId: params.userId,
    courseId: section.courseChapter.courseId,
    sectionId: section.id,
  });
}

export async function completeSection(params: { userId: string; courseId: string; sectionId: string }) {
  let progress = await prisma.courseProgress.findFirst({
    where: { userId: params.userId, courseId: params.courseId },
  });

  const section = await prisma.courseSection.findUnique({
    where: { id: params.sectionId },
    include: { courseChapter: true },
  });
  if (!section) throw new Error("SECTION_NOT_FOUND");

  if (!progress) {
    progress = await prisma.courseProgress.create({
      data: {
        userId: params.userId,
        courseId: params.courseId,
        status: "IN_PROGRESS",
      },
    });
  }

  await prisma.$transaction(async (tx) => {
    // Cek apakah section ini sudah diselesaikan sebelumnya
    const isAlreadyCompleted =
      progress!.status === "COMPLETED" ||
      progress!.currentChapterOrder > section.courseChapter.order ||
      (progress!.currentChapterOrder === section.courseChapter.order && progress!.currentSectionOrder > section.order);

    if (isAlreadyCompleted) return; // Jangan berikan XP lagi

    // Check if last section in chapter
    const sectionsInChapter = await tx.courseSection.count({
      where: { courseChapterId: section.courseChapterId },
    });
    const isLastSectionInChapter = section.order >= sectionsInChapter;

    if (isLastSectionInChapter) {
      const totalChapters = await tx.courseChapter.count({
        where: { courseId: params.courseId },
      });
      const isLastChapter = section.courseChapter.order >= totalChapters;

      if (isLastChapter) {
        await tx.courseProgress.update({
          where: { id: progress!.id },
          data: {
            status: "COMPLETED",
            completedAt: new Date(),
            currentChapterOrder: section.courseChapter.order,
            currentSectionOrder: section.order + 1,
          },
        });
        await createBadgeAndCertificate(tx, progress!.id, params.userId, params.courseId);
        await addXp(tx, params.userId, section.xpReward);
      } else {
        await tx.courseProgress.update({
          where: { id: progress!.id },
          data: {
            status: "IN_PROGRESS",
            currentChapterOrder: section.courseChapter.order + 1,
            currentSectionOrder: 1,
          },
        });
        await addXp(tx, params.userId, section.xpReward);
      }
    } else {
      await tx.courseProgress.update({
        where: { id: progress!.id },
        data: {
          status: "IN_PROGRESS",
          currentSectionOrder: section.order + 1,
        },
      });
      await addXp(tx, params.userId, section.xpReward);
    }
  });

  return { success: true };
}
