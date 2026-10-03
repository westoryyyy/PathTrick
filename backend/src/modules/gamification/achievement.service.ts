import { prisma } from "../../lib/prisma";

export type BadgeDefinition = {
  key: string;
  title: string;
  description: string;
};

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { key: "mission_completer", title: "Mission Completer", description: "Completed 1 Mission" },
  { key: "early_bird", title: "Early Bird", description: "Login Before Dawn" },
  { key: "streak_warrior", title: "Streak Warrior", description: "7-Day Login Streak" },
  { key: "quiz_master", title: "Quiz Master", description: "Perfect Quiz" },
  { key: "quick_learner", title: "Quick Learner", description: "Fast Finisher" },
  { key: "course_master", title: "Course Master", description: "Completed 1 Course" },
  { key: "first_step", title: "First Step", description: "Started Journey" },
  { key: "night_owl", title: "Night Owl", description: "Night Owl Study" },
];

const BADGE_KEYS = new Set(BADGE_DEFINITIONS.map((badge) => badge.key));

export async function refreshUserAchievements(userId: string) {
  const [loginEvents, courseProgress, quizAttempts] = await Promise.all([
    prisma.userLoginEvent.findMany({
      where: { userId },
      orderBy: { dateStr: "asc" },
      select: { dateStr: true, createdAt: true },
    }),
    prisma.courseProgress.findMany({
      where: { userId },
      select: {
        status: true,
        startedAt: true,
        completedAt: true,
        finalScore: true,
      },
    }),
    prisma.quizAttempt.findMany({
      where: { courseProgress: { userId } },
      select: {
        score: true,
        passed: true,
        createdAt: true,
      },
    }),
  ]);

  const completedCourses = courseProgress.filter((progress) => progress.status === "COMPLETED").length;
  const startedJourney = courseProgress.some(
    (progress) =>
      (progress.status === "IN_PROGRESS" || progress.status === "COMPLETED") &&
      Boolean(progress.startedAt)
  );
  const perfectQuizCount = quizAttempts.filter((attempt) => attempt.score >= 100).length;
  const missionCompletedCount = quizAttempts.filter((attempt) => attempt.passed).length + completedCourses;
  const earlyLoginCount = loginEvents.filter((event) => {
    const hour = new Date(event.createdAt).getHours();
    return hour < 6;
  }).length;
  const nightOwlCount = loginEvents.filter((event) => {
    const hour = new Date(event.createdAt).getHours();
    return hour >= 22;
  }).length;
  const earlyBird = earlyLoginCount >= 2 && (completedCourses > 0 || missionCompletedCount > 0);
  const nightOwl = nightOwlCount >= 2 && (completedCourses > 0 || missionCompletedCount > 0);

  let streak = 0;
  const sortedDates = [...new Set(loginEvents.map((event) => event.dateStr))].sort((a, b) => a.localeCompare(b));
  for (let i = sortedDates.length - 1; i >= 0; i--) {
    const current = new Date(`${sortedDates[i]}T00:00:00Z`);
    const previousDate = sortedDates[i - 1] ?? sortedDates[i];
    const previous = new Date(`${previousDate}T00:00:00Z`);
    const diffDays = Math.round((current.getTime() - previous.getTime()) / 86400000);

    if (i === sortedDates.length - 1 || diffDays === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  const fastFinish = courseProgress.some((progress) => {
    if (!progress.startedAt || !progress.completedAt) return false;
    const diffMinutes = (progress.completedAt.getTime() - progress.startedAt.getTime()) / 60000;
    return diffMinutes <= 30;
  });

  const unlocked = new Set<string>();
  if (startedJourney) unlocked.add("first_step");
  if (missionCompletedCount >= 1) unlocked.add("mission_completer");
  if (earlyBird) unlocked.add("early_bird");
  if (streak >= 7) unlocked.add("streak_warrior");
  if (perfectQuizCount >= 1) unlocked.add("quiz_master");
  if (fastFinish) unlocked.add("quick_learner");
  if (completedCourses >= 1) unlocked.add("course_master");
  if (nightOwl) unlocked.add("night_owl");

  const existing = await prisma.achievement.findMany({
    where: { userId },
    select: { key: true },
  });
  const existingKeys = new Set(existing.map((item) => item.key));
  const newUnlocked = [...unlocked].filter((key) => !existingKeys.has(key));

  for (const badge of BADGE_DEFINITIONS) {
    if (!unlocked.has(badge.key)) continue;
    await prisma.achievement.upsert({
      where: {
        userId_key: { userId, key: badge.key },
      },
      create: {
        userId,
        key: badge.key,
        title: badge.title,
        description: badge.description,
      },
      update: {},
    });
  }

  for (const key of newUnlocked) {
    const badge = BADGE_DEFINITIONS.find((item) => item.key === key);
    if (!badge) continue;

    await prisma.notification.create({
      data: {
        userId,
        type: "SYSTEM_MESSAGE",
        title: `Badge unlocked: ${badge.title}`,
        body: badge.description,
      },
    });
  }

  for (const key of [...BADGE_KEYS]) {
    if (existingKeys.has(key) && !unlocked.has(key)) {
      await prisma.achievement.delete({
        where: { userId_key: { userId, key } },
      });
    }
  }

  return {
    unlocked: [...unlocked],
    definitions: BADGE_DEFINITIONS,
  };
}
