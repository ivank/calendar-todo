import { writeFileSync } from 'fs';
import { setupApp } from './app.js';
import { join, dirname } from 'node:path';
import { inspect } from 'node:util';
import { fileURLToPath } from 'url';
import { loadEnv } from './env.js';

(async () => {
  const app = await setupApp(loadEnv());
  await app.ready();

  const filename = join(dirname(fileURLToPath(import.meta.url)), '../openapi.json');
  const openapi = (app as any).swagger();

  writeFileSync(filename, JSON.stringify(openapi, null, 2), 'utf-8');
  console.log(inspect(openapi, { colors: true, depth: 4 }));
  console.log(`Successfully created OpenAPI spec at ${filename}`);
})();
