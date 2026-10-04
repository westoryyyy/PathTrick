import { prisma } from "../../lib/prisma";
import { groq } from "../../lib/groq";

export async function processCVUpdate(userId: string, cvText: string) {
  // 2. Fetch user's current CHASER_PROFILE assessment
  const assessment = await prisma.assessment.findFirst({
    where: {
      userId,
      type: "CHASER_PROFILE",
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
  });

  let oldSkills: string[] = [];
  if (assessment && assessment.payload) {
    const payload = assessment.payload as any;
    if (Array.isArray(payload.confirmedSkills)) {
      oldSkills = payload.confirmedSkills;
    }
  }

  // 3. Extract skills with Groq
  const prompt = `Ekstrak daftar skill teknis dan non-teknis dari teks CV berikut. 
Kembalikan HANYA array string dalam format JSON (contoh: ["Python", "React", "Leadership"]).
Jangan tambahkan teks markdown atau penjelasan apapun.

Teks CV:
${cvText.substring(0, 5000)}
`;

  let newExtractedSkills: string[] = [];
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });
    
    let content = response.choices[0]?.message?.content || "[]";
    content = content.replace(/```json/g, "").replace(/```/g, "").trim();
    newExtractedSkills = JSON.parse(content);
  } catch (error) {
    console.error("Groq extraction error:", error);
    newExtractedSkills = []; // fallback empty
  }

  // 4. Compare
  const newSkillsDetected: string[] = [];
  
  // lowercase map for comparison
  const oldSkillsMap = new Set(oldSkills.map(s => s.toLowerCase().trim()));
  
  for (const s of newExtractedSkills) {
    if (!oldSkillsMap.has(s.toLowerCase().trim())) {
      newSkillsDetected.push(s);
    }
  }

  const missingSkills: string[] = [];

  // Update Gamification
  let xpGained = 0;
  if (newSkillsDetected.length > 0) {
    xpGained = newSkillsDetected.length * 100; // 100 XP per new skill
    await prisma.gamification.upsert({
      where: { userId },
      update: { xp: { increment: xpGained } },
      create: { userId, xp: xpGained },
    });
  }

  // Update assessment payload
  if (assessment && newSkillsDetected.length > 0) {
    const payload = assessment.payload as any;
    const updatedSkills = [...oldSkills, ...newSkillsDetected];
    payload.confirmedSkills = updatedSkills;
    await prisma.assessment.update({
      where: { id: assessment.id },
      data: { payload },
    });
  }

  return {
    newSkills: newSkillsDetected,
    missingSkills: missingSkills,
    xpGained: xpGained,
  };
}
