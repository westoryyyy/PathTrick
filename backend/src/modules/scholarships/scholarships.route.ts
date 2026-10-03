import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireAdmin } from "../admin/admin.middleware";

export default async function scholarshipsRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/api/scholarships",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { studyfield, scope } = request.query as {
        studyfield?: string;
        scope?: "dalam_negeri" | "luar_negeri" | "keduanya";
      };

      let finalStudyfield = studyfield;
      let finalScope = scope;

      if (!studyfield && !scope) {
        const { userId } = request.user;
        const preference = await prisma.assessment.findFirst({
          where: { userId, type: "DREAMER_PREFERENCE" },
          orderBy: { createdAt: "desc" },
        });
        
        if (preference) {
          const payload = preference.payload as any;
          if (payload.studyfield) finalStudyfield = payload.studyfield;
          if (payload.countryPreference) finalScope = payload.countryPreference; // 'dalam_negeri' | 'luar_negeri' | 'keduanya'
        }
      }

      const where: any = {};
      if (finalStudyfield) {
        const studyfields = Array.isArray(finalStudyfield) ? finalStudyfield : [finalStudyfield];
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
        const shortCodes = studyfields.map(sf => REVERSE_FACULTY_MAP[sf] || sf);
        where.facultyTags = { hasSome: shortCodes };
      }
      if (finalScope) {
        if (Array.isArray(finalScope) && finalScope.length > 0) {
          const hasIndo = finalScope.includes('indonesia');
          const hasForeign = finalScope.some(c => c !== 'indonesia');
          if (hasIndo && !hasForeign) {
            where.scope = { in: ["dalam_negeri", "keduanya"] };
          } else if (!hasIndo && hasForeign) {
            where.scope = { in: ["luar_negeri", "keduanya"] };
          }
          where.OR = [
            { country: { in: finalScope, mode: "insensitive" as const } },
            { country: { equals: "Global", mode: "insensitive" as const } },
            { country: { equals: "Keduanya", mode: "insensitive" as const } },
            ...(hasIndo ? [{ country: { equals: "Indonesia", mode: "insensitive" as const } }] : [])
          ];
        } else if (typeof finalScope === 'string' && finalScope !== "keduanya") {
          where.scope = finalScope;
        }
      }

      const scholarships = await prisma.scholarship.findMany({
        where,
        select: {
          id: true,
          name: true,
          country: true,
          deadline: true,
          facultyTags: true,
          scope: true,
          provider: true,
          amount: true,          // coverage / jumlah bantuan
          requirements: true,
          officialUrl: true,     // link daftar beasiswa — wajib ada untuk Dreamer
          coverImageUrl: true,
        },
        orderBy: { deadline: 'asc' },
      });

      return reply.code(200).send({ total: scholarships.length, scholarships });
    }
  );

  fastify.get(
    "/api/scholarships/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const scholarship = await prisma.scholarship.findUnique({ where: { id } });

      if (!scholarship) {
        return reply.code(404).send({ error: "NotFound", message: "Beasiswa tidak ditemukan" });
      }

      return reply.code(200).send(scholarship);
    }
  );

  }
