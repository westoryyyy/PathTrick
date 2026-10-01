import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export default async function gamificationRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/gamification
   * Ambil XP + achievements user yang sedang login.
   */
  fastify.get(
    "/api/gamification",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;

      const [gamification, achievements, completedCourses] = await Promise.all([
        prisma.gamification.findUnique({
          where: { userId },
          select: { xp: true, updatedAt: true },
        }),
        prisma.achievement.findMany({
          where: { userId },
          select: { key: true, title: true, description: true, unlockedAt: true },
          orderBy: { unlockedAt: "desc" },
        }),
        prisma.courseProgress.count({
          where: { userId, status: "COMPLETED" },
        }),
      ]);

      return reply.code(200).send({
        xp: gamification?.xp ?? 0,
        completedCourses,
        achievements,
        // Readiness meter: persentase course selesai dari roadmap aktif
        // (dihitung client-side dari GET /api/courses supaya tidak double-query di sini)
      });
    }
  );

  /**
   * GET /api/leaderboard
   * Top 10 user berdasarkan XP — untuk demo day.
   */
  fastify.get(
    "/api/leaderboard",
    { preHandler: [fastify.authenticate] },
    async (_request, reply) => {
      const top = await prisma.gamification.findMany({
        orderBy: { xp: "desc" },
        take: 10,
        select: {
          xp: true,
          user: {
            select: {
              id: true,
              name: true,
              role: { select: { name: true, displayName: true } },
            },
          },
        },
      });

      return reply.code(200).send({
        leaderboard: top.map((entry, index) => ({
          rank: index + 1,
          userId: entry.user.id,
          name: entry.user.name ?? "Pengguna Anonim",
          role: entry.user.role?.name ?? null,
          xp: entry.xp,
        })),
      });
    }
  );

  /**
   * GET /api/badges
   * Ambil semua skill badge user + status sertifikat on-chain.
   */
  fastify.get(
    "/api/badges",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;

      const badges = await prisma.skillBadge.findMany({
        where: { userId },
        orderBy: { earnedAt: "desc" },
        select: {
          id: true,
          status: true,
          earnedAt: true,
          courseOnChainId: true,
          courseProgress: {
            select: {
              course: { select: { title: true, onChainId: true, coverImageUrl: true } },
            },
          },
          certificate: {
            select: {
              id: true,
              mintStatus: true,
              txHash: true,
            },
          },
        },
      });

      return reply.code(200).send({
        total: badges.length,
        badges: badges.map((b) => ({
          id: b.id,
          status: b.status,
          earnedAt: b.earnedAt,
          courseOnChainId: b.courseOnChainId.toString(),
          course: b.courseProgress.course,
          certificate: b.certificate ?? null,
        })),
      });
    }
  );

  /**
   * POST /api/gamification/add-xp
   * Menambahkan XP ke profil user (misal dari daily bounty).
   */
  fastify.post(
    "/api/gamification/add-xp",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const body = request.body as { amount: number };

      if (!body?.amount || typeof body.amount !== "number") {
        return reply.code(400).send({ error: "BadRequest", message: "amount (number) wajib diisi" });
      }

      const updated = await prisma.gamification.update({
        where: { userId },
        data: { xp: { increment: body.amount } },
      });

      return reply.code(200).send({
        success: true,
        newTotalXp: updated.xp,
      });
    }
  );
}
