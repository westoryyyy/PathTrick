import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireAdmin } from "../admin/admin.middleware";

export default async function universitiesRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/universities
   * List universitas + filter (studyfield, country, budgetTier)
   */
  fastify.get(
    "/api/universities",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { studyfield, country, budgetTier } = request.query as {
        studyfield?: string;
        country?: string;
        budgetTier?: "TERJANGKAU" | "MENENGAH" | "PREMIUM" | "EKSKLUSIF" | "FULL_SCHOLARSHIP";
      };

      const where: any = {};

      if (studyfield) {
        // Studyfield di-query persis sama
        where.facultyTags = { hasSome: [studyfield] };
      }
      if (country) {
        where.country = country;
      }

      if (budgetTier) {
        if (budgetTier === "TERJANGKAU") {
          where.estimatedCostMin = { lte: 5000000 };
        } else if (budgetTier === "MENENGAH") {
          where.estimatedCostMin = { gte: 5000000 };
          where.estimatedCostMax = { lte: 15000000 };
        } else if (budgetTier === "PREMIUM") {
          where.estimatedCostMin = { gte: 15000000 };
          where.estimatedCostMax = { lte: 30000000 };
        } else if (budgetTier === "EKSKLUSIF") {
          where.estimatedCostMin = { gte: 30000000 };
        }
        // FULL_SCHOLARSHIP tidak memfilter cost
      }

      const universities = await prisma.university.findMany({
        where,
        select: {
          id: true,
          name: true,
          country: true,
          coverImageUrl: true,
          facultyTags: true,
          estimatedCostMin: true,
          estimatedCostMax: true,
        },
      });

      return reply.code(200).send({ total: universities.length, universities });
    }
  );

  /**
   * GET /api/universities/:id
   * Detail universitas
   */
  fastify.get(
    "/api/universities/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const university = await prisma.university.findUnique({ where: { id } });

      if (!university) {
        return reply.code(404).send({ error: "NotFound", message: "Universitas tidak ditemukan" });
      }

      return reply.code(200).send(university);
    }
  );

  }
