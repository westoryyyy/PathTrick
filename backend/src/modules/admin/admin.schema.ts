import { z } from "zod";

export const universitySchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  location: z.string().optional(),
  riasecCode: z.string().optional(),
  accreditation: z.string().optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
});

export const scholarshipSchema = z.object({
  // Frontend sends 'title', not 'name'
  title: z.string().min(1, "Nama beasiswa wajib diisi").optional(),
  name: z.string().min(1, "Nama beasiswa wajib diisi").optional(),
  provider: z.string().min(1, "Provider wajib diisi"),
  deadline: z.string().min(1, "Deadline wajib diisi"),
  // Frontend sends 'coverage', not 'amount'
  coverage: z.string().optional(),
  amount: z.string().optional(),
  scope: z.string().optional(),
  // requirements can be string[] (from tags input) or plain string
  requirements: z.union([z.array(z.string()), z.string()]).optional(),
  coverImage: z.string().optional(),
  // Link pendaftaran beasiswa — disimpan ke officialUrl di DB
  url: z.string().url("URL tidak valid").optional().or(z.literal('')),
}).refine(data => data.title || data.name, {
  message: "Nama beasiswa wajib diisi",
  path: ["title"],
});

export const jobSchema = z.object({
  title: z.string().min(1, "Posisi wajib diisi"),
  company: z.string().min(1, "Perusahaan wajib diisi"),
  location: z.string().optional(),
  type: z.string().optional(),
  salaryRange: z.string().optional(),
  skills: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
});
