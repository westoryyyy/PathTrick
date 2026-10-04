import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { cvUpdateHandler } from "./cv.controller";

const cvRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.post("/api/cv/update", { onRequest: [fastify.authenticate] }, cvUpdateHandler);
};

export default cvRoutes;
