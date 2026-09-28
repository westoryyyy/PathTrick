import { z } from "zod";

// -----------------------------------------------------------------------
// Body untuk CREATE / UPDATE role (admin)
// -----------------------------------------------------------------------
export const upsertRoleBodySchema = z.object({
  name: z.string().min(1).max(32).toUpperCase(), // "DREAMER", "CHASER", dst.
  displayName: z.string().min(1).max(64),
  title: z.string().min(1).max(64),
  description: z.string().min(1),
  perks: z.array(z.string().min(1)).min(1),
  iconUrl: z.string().nullable().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{3,8}$/, "Harus format hex color"),
  glow: z
    .string()
    .regex(/^rgba?\([\d\s.,]+\)$/, "Harus format rgba(...)"),
  tag: z.string().max(16).nullable().optional(),
  isSelectable: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

export type UpsertRoleBody = z.infer<typeof upsertRoleBodySchema>;
