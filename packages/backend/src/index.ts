import { setupApp } from './app.js';
import './load-formats.js';

(async () => {
  const app = await setupApp();
  await app.listen({ port: 3000 });
})();
