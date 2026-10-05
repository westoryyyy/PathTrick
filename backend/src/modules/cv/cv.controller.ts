import { FastifyRequest, FastifyReply } from "fastify";
import { processCVUpdate } from "./cv.service";
import { sanitizeTextInput } from "../../utils/sanitize";

export async function cvUpdateHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { cvText } = req.body as { cvText: string };
    if (!cvText) {
      return reply.status(400).send({ error: "Teks CV tidak ditemukan." });
    }

    const result = await processCVUpdate(req.user.userId, sanitizeTextInput(cvText));

    return reply.status(200).send(result);
  } catch (error: any) {
    req.log.error(error);
    return reply.status(500).send({ error: "Gagal memproses CV: " + error.message });
  }
}
