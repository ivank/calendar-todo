import { writeFileSync } from 'fs';
import { setupApp } from './app';
import { join } from 'path';
import { inspect } from 'util';

(async () => {
  const app = await setupApp();
  await app.ready();

  const filename = join(__dirname, '../openapi.json');
  const openapi = (app as any).swagger();

  writeFileSync(filename, JSON.stringify(openapi, null, 2), 'utf-8');
  console.log(inspect(openapi, { colors: true, depth: 4 }));
  console.log(`Successfully created OpenAPI spec at ${filename}`);
})();
