import { buildApp } from "./app";
import { env } from "./config/env";

const app = buildApp();

app
  .listen({ port: env.PORT, host: "0.0.0.0" })
  .then((address) => {
    app.log.info(`PATHTRICK backend siap di ${address}`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });

process.on("SIGTERM", async () => {
  await app.close();
  process.exit(0);
});
