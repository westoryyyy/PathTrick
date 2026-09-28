import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireAdmin } from "../admin/admin.middleware";

export default async function adminCoursesRoutes(fastify: FastifyInstance) {
  /**
   * =========================================
   * ADMIN ROUTES: COURSES (CRUD)
   * =========================================
   */

  const adminCourseSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    coverImageUrl: z.string().optional(),
    mapBackgroundUrl: z.string().optional(),
    facultyTags: z.array(z.string()).default([]),
    contentType: z.string().default("material"),
    level: z.string().optional(),
    isPublished: z.boolean().default(true),
    isFallback: z.boolean().default(false),
  });

  fastify.post(
    "/api/admin/courses",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const parsedBody = adminCourseSchema.safeParse(request.body);
      if (!parsedBody.success) {
        return reply.code(400).send({ error: "ValidationError", details: parsedBody.error.flatten() });
      }
      const data = await prisma.course.create({ data: parsedBody.data });
      return reply.code(201).send(data);
    }
  );

  fastify.put(
    "/api/admin/courses/:id",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const parsedBody = adminCourseSchema.safeParse(request.body);
      if (!parsedBody.success) {
        return reply.code(400).send({ error: "ValidationError", details: parsedBody.error.flatten() });
      }
      try {
        const data = await prisma.course.update({ where: { id }, data: parsedBody.data });
        return reply.code(200).send(data);
      } catch (error) {
        return reply.code(404).send({ error: "NotFound", message: "Course tidak ditemukan" });
      }
    }
  );

  fastify.delete(
    "/api/admin/courses/:id",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      try {
        await prisma.course.delete({ where: { id } });
        return reply.code(200).send({ message: "Berhasil dihapus" });
      } catch (error) {
        return reply.code(404).send({ error: "NotFound", message: "Course tidak ditemukan" });
      }
    }
  );

  /**
   * =========================================
   * ADMIN ROUTES: CHAPTERS (CRUD)
   * =========================================
   */

  const adminChapterSchema = z.object({
    title: z.string().min(1),
    order: z.number().int().min(1),
    durationLabel: z.string().default("6 Levels"),
  });

  fastify.post(
    "/api/admin/courses/:courseId/chapters",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { courseId } = request.params as { courseId: string };
      const parsedBody = adminChapterSchema.safeParse(request.body);
      if (!parsedBody.success) {
        return reply.code(400).send({ error: "ValidationError", details: parsedBody.error.flatten() });
      }
      try {
        const data = await prisma.courseChapter.create({
          data: { ...parsedBody.data, courseId },
        });
        return reply.code(201).send(data);
      } catch (error) {
        return reply.code(400).send({ error: "DatabaseError", message: "Gagal membuat chapter (mungkin urutan duplikat)" });
      }
    }
  );

  fastify.put(
    "/api/admin/courses/:courseId/chapters/:chapterId",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { chapterId } = request.params as { chapterId: string };
      const parsedBody = adminChapterSchema.safeParse(request.body);
      if (!parsedBody.success) {
        return reply.code(400).send({ error: "ValidationError", details: parsedBody.error.flatten() });
      }
      try {
        const data = await prisma.courseChapter.update({
          where: { id: chapterId },
          data: parsedBody.data,
        });
        return reply.code(200).send(data);
      } catch (error) {
        return reply.code(404).send({ error: "NotFound", message: "Chapter tidak ditemukan" });
      }
    }
  );

  fastify.delete(
    "/api/admin/courses/:courseId/chapters/:chapterId",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { chapterId } = request.params as { chapterId: string };
      try {
        await prisma.courseChapter.delete({ where: { id: chapterId } });
        return reply.code(200).send({ message: "Berhasil dihapus" });
      } catch (error) {
        return reply.code(404).send({ error: "NotFound", message: "Chapter tidak ditemukan" });
      }
    }
  );

  /**
   * =========================================
   * ADMIN ROUTES: SECTIONS (CRUD)
   * =========================================
   */

  const adminSectionSchema = z.object({
    title: z.string().min(1),
    order: z.number().int().min(1),
    content: z.string().min(1),
    category: z.string().default("skill"),
    xpReward: z.number().int().default(100),
    mapPositionX: z.number().int().optional(),
    mapPositionY: z.number().int().optional(),
    codeTemplate: z.string().optional(),
    expectedKeywords: z.array(z.string()).optional()
  });

  fastify.post(
    "/api/admin/courses/:courseId/chapters/:chapterId/sections",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { chapterId } = request.params as { chapterId: string };
      const parsedBody = adminSectionSchema.safeParse(request.body);
      if (!parsedBody.success) {
        return reply.code(400).send({ error: "ValidationError", details: parsedBody.error.flatten() });
      }
      try {
        const data = await prisma.courseSection.create({
          data: { ...parsedBody.data, courseChapterId: chapterId },
        });
        return reply.code(201).send(data);
      } catch (error) {
        return reply.code(400).send({ error: "DatabaseError", message: "Gagal membuat section (mungkin urutan duplikat)" });
      }
    }
  );

  fastify.put(
    "/api/admin/courses/:courseId/chapters/:chapterId/sections/:sectionId",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { sectionId } = request.params as { sectionId: string };
      const parsedBody = adminSectionSchema.safeParse(request.body);
      if (!parsedBody.success) {
        return reply.code(400).send({ error: "ValidationError", details: parsedBody.error.flatten() });
      }
      try {
        const data = await prisma.courseSection.update({
          where: { id: sectionId },
          data: parsedBody.data,
        });
        return reply.code(200).send(data);
      } catch (error) {
        return reply.code(404).send({ error: "NotFound", message: "Section tidak ditemukan" });
      }
    }
  );

  fastify.delete(
    "/api/admin/courses/:courseId/chapters/:chapterId/sections/:sectionId",
    { preHandler: [fastify.authenticate, requireAdmin] },
    async (request, reply) => {
      const { sectionId } = request.params as { sectionId: string };
      try {
        await prisma.courseSection.delete({ where: { id: sectionId } });
        return reply.code(200).send({ message: "Berhasil dihapus" });
      } catch (error) {
        return reply.code(404).send({ error: "NotFound", message: "Section tidak ditemukan" });
      }
    }
  );
}
