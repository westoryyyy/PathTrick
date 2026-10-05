import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

// Whitelist of valid step keys keeps the stored data clean.
const STEP_KEYS = ["basics", "documents", "register", "exam"] as const;

const bodySchema = z.object({
  completedSteps: z.array(z.enum(STEP_KEYS)).max(STEP_KEYS.length),
});

export default async function universityChecklistRoutes(fastify: FastifyInstance) {
  // All checklist progress of the current user: { [universityId]: string[] }
  fastify.get(
    "/api/universities/checklist",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const rows = await prisma.universityChecklistProgress.findMany({
        where: { userId },
        select: { universityId: true, completedSteps: true },
      });
      const progress: Record<string, string[]> = {};
      for (const r of rows) progress[r.universityId] = r.completedSteps;
      return reply.code(200).send({ progress });
    }
  );

  // Replace progress for one university
  fastify.put(
    "/api/universities/:universityId/checklist",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const { universityId } = request.params as { universityId: string };
      const parsed = bodySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "BadRequest", message: "Invalid checklist payload" });
      }

      const university = await prisma.university.findUnique({
        where: { id: universityId },
        select: { id: true },
      });
      if (!university) {
        return reply.code(404).send({ error: "NotFound", message: "University not found" });
      }

      const completedSteps = Array.from(new Set(parsed.data.completedSteps));
      const saved = await prisma.universityChecklistProgress.upsert({
        where: { userId_universityId: { userId, universityId } },
        create: { userId, universityId, completedSteps },
        update: { completedSteps },
        select: { universityId: true, completedSteps: true },
      });
      return reply.code(200).send(saved);
    }
  );
}
