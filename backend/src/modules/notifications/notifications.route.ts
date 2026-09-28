import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export default async function notificationsRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/api/notifications",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;

      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
      });

      const unreadCount = await prisma.notification.count({
        where: { userId, isRead: false },
      });

      return reply.code(200).send({
        notifications,
        unreadCount,
      });
    }
  );

  fastify.post(
    "/api/notifications/:id/read",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { userId } = request.user;

      const notification = await prisma.notification.findUnique({
        where: { id },
      });

      if (!notification || notification.userId !== userId) {
        return reply.code(404).send({ error: "NotFound", message: "Notification not found" });
      }

      const updated = await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });

      return reply.code(200).send(updated);
    }
  );

  fastify.post(
    "/api/notifications/read-all",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;

      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });

      return reply.code(200).send({ message: "All notifications marked as read" });
    }
  );
}
