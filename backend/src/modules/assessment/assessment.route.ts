import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { submitAssessmentSchema } from "./assessment.schema";
import {
  AssessmentDomainError,
  submitDreamerPreference,
  submitDreamerRiasec,
  submitChaserProfile,
} from "./assessment.service";
import { analyzeCv, analyzeCvInputSchema, getChaserDashboard } from "./chaser.service";

import fs from 'fs';
import path from 'path';

export default async function assessmentRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/api/assessment",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parsedBody = submitAssessmentSchema.safeParse(request.body);
      if (!parsedBody.success) {
        return reply.code(400).send({
          error: "ValidationError",
          details: parsedBody.error.flatten(),
        });
      }

      const { userId } = request.user;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true },
      });

      if (!user) {
        return reply.code(404).send({ error: "NotFound", message: "User tidak ditemukan" });
      }

      if (!user.role) {
        return reply.code(400).send({
          error: "RoleNotSet",
          message: "User belum memilih role (DREAMER/CHASER). Pilih role dulu lewat PATCH /api/users/role.",
        });
      }

      const { type } = parsedBody.data;
      const expectedRole = type === "CHASER_PROFILE" ? "CHASER" : "DREAMER";
      if (user.role.name !== expectedRole) {
        return reply.code(403).send({
          error: "RoleMismatch",
          message: `Assessment type "${type}" hanya untuk role ${expectedRole}, akun ini ber-role ${user.role.name}`,
        });
      }

      try {
        switch (parsedBody.data.type) {
          case "DREAMER_RIASEC": {
            const result = await submitDreamerRiasec(userId, parsedBody.data.payload);
            return reply.code(200).send(result);
          }
          case "DREAMER_PREFERENCE": {
            const result = await submitDreamerPreference(userId, parsedBody.data.payload);
            return reply.code(200).send(result);
          }
          case "CHASER_PROFILE": {
            const result = await submitChaserProfile(userId, parsedBody.data.payload);
            return reply.code(200).send(result);
          }
          default: {
            request.log.error(`Unhandled assessment type: ${(parsedBody.data as { type: string }).type}`);
            return reply.code(500).send({ error: "InternalError", message: "Tipe asesmen belum didukung" });
          }
        }
      } catch (error) {
        if (error instanceof AssessmentDomainError) {
          return reply.code(error.statusCode).send({ error: error.name, message: error.message });
        }
        // Error tak terduga -- log detail ke server, jangan bocorkan detail
        // internal ke Frontend.
        request.log.error(error, "Unexpected error di POST /api/assessment");
        return reply.code(500).send({ error: "InternalError", message: "Terjadi kesalahan tak terduga" });
      }
    }
  );

  // ── POST /api/assessment/chaser/analyze-cv ──────────────────────────
  // Step 1 onboarding Chaser: AI Agent 2 mengekstrak skill dari teks CV/portfolio.
  fastify.post(
    "/api/assessment/chaser/analyze-cv",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const parsed = analyzeCvInputSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: "ValidationError", details: parsed.error.flatten() });
      }
      try {
        return reply.code(200).send(await analyzeCv(parsed.data));
      } catch (error) {
        request.log.error(error, "Gagal analisis CV");
        return reply.code(503).send({ error: "AnalysisFailed", message: "Analisis CV gagal, coba lagi sebentar lagi." });
      }
    }
  );

  // ── GET /api/chaser/dashboard ───────────────────────────────────────
  // XP + hasil AI Job Match terakhir milik Chaser yang login.
  fastify.get(
    "/api/chaser/dashboard",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      return reply.code(200).send(await getChaserDashboard(userId));
    }
  );

  // ── GET /api/riasec/questions ───────────────────────────────────────
  // Publik (tanpa auth) -- frontend butuh soal sebelum user login.
  // PENTING: category TIDAK dikembalikan. Frontend hanya tahu {id, text, order}.
  // Scoring yang menggunakan kategori dilakukan 100% di backend.
  fastify.get("/api/riasec/questions", async (_request, reply) => {
    const questions = await prisma.riasecQuestion.findMany({
      where: { isActive: true },
      select: { id: true, text: true, order: true },
      orderBy: { order: "asc" },
    });
    return reply.code(200).send(questions);
  });
}