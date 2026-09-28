import { z } from "zod";

// Identitas user (privyId) TIDAK divalidasi di sini — itu datang dari
// access token yang sudah diverifikasi server-side (lib/privy.ts). Body
// ini cuma boleh berisi data profil tambahan yang sifatnya tidak kritis
// untuk keamanan (email/name), karena access token Privy sendiri hanya
// membawa klaim identitas (sub/aud/iss/exp), bukan data profil.
export const syncBodySchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).max(100).optional(),
  walletAddress: z.string().startsWith("0x").optional(),
});

export type SyncBody = z.infer<typeof syncBodySchema>;

// -------------------------------------------------------------------
// Zod schema untuk body PATCH /api/users/role
// -------------------------------------------------------------------
export const setRoleSchema = z.object({
  // Nama role yang ingin dipilih user. Validasi "apakah role ini ada dan
  // bisa di-pilih" dilakukan di service (dari DB), bukan hardcode di sini,
  // supaya tidak perlu update schema kalau ada role baru di masa depan.
  roleName: z.string().min(1, "roleName wajib diisi"),
});

