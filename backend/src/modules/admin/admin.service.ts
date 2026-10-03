import { prisma } from "../../lib/prisma";

/**
 * Tolerant date parser untuk format FE (mis. "15 Okt 2026", "30 Nov 2026", ISO, dll.).
 * Jika tidak bisa di-parse, simpan sebagai "TBA" dalam bentuk far-future date atau null.
 */
function parseDeadline(value: string): Date {
  if (!value || value === 'TBA' || value.startsWith('TBA')) {
    // Simpan sebagai tahun jauh di depan sebagai marker "belum ditentukan"
    return new Date('2099-12-31');
  }
  // Coba ISO parse dulu
  const iso = new Date(value);
  if (!isNaN(iso.getTime())) return iso;

  // Coba format Indonesia: "15 Okt 2026", "30 November 2026", dll.
  const MONTH_ID: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, mei: 4, jun: 5,
    jul: 6, agt: 7, ago: 7, sep: 8, okt: 9, nov: 10, des: 11,
    januari: 0, februari: 1, maret: 2, april: 3, juni: 5, juli: 6,
    agustus: 7, september: 8, oktober: 9, november: 10, desember: 11,
  };
  const parts = value.trim().split(/[\s/-]+/);
  if (parts.length >= 3) {
    const day   = parseInt(parts[0], 10);
    const month = MONTH_ID[parts[1].toLowerCase()];
    const year  = parseInt(parts[2], 10);
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  // Fallback: simpan far-future
  return new Date('2099-12-31');
}

export async function createUniversity(userId: string, data: any) {
  return prisma.university.create({
    data: {
      name: data.name,
      country: data.country || "Indonesia",
      facultyTags: Array.isArray(data.facultyTags) ? data.facultyTags : [],
      location: data.location,
      riasecCode: data.riasecCode,
      accreditation: data.accreditation,
      description: data.description,
      coverImageUrl: data.coverImage,
      website: data.website,
      admissionRequirements: data.admissionRequirements,
      estimatedCostMin: data.estimatedCostMin ? Number(data.estimatedCostMin) : null,
      estimatedCostMax: data.estimatedCostMax ? Number(data.estimatedCostMax) : null,
      createdByUserId: userId,
    },
  });
}

export async function updateUniversity(id: string, data: any) {
  return prisma.university.update({
    where: { id },
    data: {
      name: data.name,
      country: data.country || "Indonesia",
      facultyTags: Array.isArray(data.facultyTags) ? data.facultyTags : [],
      location: data.location,
      riasecCode: data.riasecCode,
      accreditation: data.accreditation,
      description: data.description,
      coverImageUrl: data.coverImage,
      website: data.website,
      admissionRequirements: data.admissionRequirements,
      estimatedCostMin: data.estimatedCostMin ? Number(data.estimatedCostMin) : null,
      estimatedCostMax: data.estimatedCostMax ? Number(data.estimatedCostMax) : null,
    },
  });
}

export async function createScholarship(userId: string, data: any) {
  return prisma.scholarship.create({
    data: {
      // Frontend sends 'title', DB stores 'name'
      name: data.title || data.name,
      country: data.country || "Indonesia",
      deadline: parseDeadline(data.deadline),
      // Frontend sends requirements as string[], DB stores as single String (comma-joined)
      requirements: Array.isArray(data.requirements)
        ? data.requirements.join(', ')
        : (data.requirements || ""),
      // Frontend sends 'coverage', DB stores as 'amount'; scope required - use coverage or default
      scope: data.scope || data.coverage || "dalam_negeri",
      amount: data.coverage || data.amount,
      provider: data.provider,
      officialUrl: data.url || data.officialUrl || null,
      coverImageUrl: data.coverImage,
      createdByUserId: userId,
    },
  });
}

export async function updateScholarship(id: string, data: any) {
  return prisma.scholarship.update({
    where: { id },
    data: {
      name: data.title || data.name,
      country: data.country || "Indonesia",
      deadline: parseDeadline(data.deadline),
      requirements: Array.isArray(data.requirements)
        ? data.requirements.join(', ')
        : (data.requirements || ""),
      scope: data.scope || data.coverage || "dalam_negeri",
      amount: data.coverage || data.amount,
      provider: data.provider,
      officialUrl: data.url || data.officialUrl || null,
      coverImageUrl: data.coverImage,
    },
  });
}

export async function createJob(userId: string, data: any) {
  return prisma.job.create({
    data: {
      title: data.title,
      company: data.company,
      type: data.type || "Full-time",
      skillsRequired: data.skills || [],
      location: data.location,
      salaryRange: data.salaryRange,
      coverImageUrl: data.coverImage,
      createdByUserId: userId,
    },
  });
}

export async function updateJob(id: string, data: any) {
  return prisma.job.update({
    where: { id },
    data: {
      title: data.title,
      company: data.company,
      type: data.type || "Full-time",
      skillsRequired: data.skills || [],
      location: data.location,
      salaryRange: data.salaryRange,
      coverImageUrl: data.coverImage,
    },
  });
}
