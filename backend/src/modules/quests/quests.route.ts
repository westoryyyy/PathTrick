import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export default async function questsRoutes(fastify: FastifyInstance) {
  // GET /api/quests - Get all active quests for the user and their progress
  fastify.get(
    "/api/quests",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      
      const quests = await prisma.questDefinition.findMany();
      const progress = await prisma.userQuestProgress.findMany({
        where: { userId }
      });
      
      // Calculate daily login streak dynamically
      const loginEvents = await prisma.userLoginEvent.findMany({
        where: { userId },
        orderBy: { dateStr: 'desc' }
      });
      
      let streak = 0;
      if (loginEvents.length > 0) {
        const todayStr = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        let expectedDate = new Date(loginEvents[0].dateStr);
        if (loginEvents[0].dateStr === todayStr || loginEvents[0].dateStr === yesterdayStr) {
          streak = 1;
          for (let i = 1; i < loginEvents.length; i++) {
            expectedDate.setDate(expectedDate.getDate() - 1);
            const expectedStr = expectedDate.toISOString().split('T')[0];
            if (loginEvents[i].dateStr === expectedStr) {
              streak++;
            } else {
              break;
            }
          }
        }
      }

      const formattedQuests = quests.map(q => {
        const p = progress.find(p => p.questId === q.id);
        let currentProgress = p?.progress || 0;
        
        if (q.type === 'DAILY_LOGIN') {
          const todayStr = new Date().toISOString().split('T')[0];
          const hasLoggedInToday = loginEvents.some(event => event.dateStr === todayStr);
          currentProgress = hasLoggedInToday ? 1 : 0;
        }

        const effectiveTarget = q.type === 'DAILY_LOGIN' ? 1 : q.targetCount;
        const isCompleted = currentProgress >= effectiveTarget;
        
        return {
          id: q.id,
          type: q.type,
          title: q.title,
          description: q.description,
          rewardXp: q.rewardXp,
          targetCount: effectiveTarget,
          progress: currentProgress,
          isCompleted,
          isRewardClaimed: p?.isRewardClaimed || false
        };
      });

      return reply.send({ quests: formattedQuests, streak });
    }
  );

  // POST /api/quests/:id/claim - Claim reward for a completed quest
  fastify.post(
    "/api/quests/:id/claim",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const { id } = request.params as { id: string };

      const quest = await prisma.questDefinition.findUnique({
        where: { id }
      });

      if (!quest) {
        return reply.code(404).send({ error: "NotFound", message: "Quest not found" });
      }

      // Check current progress
      let currentProgress = 0;
      
      if (quest.type === 'DAILY_LOGIN') {
        const loginEvents = await prisma.userLoginEvent.findMany({
          where: { userId },
          orderBy: { dateStr: 'desc' }
        });
        const todayStr = new Date().toISOString().split('T')[0];
        currentProgress = loginEvents.some(event => event.dateStr === todayStr) ? 1 : 0;
      } else {
        const p = await prisma.userQuestProgress.findUnique({
          where: { userId_questId: { userId, questId: id } }
        });
        currentProgress = p?.progress || 0;
      }

      const effectiveTarget = quest.type === 'DAILY_LOGIN' ? 1 : quest.targetCount;
      if (currentProgress < effectiveTarget) {
        return reply.code(400).send({ error: "BadRequest", message: "Quest not completed yet" });
      }

      // Transaction to claim safely
      try {
        const result = await prisma.$transaction(async (tx) => {
          const userProgress = await tx.userQuestProgress.upsert({
            where: { userId_questId: { userId, questId: id } },
            update: { isCompleted: true },
            create: { userId, questId: id, progress: currentProgress, isCompleted: true }
          });

          if (userProgress.isRewardClaimed) {
            throw new Error("ALREADY_CLAIMED");
          }

          await tx.userQuestProgress.update({
            where: { id: userProgress.id },
            data: { isRewardClaimed: true, completedAt: new Date() }
          });

          // Add XP
          if (quest.rewardXp > 0) {
            await tx.gamification.update({
              where: { userId },
              data: { xp: { increment: quest.rewardXp } }
            });
          }

          return { success: true, rewardXp: quest.rewardXp };
        });

        return reply.send(result);
      } catch (err: any) {
        if (err.message === "ALREADY_CLAIMED") {
          return reply.code(400).send({ error: "BadRequest", message: "Reward already claimed" });
        }
        return reply.code(500).send({ error: "InternalError", message: "Failed to claim reward" });
      }
    }
  );
}
