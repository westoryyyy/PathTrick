import fjwt from "@fastify/jwt";
import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { env } from "../config/env";

// Setelah Privy access token diverifikasi (lihat lib/privy.ts) di endpoint
// /api/auth/sync, backend menerbitkan JWT SESI SENDIRI. Rute-rute lain yang
// butuh proteksi cukup verifikasi JWT ini — tidak perlu re-verify ke Privy,
// tiap request, lebih cepat & tidak nambah beban ke Privy API.
export interface AppJwtPayload {
  userId: string; // User.id internal (bukan privyId)
  roleName: string | null; // "DREAMER" | "CHASER" | "ADMIN" | null (null = belum pilih role)
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: AppJwtPayload;
    user: AppJwtPayload;
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>;
  }
}

export default fp(async function authPlugin(fastify: FastifyInstance) {
  fastify.register(fjwt, {
    secret: env.APP_JWT_SECRET,
    sign: { expiresIn: env.APP_JWT_EXPIRES_IN },
  });

  fastify.decorate("authenticate", async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: "Unauthorized", message: "Token sesi tidak valid atau kedaluwarsa" });
    }
  });
});
