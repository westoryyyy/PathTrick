import * as jose from "jose";
import { env } from "../config/env";

// ---------------------------------------------------------------------
// CATATAN PENTING (baca sebelum ubah file ini):
//
// Privy baru saja migrasi SDK server-side dari `@privy-io/server-auth`
// (sekarang DEPRECATED) ke `@privy-io/node`. Karena migrasi ini cukup
// baru, method persis untuk verifikasi access token di paket baru belum
// bisa saya pastikan 100% tanpa akses langsung ke reference docs versi
// terbaru. Daripada menebak nama method SDK yang mungkin salah, saya
// pakai jalur verifikasi manual dengan `jose` — ini didokumentasikan
// resmi oleh Privy sebagai alternatif yang sah & stabil, dan tidak
// bergantung pada versi SDK spesifik.
//
// Yang perlu di-cross-check sekali ke dashboard.privy.io > Settings:
// - Format "Verification Key" yang diberikan: PEM (importSPKI) atau
//   JWK (importJWK). Default di bawah ini asumsikan PEM. Kalau ternyata
//   JWK, ganti importSPKI -> importJWK sesuai komentar di bawah.
// ---------------------------------------------------------------------

export interface PrivyTokenClaims {
  privyId: string; // Privy DID, klaim `sub` di JWT
  appId: string;
  sessionId?: string;
  expiresAt: number;
}

let cachedVerificationKey: Awaited<ReturnType<typeof jose.importSPKI>> | null = null;

async function getVerificationKey() {
  if (cachedVerificationKey) return cachedVerificationKey;

  // Format PEM (default). Kalau dashboard Privy kamu memberi JWK, ganti jadi:
  //   cachedVerificationKey = await jose.importJWK(JSON.parse(env.PRIVY_VERIFICATION_KEY), "EdDSA");
  const pem = env.PRIVY_VERIFICATION_KEY.replace(/\\n/g, "\n");
  cachedVerificationKey = await jose.importSPKI(pem, "EdDSA");
  return cachedVerificationKey;
}

/**
 * Verifikasi Privy ACCESS TOKEN (bukan identity token — beda tujuan).
 * Melempar error kalau token invalid/expired/salah audience.
 */
export async function verifyPrivyAccessToken(
  accessToken: string
): Promise<PrivyTokenClaims> {
  const key = await getVerificationKey();

  const { payload } = await jose.jwtVerify(accessToken, key, {
    issuer: "privy.io",
    audience: env.PRIVY_APP_ID,
  });

  if (!payload.sub) {
    throw new Error("Token Privy tidak memiliki klaim `sub` (privyId)");
  }

  return {
    privyId: payload.sub,
    appId: env.PRIVY_APP_ID,
    sessionId: typeof payload.sid === "string" ? payload.sid : undefined,
    expiresAt: payload.exp ?? 0,
  };
}

/**
 * Helper untuk extract Bearer token dari header Authorization.
 */
export function extractBearerToken(authorizationHeader?: string): string {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    throw new Error("Header Authorization harus berformat 'Bearer <token>'");
  }
  return authorizationHeader.slice("Bearer ".length);
}
