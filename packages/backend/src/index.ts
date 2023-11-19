import { setupApp } from './app';
import './load-formats';

(async () => {
  const app = await setupApp();
  await app.listen({ port: 3000 });
})();
