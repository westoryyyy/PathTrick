import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
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
import universityChecklistRoutes from "./modules/universities/checklist.route";
import scholarshipsRoutes from "./modules/scholarships/scholarships.route";
import jobsRoutes from "./modules/jobs/jobs.route";
import rolesRoutes from "./modules/roles/roles.route";
import certificatesRoutes from "./modules/gamification/certificates.route";
import notificationsRoutes from "./modules/notifications/notifications.route";
import questsRoutes from "./modules/quests/quests.route";
import cvRoutes from "./modules/cv/cv.route";
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
    origin: (origin, cb) => {
      if (!origin) {
        cb(null, true);
        return;
      }
      if (env.CORS_ORIGIN === '*') {
        cb(null, true);
        return;
      }
      const allowedOrigins = env.CORS_ORIGIN.split(',').map(o => o.trim());
      if (allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
  });

  // Security headers (API only, so CSP can be strict)
  app.register(helmet, { contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: "cross-origin" } });

  // Global rate limit per IP; AI/auth endpoints are cheap to abuse.
  app.register(rateLimit, {
    global: true,
    max: 300,
    timeWindow: "1 minute",
    allowList: (req) => req.url === "/health",
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
  app.register(universityChecklistRoutes);
  app.register(scholarshipsRoutes);
  app.register(jobsRoutes);
  app.register(rolesRoutes);
  app.register(certificatesRoutes);
  app.register(notificationsRoutes);
  app.register(questsRoutes);
  app.register(cvRoutes);
  app.get("/health", async () => ({ status: "ok", timestamp: new Date().toISOString() }));

  return app;
}


