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

  /**
   * GET /api/houses/:id
   * Ambil detail 1 House beserta daftar modul (courses) dan BAB (chapters).
   */
  fastify.get(
    "/api/houses/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { userId } = request.user;

      const house = await prisma.house.findUnique({
        where: { id },
        include: {
          courses: {
            where: { isPublished: true },
            orderBy: { onChainId: "asc" },
            include: {
              chapters: {
                orderBy: { order: "asc" },
                include: {
                  sections: {
                    select: { id: true }
                  }
                }
              }
            }
          }
        }
      });

      if (!house) {
        return reply.code(404).send({ error: "NotFound", message: "House tidak ditemukan" });
      }

      // Format response to match frontend 'stages' structure
      const mappedHouse = {
        ...house,
        stages: house.courses.map((course) => ({
          id: course.id,
          name: course.title,
          description: course.description,
          isCompleted: false, // For now hardcoded false or logic here if needed
          duration: "6 Levels",
          contentType: course.contentType,
          chapters: course.chapters.map((chapter) => ({
            id: chapter.id,
            name: chapter.title,
            duration: chapter.sections.length + " Levels",
            isCompleted: false
          }))
        }))
      };

      return reply.code(200).send(mappedHouse);
    }
  );
}
