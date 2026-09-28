import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./config/env";
import authPlugin from "./plugins/auth";
import authRoutes from "./modules/auth/auth.route";
import assessmentRoutes from "./modules/assessment/assessment.route";
import usersRoutes from "./modules/users/users.route";
import coursesRoutes from "./modules/courses/courses.route";
import adminCoursesRoutes from "./modules/courses/courses.admin.route";
import adminRoutes from "./modules/admin/admin.route";
import gamificationRoutes from "./modules/gamification/gamification.route";
import housesRoutes from "./modules/houses/houses.route";
import universitiesRoutes from "./modules/universities/universities.route";
import scholarshipsRoutes from "./modules/scholarships/scholarships.route";
import jobsRoutes from "./modules/jobs/jobs.route";
import rolesRoutes from "./modules/roles/roles.route";
import certificatesRoutes from "./modules/gamification/certificates.route";
import notificationsRoutes from "./modules/notifications/notifications.route";
import questsRoutes from "./modules/quests/quests.route";

export function buildApp() {
  const app = Fastify({
    bodyLimit: 20 * 1024 * 1024, // 20MB limit

    logger: {
      level: env.NODE_ENV === "development" ? "info" : "warn",
      transport:
        env.NODE_ENV === "development"
          ? { target: "pino-pretty", options: { colorize: true } }
          : undefined,
    },
  });

  app.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
  });

  // Plugins
  app.register(authPlugin);

  // Routes
  app.register(authRoutes);
  app.register(assessmentRoutes);
  app.register(usersRoutes);
  app.register(coursesRoutes);
  app.register(adminCoursesRoutes);
  app.register(adminRoutes);
  app.register(gamificationRoutes);
  app.register(housesRoutes);
  app.register(universitiesRoutes);
  app.register(scholarshipsRoutes);
  app.register(jobsRoutes);
  app.register(rolesRoutes);
  app.register(certificatesRoutes);
  app.register(notificationsRoutes);
  app.register(questsRoutes);

  app.get("/health", async () => ({ status: "ok", timestamp: new Date().toISOString() }));

  return app;
}


