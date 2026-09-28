import { PrismaClient } from "@prisma/client";
import { env } from "../config/env";

// Singleton pattern — mencegah tsx watch/hot-reload bikin banyak instance
// PrismaClient (tiap instance = koneksi pool baru ke Postgres) tiap kali
// file berubah saat development.
declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (env.NODE_ENV === "development") {
  global.__prisma = prisma;
}
