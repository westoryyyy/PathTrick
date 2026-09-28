import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { requireAdmin } from "./admin.middleware";
import { jobSchema, scholarshipSchema, universitySchema } from "./admin.schema";
import {
  createJob,
  createScholarship,
  createUniversity,
  updateJob,
  updateScholarship,
  updateUniversity,
} from "./admin.service";

export default async function adminRoutes(fastify: FastifyInstance) {

  // === STATS ===
  fastify.get(
    "/api/admin/stats",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (_request, reply) => {
      const [users, courses, scholarships, jobs] = await Promise.all([
        prisma.user.count(),
        prisma.course.count(),
        prisma.scholarship.count(),
        prisma.job.count(),
      ]);
      return reply.send({ users, courses, scholarships, jobs });
    }
  );

  // === QUIZ ===
  fastify.put(
    '/api/admin/sections/:sectionId/quiz',
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { sectionId } = request.params as { sectionId: string };
      const { title, passingScore, questions } = request.body as {
        title?: string;
        passingScore?: number;
        questions?: Array<{
          prompt: string;
          options?: unknown;
          correctAnswer?: unknown;
          points?: number;
          order?: number;
        }>;
      };

      try {
        let quiz = await prisma.quiz.findUnique({ where: { courseSectionId: sectionId } });
        if (!quiz) {
          quiz = await prisma.quiz.create({
            data: { courseSectionId: sectionId, title: title || 'Quiz', passingScore: passingScore || 75 }
          });
        } else {
          quiz = await prisma.quiz.update({
            where: { id: quiz.id },
            data: { title: title || 'Quiz', passingScore: passingScore || 75 }
          });
        }

        // Guard: block delete if any QuizAnswers exist for this quiz's questions
        const existingAnswers = await prisma.quizAnswer.count({
          where: { question: { quizId: quiz.id } }
        });
        if (existingAnswers > 0 && questions && questions.length > 0) {
          // Only delete questions that have NO answers yet (safe update)
          const answeredQuestionIds = await prisma.quizAnswer.findMany({
            where: { question: { quizId: quiz.id } },
            select: { questionId: true },
            distinct: ['questionId'],
          });
          const answeredIds = new Set(answeredQuestionIds.map(a => a.questionId));
          await prisma.quizQuestion.deleteMany({
            where: { quizId: quiz.id, id: { notIn: [...answeredIds] } }
          });
        } else if (questions && questions.length > 0) {
          await prisma.quizQuestion.deleteMany({ where: { quizId: quiz.id } });
        }

        if (questions && questions.length > 0) {
          const existingCount = await prisma.quizQuestion.count({ where: { quizId: quiz.id } });
          if (existingCount === 0) {
            await prisma.quizQuestion.createMany({
              data: questions.map((q, i: number) => ({
                quizId: quiz!.id,
                prompt: q.prompt,
                options: q.options || [],
                correctAnswer: q.correctAnswer || '',
                points: q.points || 1,
                order: q.order || i + 1,
                type: 'MULTIPLE_CHOICE' as const
              }))
            });
          }
        }

        return reply.send({ message: 'Quiz updated successfully' });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown database error';
        return reply.status(500).send({ error: 'DatabaseError', message });
      }
    }
  );

  // === COURSES ===
  fastify.get(
    '/api/admin/courses/:id',
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const course = await prisma.course.findUnique({
        where: { id },
        include: {
          chapters: {
            orderBy: { order: 'asc' },
            include: {
              sections: {
                orderBy: { order: 'asc' },
                include: {
                  quiz: {
                    include: {
                      questions: {
                        select: {
                          id: true,
                          prompt: true,
                          options: true,
                          correctAnswer: true, // Admin can see correctAnswer
                          points: true,
                          difficulty: true,
                          order: true,
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
      if (!course) return reply.status(404).send({ error: 'NotFound', message: 'Course not found' });
      return reply.send(course);
    }
  );

  fastify.get(
    "/api/admin/courses",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (_request, reply) => {
      const courses = await prisma.course.findMany({
        orderBy: { createdAt: "desc" },
        include: { chapters: { include: { sections: true } } }
      });
      const mapped = courses.map((c) => {
        let sectionCount = 0;
        c.chapters.forEach(ch => sectionCount += ch.sections.length);
        return {
          id: c.id,
          title: c.title,
          description: c.description,
          published: String(c.isPublished),
          isFallback: c.isFallback,
          sections: sectionCount
        };
      });
      return reply.send(mapped);
    }
  );

  // === UNIVERSITIES ===
  fastify.get(
    "/api/admin/universities",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (_request, reply) => {
      const universities = await prisma.university.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          location: true,
          riasecCode: true,
          accreditation: true,
          description: true,
          coverImageUrl: true,
        },
      });
      const mapped = universities.map((u) => ({
        ...u,
        coverImage: u.coverImageUrl,
        coverImageUrl: undefined,
      }));
      return reply.send(mapped);
    }
  );

  fastify.post(
    "/api/admin/universities",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const parsed = universitySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "ValidationError", details: parsed.error.flatten() });
      }
      const created = await createUniversity(request.user.userId, parsed.data);
      return reply.code(201).send(created);
    }
  );

  fastify.put(
    "/api/admin/universities/:id",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parsed = universitySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "ValidationError", details: parsed.error.flatten() });
      }
      const updated = await updateUniversity(id, parsed.data);
      return reply.send(updated);
    }
  );

  fastify.delete(
    "/api/admin/universities/:id",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      // 409 guard: check for dependent roadmap matches
      const matchCount = await prisma.universityMatch.count({ where: { universityId: id } });
      if (matchCount > 0) {
        return reply.code(409).send({
          error: "Conflict",
          message: `Tidak bisa dihapus: universitas ini ada di ${matchCount} roadmap user. Hapus match terlebih dahulu.`,
          dependentCount: matchCount,
        });
      }
      await prisma.university.delete({ where: { id } });
      return reply.send({ success: true });
    }
  );

  // === SCHOLARSHIPS ===
  fastify.get(
    "/api/admin/scholarships",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (_request, reply) => {
      const scholarships = await prisma.scholarship.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          provider: true,
          deadline: true,
          amount: true,
          scope: true,
          requirements: true,
          coverImageUrl: true,
        },
      });
      // Map DB fields to frontend field names:
      //   name -> title, amount -> coverage, coverImageUrl -> coverImage
      const mapped = scholarships.map((s) => ({
        id: s.id,
        title: s.name,         // DB: name -> frontend: title
        provider: s.provider,
        deadline: s.deadline,
        coverage: s.amount,    // DB: amount -> frontend: coverage
        scope: s.scope,
        requirements: s.requirements ? s.requirements.split(',').map(r => r.trim()).filter(Boolean) : [],
        coverImage: s.coverImageUrl,
      }));
      return reply.send(mapped);
    }
  );

  fastify.post(
    "/api/admin/scholarships",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const parsed = scholarshipSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "ValidationError", details: parsed.error.flatten() });
      }
      const created = await createScholarship(request.user.userId, parsed.data);
      return reply.code(201).send(created);
    }
  );

  fastify.put(
    "/api/admin/scholarships/:id",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parsed = scholarshipSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "ValidationError", details: parsed.error.flatten() });
      }
      const updated = await updateScholarship(id, parsed.data);
      return reply.send(updated);
    }
  );

  fastify.delete(
    "/api/admin/scholarships/:id",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const matchCount = await prisma.scholarshipMatch.count({ where: { scholarshipId: id } });
      if (matchCount > 0) {
        return reply.code(409).send({
          error: "Conflict",
          message: `Tidak bisa dihapus: beasiswa ini ada di ${matchCount} roadmap user.`,
          dependentCount: matchCount,
        });
      }
      await prisma.scholarship.delete({ where: { id } });
      return reply.send({ success: true });
    }
  );

  // === JOBS ===
  fastify.get(
    "/api/admin/jobs",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (_request, reply) => {
      const jobs = await prisma.job.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          company: true,
          location: true,
          type: true,
          salaryRange: true,
          skillsRequired: true,
          coverImageUrl: true,
        },
      });
      const mapped = jobs.map((j) => ({
        ...j,
        skills: j.skillsRequired,
        coverImage: j.coverImageUrl,
        coverImageUrl: undefined,
        skillsRequired: undefined,
      }));
      return reply.send(mapped);
    }
  );

  fastify.post(
    "/api/admin/jobs",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const parsed = jobSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "ValidationError", details: parsed.error.flatten() });
      }
      const created = await createJob(request.user.userId, parsed.data);
      return reply.code(201).send(created);
    }
  );

  fastify.put(
    "/api/admin/jobs/:id",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parsed = jobSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "ValidationError", details: parsed.error.flatten() });
      }
      const updated = await updateJob(id, parsed.data);
      return reply.send(updated);
    }
  );

  fastify.delete(
    "/api/admin/jobs/:id",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const matchCount = await prisma.jobMatch.count({ where: { jobId: id } });
      if (matchCount > 0) {
        return reply.code(409).send({
          error: "Conflict",
          message: `Tidak bisa dihapus: lowongan ini ada di ${matchCount} roadmap user.`,
          dependentCount: matchCount,
        });
      }
      await prisma.job.delete({ where: { id } });
      return reply.send({ success: true });
    }
  );
}


