import { FastifyInstance } from "fastify";
import { getCourseDetail, getCoursesForUser, submitQuiz, submitProject, getRoadmapNodes, getMissionBySectionSlug, submitQuizByMissionId, submitProjectByMissionId, completeMissionById } from "./courses.service";
import { z } from "zod";
import { sanitizeTextInput } from "../../utils/sanitize";
const submitQuizBodySchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        selectedAnswer: z.string().min(1, "selectedAnswer wajib diisi (A/B/C/D)").transform(sanitizeTextInput),
      })
    )
    .min(1, "Minimal 1 jawaban harus dikirim"),
});

const submitProjectBodySchema = z.object({
  code: z.string().min(1, 'Kode tidak boleh kosong').transform(sanitizeTextInput),
});

export default async function coursesRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/courses
   * List course dari roadmap aktif user (urut sesuai roadmap order).
   * Kalau belum ada roadmap aktif → courses = [].
   */
  fastify.get(
    "/api/courses",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const result = await getCoursesForUser(userId);
      return reply.code(200).send(result);
    }
  );

  /**
   * GET /api/courses/:courseId
   * Detail 1 course + sections + quiz (tanpa correctAnswer).
   * Section yang masih terkunci ditandai `locked: true`.
   */
  fastify.get(
    "/api/courses/:courseId",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { courseId } = request.params as { courseId: string };
      const { userId } = request.user;

      const course = await getCourseDetail(courseId, userId);
      if (!course) {
        return reply.code(404).send({ error: "NotFound", message: "Course tidak ditemukan atau belum dipublikasikan" });
      }
      return reply.code(200).send(course);
    }
  );

  /**
   * GET /api/chapters/:chapterId
   * Detail 1 chapter + sections
   */
  fastify.get(
    "/api/chapters/:chapterId",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { chapterId } = request.params as { chapterId: string };
      const { prisma } = await import('../../lib/prisma');
      const chapter = await prisma.courseChapter.findUnique({
        where: { id: chapterId },
        include: { sections: { orderBy: { order: 'asc' } } }
      });
      if (!chapter) return reply.code(404).send({ error: "NotFound" });
      return reply.code(200).send(chapter);
    }
  );

  /**
   * POST /api/courses/:courseId/sections/:sectionId/quiz/submit
   * Submit jawaban quiz untuk 1 section.
   * Body: { answers: [{ questionId, selectedAnswer }] }
   *
   * Response: { score, passed, passingScore, correctCount, totalQuestions, nextSectionUnlocked }
   */
  fastify.post(
    "/api/courses/:courseId/sections/:sectionId/quiz/submit",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { courseId, sectionId } = request.params as { courseId: string; sectionId: string };
      const { userId } = request.user;

      const parsedBody = submitQuizBodySchema.safeParse(request.body);
      if (!parsedBody.success) {
        return reply.code(400).send({ error: "ValidationError", details: parsedBody.error.flatten() });
      }

      try {
        const result = await submitQuiz({
          userId,
          courseId,
          sectionId,
          answers: parsedBody.data.answers,
        });
        return reply.code(200).send(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.message === "QUIZ_NOT_FOUND") {
            return reply.code(404).send({ error: "NotFound", message: "Quiz tidak ditemukan untuk section ini" });
          }
          if (err.message === "SECTION_LOCKED") {
            return reply.code(403).send({
              error: "SectionLocked",
              message: "Section ini masih terkunci — selesaikan section sebelumnya terlebih dahulu",
            });
          }
          if (err.message === "AiEvaluatorError") return reply.code(503).send({ error: "AiEvaluatorError", message: "Gagal terhubung ke AI Evaluator. Coba lagi beberapa saat." });
        }
        request.log.error(err, "Error di POST quiz/submit");
        return reply.code(500).send({ error: "InternalError", message: "Terjadi kesalahan tak terduga" });
      }
    }
  );

  /**
   * POST /api/courses/:courseId/sections/:sectionId/project/submit
   */
  fastify.post(
    '/api/courses/:courseId/sections/:sectionId/project/submit',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { courseId, sectionId } = request.params as { courseId: string; sectionId: string };
      const { userId } = request.user;
      const parsedBody = submitProjectBodySchema.safeParse(request.body);
      if (!parsedBody.success) return reply.code(400).send({ error: 'ValidationError' });
      try {
        const result = await submitProject({ userId, courseId, sectionId, code: parsedBody.data.code });
        return reply.code(200).send(result);
      } catch (err) {
        request.log.error(err, 'Error di POST project/submit');
        return reply.code(500).send({ error: 'InternalError' });
      }
    }
  );

  // ═══════════════════════════════════════════════════════════════════════
  // MISSION SLUG ENDPOINTS — Frontend hanya perlu tahu missionId (slug).
  // Backend resolve slug → courseId + sectionId secara internal.
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * GET /api/missions/:missionId
   * Ambil data section berdasarkan slug `missionId`.
   * Frontend pakai ini untuk load konten level.
   */
  fastify.get(
    '/api/missions/:missionId',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { missionId } = request.params as { missionId: string };
      const { userId } = request.user;
      const result = await getMissionBySectionSlug(missionId, userId);
      if (!result) {
        return reply.code(404).send({ error: 'NotFound', message: `Mission '${missionId}' tidak ditemukan` });
      }
      return reply.code(200).send(result);
    }
  );

  /**
   * POST /api/missions/:missionId/quiz/submit
   * Submit quiz menggunakan missionId slug — tidak perlu tahu courseId/sectionId.
   */
  fastify.post(
    '/api/missions/:missionId/quiz/submit',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { missionId } = request.params as { missionId: string };
      const { userId } = request.user;
      const parsedBody = submitQuizBodySchema.safeParse(request.body);
      if (!parsedBody.success) {
        return reply.code(400).send({ error: 'ValidationError', details: parsedBody.error.flatten() });
      }
      try {
        const result = await submitQuizByMissionId({ userId, missionId, answers: parsedBody.data.answers });
        return reply.code(200).send(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.message === 'MISSION_NOT_FOUND') return reply.code(404).send({ error: 'NotFound', message: `Mission '${missionId}' tidak ditemukan` });
          if (err.message === 'QUIZ_NOT_FOUND') return reply.code(404).send({ error: 'NotFound', message: 'Quiz tidak ditemukan untuk mission ini' });
          if (err.message === 'SECTION_LOCKED') return reply.code(403).send({ error: 'SectionLocked', message: 'Mission ini masih terkunci' });
          if (err.message === 'AiEvaluatorError') return reply.code(503).send({ error: 'AiEvaluatorError', message: 'Gagal terhubung ke AI Evaluator. Coba lagi beberapa saat.' });
        }
        request.log.error(err, 'Error di POST missions quiz/submit');
        return reply.code(500).send({ error: 'InternalError' });
      }
    }
  );

  /**
   * POST /api/missions/:missionId/project/submit
   * Submit project/boss fight menggunakan missionId slug.
   */
  fastify.post(
    '/api/missions/:missionId/project/submit',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { missionId } = request.params as { missionId: string };
      const { userId } = request.user;
      const parsedBody = submitProjectBodySchema.safeParse(request.body);
      if (!parsedBody.success) return reply.code(400).send({ error: 'ValidationError' });
      try {
        const result = await submitProjectByMissionId({ userId, missionId, code: parsedBody.data.code });
        return reply.code(200).send(result);
      } catch (err: unknown) {
        if (err instanceof Error && err.message === 'AiEvaluatorError') {
          return reply.code(503).send({ error: 'AiEvaluatorError', message: 'Gagal terhubung ke AI Evaluator. Coba lagi beberapa saat.' });
        }
        request.log.error(err, 'Error di POST missions project/submit');
        return reply.code(500).send({ error: 'InternalError' });
      }
    }
  );

  /**
   * POST /api/missions/:missionId/complete
   * Mark mission as complete (without quiz or project) and add XP.
   */
  fastify.post(
    '/api/missions/:missionId/complete',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { missionId } = request.params as { missionId: string };
      const { userId } = request.user;
      try {
        const result = await completeMissionById({ userId, missionId });
        return reply.code(200).send(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.message === 'MISSION_NOT_FOUND') return reply.code(404).send({ error: 'NotFound' });
        }
        request.log.error(err, 'Error di POST missions complete');
        return reply.code(500).send({ error: 'InternalError' });
      }
    }
  );

  /**
   * GET /api/roadmap
   * Alias yang sering dipakai FE — kembalikan roadmap aktif + courses.
   */
  fastify.get(
    "/api/roadmap",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const result = await getRoadmapNodes(userId);
      return reply.code(200).send(result);
    }
  );
}
