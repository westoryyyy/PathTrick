import { z } from "zod";
import { sanitizeTextInput } from "../../utils/sanitize";

// Identitas user (privyId) TIDAK divalidasi di sini — itu datang dari
// access token yang sudah diverifikasi server-side (lib/privy.ts). Body
// ini cuma boleh berisi data profil tambahan yang sifatnya tidak kritis
// untuk keamanan (email/name), karena access token Privy sendiri hanya
// membawa klaim identitas (sub/aud/iss/exp), bukan data profil.
export const syncBodySchema = z.object({
  email: z.string().email().max(254).optional(),
  name: z.string().trim().min(1).max(100).transform(sanitizeTextInput).optional(),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "walletAddress tidak valid").optional(),
});

export type SyncBody = z.infer<typeof syncBodySchema>;

// -------------------------------------------------------------------
// Zod schema untuk body PATCH /api/users/role
// -------------------------------------------------------------------
export const setRoleSchema = z.object({
  // Nama role yang ingin dipilih user. Validasi "apakah role ini ada dan
  // bisa di-pilih" dilakukan di service (dari DB), bukan hardcode di sini,
  // supaya tidak perlu update schema kalau ada role baru di masa depan.
  roleName: z.string().trim().min(1, "roleName wajib diisi").max(50),
});

