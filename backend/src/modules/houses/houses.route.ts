import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { mapTopCodeToFacultyTags } from "../assessment/riasec.service";

export default async function housesRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/houses
   * Ambil semua House dari DB (lengkap dengan gradient, skillsOverview, idealFor).
   * Kalau user sudah asesmen RIASEC, tandai houses yang match dengan `isActive: true`.
   * Kalau belum asesmen, semua `isActive: false`.
   */
  fastify.get(
    "/api/houses",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;

      // Ambil semua house dari DB, urut berdasarkan houseNumber
      const houses = await prisma.house.findMany({
        where: { isPublished: true },
        orderBy: { houseNumber: "asc" },
        select: {
          id: true,
          title: true,
          description: true,
          icon: true,
          houseNumber: true,
          gradient: true,
          skillsOverview: true,
          idealFor: true,
          status: true,
        },
      });

      // Cari hasil RIASEC terbaru user
      const latestRiasec = await prisma.riasecResult.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { topCode: true },
      });

      // Tentukan houses yang active berdasar RIASEC
      let activeHouseNames = new Set<string>();
      if (latestRiasec) {
        activeHouseNames = new Set(mapTopCodeToFacultyTags(latestRiasec.topCode));
      }

      return reply.code(200).send({
        hasTakenAssessment: !!latestRiasec,
        houses: houses.map((house) => ({
          ...house,
          isActive: activeHouseNames.has(house.title),
        })),
      });
    }
  );
}
