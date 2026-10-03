import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { mapTopCodeToFacultyTags } from "../assessment/riasec.service";

function getStudyfieldHouseNames(studyfield: unknown): Set<string> {
  if (!studyfield) {
    return new Set();
  }

  const riasecService = require("../assessment/riasec.service");
  const studyfields = Array.isArray(studyfield) ? studyfield : [studyfield];
  const names = studyfields.flatMap((entry: unknown) => {
    if (typeof entry !== "string") {
      return [];
    }

    return riasecService.STUDYFIELD_TO_HOUSE[entry] ? [riasecService.STUDYFIELD_TO_HOUSE[entry]] : [];
  });

  return new Set(names);
}

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
          _count: {
            select: {
              courses: { where: { isPublished: true } }
            }
          },
        },
      });

      // Cari hasil preference terbaru
      const latestPref = await prisma.assessment.findFirst({
        where: { userId, type: "DREAMER_PREFERENCE" },
        orderBy: { version: "desc" },
      });
      
      // Cari hasil RIASEC terbaru
      const latestRiasec = await prisma.riasecResult.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { topCode: true },
      });

      let activeHouseNames = new Set<string>();
      let preferredHouseNames = new Set<string>();
      let hasTakenAssessment = false;
      
      if (latestPref && typeof latestPref.payload === 'object' && latestPref.payload !== null) {
        hasTakenAssessment = true;
        const payload = latestPref.payload as any;
        if (payload.studyfield) {
           preferredHouseNames = getStudyfieldHouseNames(payload.studyfield);
           preferredHouseNames.forEach((t: string) => activeHouseNames.add(t));
        } else if (latestRiasec) {
           mapTopCodeToFacultyTags(latestRiasec.topCode).forEach(t => activeHouseNames.add(t));
        }
      } else if (latestRiasec) {
        hasTakenAssessment = true;
        mapTopCodeToFacultyTags(latestRiasec.topCode).forEach(t => activeHouseNames.add(t));
      }

      const rankedHouses = houses.map((house) => {
        const isStudyfieldMatch = preferredHouseNames.has(house.title);
        const isRiasecMatch = activeHouseNames.has(house.title);
        const matchScore = (isStudyfieldMatch ? 100 : 0) + (isRiasecMatch ? 50 : 0);

        return {
          ...house,
          isActive: matchScore > 0,
          matchScore,
        };
      }).sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }
        return a.houseNumber - b.houseNumber;
      });

      return reply.code(200).send({
        hasTakenAssessment,
        houses: rankedHouses,
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
            orderBy: { order: "asc" },
            include: {
              chapters: {
                orderBy: { order: "asc" },
                select: {
                  id: true,
                  title: true,
                  order: true,
                  durationLabel: true,
                  sections: {
                    select: {
                      id: true,
                      title: true,
                      order: true,
                      missionId: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!house) {
        return reply.code(404).send({ error: "NotFound", message: "House tidak ditemukan" });
      }

      const latestRiasec = await prisma.riasecResult.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { topCode: true },
      });

      let isActive = false;
      if (latestRiasec) {
        const activeHouseNames = new Set(mapTopCodeToFacultyTags(latestRiasec.topCode));
        isActive = activeHouseNames.has(house.title);
      }

      const courseProgressList = await prisma.courseProgress.findMany({
        where: {
          userId,
          courseId: { in: house.courses.map((course) => course.id) },
        },
        select: {
          courseId: true,
          status: true,
          currentChapterOrder: true,
          currentSectionOrder: true,
        },
      });

      const progressMap = new Map(
        courseProgressList.map((progress) => [progress.courseId, progress])
      );

      const mappedHouse = {
        ...house,
        isActive,
        stages: house.courses.map((course) => {
          const progress = progressMap.get(course.id) ?? {
            status: "NOT_STARTED",
            currentChapterOrder: 1,
            currentSectionOrder: 1,
          };

          const chapters = course.chapters.map((chapter) => {
            const totalSections = chapter.sections.length;
            const chapterCompleted =
              progress.status === "COMPLETED" ||
              chapter.order < progress.currentChapterOrder ||
              (chapter.order === progress.currentChapterOrder && progress.currentSectionOrder > totalSections);

            const sections = chapter.sections.map((section) => ({
              id: section.id,
              title: section.title,
              order: section.order,
              completed:
                progress.status === "COMPLETED" ||
                chapter.order < progress.currentChapterOrder ||
                (chapter.order === progress.currentChapterOrder && section.order < progress.currentSectionOrder) ||
                (chapter.order === progress.currentChapterOrder && progress.currentSectionOrder > totalSections),
            }));

            return {
              id: chapter.id,
              name: chapter.title,
              duration: chapter.durationLabel || `${totalSections} Levels`,
              isCompleted: chapterCompleted,
              locked: chapter.order > progress.currentChapterOrder,
              sections,
            };
          });

          return {
            id: course.id,
            name: course.title,
            description: course.description,
            isCompleted: progress.status === "COMPLETED",
            duration: `${course.chapters.length} Bab`,
            contentType: course.contentType,
            chapters,
          };
        }),
      };

      return reply.code(200).send(mappedHouse);
    }
  );
}
