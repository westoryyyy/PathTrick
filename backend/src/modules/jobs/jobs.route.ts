import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireAdmin } from "../admin/admin.middleware";

export default async function jobsRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/api/jobs",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { type } = request.query as { type?: string };
      const where: any = {};
      if (type) {
        where.type = type;
      }
      const jobs = await prisma.job.findMany({
        where,
        select: {
          id: true,
          title: true,
          company: true,
          type: true,
          coverImageUrl: true,
          skillsRequired: true,
        },
      });
      return reply.code(200).send({ total: jobs.length, jobs });
    }
  );

  fastify.get(
    "/api/jobs/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const job = await prisma.job.findUnique({ where: { id } });
      if (!job) {
        return reply.code(404).send({ error: "NotFound", message: "Lowongan kerja tidak ditemukan" });
      }
      return reply.code(200).send(job);
    }
  );

  }
