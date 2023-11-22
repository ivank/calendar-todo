import { setupApp } from './app.js';
import { loadEnv } from './env.js';

(async () => {
  const env = loadEnv();
  const app = await setupApp(env);
  try {
    await app.listen({ port: Number(env.PORT), host: env.HOST });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();
