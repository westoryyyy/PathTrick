import { prisma } from "../../lib/prisma";

export async function createUniversity(userId: string, data: any) {
  return prisma.university.create({
    data: {
      name: data.name,
      country: data.location || "Indonesia",
      facultyTags: data.riasecCode ? [data.riasecCode] : [],
      location: data.location,
      riasecCode: data.riasecCode,
      accreditation: data.accreditation,
      description: data.description,
      coverImageUrl: data.coverImage,
      createdByUserId: userId,
    },
  });
}

export async function updateUniversity(id: string, data: any) {
  return prisma.university.update({
    where: { id },
    data: {
      name: data.name,
      country: data.location || "Indonesia",
      facultyTags: data.riasecCode ? [data.riasecCode] : [],
      location: data.location,
      riasecCode: data.riasecCode,
      accreditation: data.accreditation,
      description: data.description,
      coverImageUrl: data.coverImage,
    },
  });
}

export async function createScholarship(userId: string, data: any) {
  return prisma.scholarship.create({
    data: {
      // Frontend sends 'title', DB stores 'name'
      name: data.title || data.name,
      country: "Indonesia",
      deadline: new Date(data.deadline),
      // Frontend sends requirements as string[], DB stores as single String (comma-joined)
      requirements: Array.isArray(data.requirements)
        ? data.requirements.join(', ')
        : (data.requirements || ""),
      // Frontend sends 'coverage', DB stores as 'amount'; scope required - use coverage or default
      scope: data.scope || data.coverage || "dalam_negeri",
      amount: data.coverage || data.amount,
      provider: data.provider,
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
      deadline: new Date(data.deadline),
      requirements: Array.isArray(data.requirements)
        ? data.requirements.join(', ')
        : (data.requirements || ""),
      scope: data.scope || data.coverage || "dalam_negeri",
      amount: data.coverage || data.amount,
      provider: data.provider,
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
