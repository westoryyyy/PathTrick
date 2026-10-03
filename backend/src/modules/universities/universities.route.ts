import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireAdmin } from "../admin/admin.middleware";

export default async function universitiesRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/universities
   * List universitas + filter (studyfield, country, budgetTier)
   */
  fastify.get(
    "/api/universities",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { studyfield, country, budgetTier } = request.query as {
        studyfield?: string;
        country?: string;
        budgetTier?: "TERJANGKAU" | "MENENGAH" | "PREMIUM" | "EKSKLUSIF" | "FULL_SCHOLARSHIP";
      };

      let finalStudyfield = studyfield;
      let finalCountry = country;
      let finalBudgetTier = budgetTier;

      // Jika tidak ada filter yang diberikan, ambil dari preferensi user
      if (!studyfield && !country && !budgetTier) {
        const { userId } = request.user;
        const preference = await prisma.assessment.findFirst({
          where: { userId, type: "DREAMER_PREFERENCE" },
          orderBy: { createdAt: "desc" },
        });
        
        if (preference) {
          const payload = preference.payload as any;
          if (payload.studyfield) finalStudyfield = payload.studyfield;
          if (payload.budgetTier) finalBudgetTier = payload.budgetTier;
          if (payload.countryPreference) {
            finalCountry = payload.countryPreference; // it's an array now!
          }
        }
      }

      const where: any = {};

      if (finalStudyfield) {
        // Reverse map dari label ke short code karena DB menyimpan short code (misal 'cs_it')
        const REVERSE_FACULTY_MAP: Record<string, string> = {
          'Agribisnis & Pertanian': 'agr_farm',
          'Akuntansi & Keuangan': 'biz_acc',
          'Bisnis & Manajemen': 'biz_mgmt',
          'Data Science & AI': 'data_ai',
          'Desain & Seni Rupa': 'arts_design',
          'Fisika, Kimia & Biologi': 'sci_natural',
          'Hubungan Internasional': 'soc_ir',
          'Ilmu Hukum': 'law',
          'Ilmu Komunikasi': 'soc_comm',
          'Ilmu Komputer & TI': 'cs_it',
          'Ilmu Politik & Publik': 'law_public',
          'Kedokteran Umum/Gigi': 'med_doctor',
          'Kehutanan & Lingkungan': 'agr_env',
          'Keperawatan & Farmasi': 'med_nurse',
          'Matematika & Statistika': 'sci_math',
          'Mesin & Elektro': 'eng_mech',
          'Pendidikan Guru': 'edu_teacher',
          'Psikologi': 'soc_psy',
          'Sastra & Bahasa': 'arts_lang',
          'Sipil & Arsitektur': 'eng_civil',
          'Teknologi Pendidikan': 'edu_tech'
        };
        const shortCode = REVERSE_FACULTY_MAP[finalStudyfield] || finalStudyfield;
        where.facultyTags = { hasSome: [shortCode] };
      }
      
      if (finalCountry) {
        const INDONESIA_VARIANTS = ['indonesia', 'id'];
        // Support both array and string
        const rawCountry = Array.isArray(finalCountry) ? finalCountry[0] : String(finalCountry);
        const normalized = rawCountry.toLowerCase().trim();

        if (normalized === 'dalam_negeri') {
          // Only show Indonesian universities
          where.country = { in: INDONESIA_VARIANTS, mode: 'insensitive' };
        } else if (normalized === 'luar_negeri') {
          // Show universities NOT from Indonesia
          where.NOT = { country: { in: INDONESIA_VARIANTS, mode: 'insensitive' } };
        } else {
          // Specific country name passed directly
          where.country = { equals: normalized, mode: 'insensitive' };
        }
      }

      if (finalBudgetTier) {
        // Perbaikan logika budget: cukup cek apakah estimatedCostMin masih masuk budget user.
        // Jika user punya budget Menengah (max 15jt), maka kampus yang biaya minimumnya 4jt (walau maxnya 17jt) tetap bisa ia masuki.
        if (finalBudgetTier === "TERJANGKAU") {
          where.estimatedCostMin = { lte: 5000000 };
        } else if (finalBudgetTier === "MENENGAH") {
          where.estimatedCostMin = { lte: 15000000 };
        } else if (finalBudgetTier === "PREMIUM") {
          where.estimatedCostMin = { lte: 30000000 };
        } else if (finalBudgetTier === "EKSKLUSIF") {
          // Tidak dibatasi
        }
        // FULL_SCHOLARSHIP tidak memfilter cost
      }

      const universities = await prisma.university.findMany({
        where,
      });

      return reply.code(200).send({ total: universities.length, universities });
    }
  );

  /**
   * GET /api/universities/:id
   * Detail universitas
   */
  fastify.get(
    "/api/universities/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const university = await prisma.university.findUnique({ where: { id } });

      if (!university) {
        return reply.code(404).send({ error: "NotFound", message: "Universitas tidak ditemukan" });
      }

      return reply.code(200).send(university);
    }
  );

  }
