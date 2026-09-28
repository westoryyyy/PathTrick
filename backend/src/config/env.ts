import "dotenv/config";
import { z } from "zod";

// Fail fast: kalau ada env yang hilang/salah format, server harus langsung
// crash saat startup — bukan lolos lalu gagal aneh di tengah request nanti.
// Ini prinsip yang sama dengan guardrail AI (AI-03): lebih baik gagal jelas
// & cepat daripada gagal diam-diam di titik yang lebih kritis.
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(8080),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL wajib diisi"),


  PRIVY_APP_ID: z.string().min(1, "PRIVY_APP_ID wajib diisi"),
  PRIVY_VERIFICATION_KEY: z.string().min(1, "PRIVY_VERIFICATION_KEY wajib diisi"),

  GROQ_API_KEY: z.string().optional(),
  COHERE_API_KEY: z.string().optional(),

  // WEB3 SIGNING CONFIG
  SIGNER_PRIVATE_KEY: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "SIGNER_PRIVATE_KEY harus berupa hex 0x... sepanjang 64 karakter"),
  CONTRACT_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "CONTRACT_ADDRESS harus berupa address 0x... sepanjang 40 karakter"),
  CHAIN_ID: z.coerce.number().default(97), // BSC Testnet

  APP_JWT_SECRET: z.string().min(16, "APP_JWT_SECRET minimal 16 karakter"),
  APP_JWT_EXPIRES_IN: z.string().default("7d"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Environment variable tidak valid:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
