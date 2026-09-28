import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireAdmin } from "../admin/admin.middleware";

export default async function scholarshipsRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/api/scholarships",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { studyfield, scope } = request.query as {
        studyfield?: string;
        scope?: "dalam_negeri" | "luar_negeri" | "keduanya";
      };

      const where: any = {};
      if (studyfield) {
        where.facultyTags = { hasSome: [studyfield] };
      }
      if (scope) {
        where.scope = scope;
      }

      const scholarships = await prisma.scholarship.findMany({
        where,
        select: {
          id: true,
          name: true,
          country: true,
          deadline: true,
          facultyTags: true,
          scope: true,
        },
      });

      return reply.code(200).send({ total: scholarships.length, scholarships });
    }
  );

  fastify.get(
    "/api/scholarships/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const scholarship = await prisma.scholarship.findUnique({ where: { id } });

      if (!scholarship) {
        return reply.code(404).send({ error: "NotFound", message: "Beasiswa tidak ditemukan" });
      }

      return reply.code(200).send(scholarship);
    }
  );

  }
