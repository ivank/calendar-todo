import { expect, test } from 'vitest';
import { testRun } from './helpers';

test(
  'Should be able to protect urls with jwt',
  testRun(
    1000,
    async ({ get, app }) => {
      await expect(app.inject('/lists?from=10000&to=10100')).resolves.toHaveProperty('statusCode', 401);
      await expect(get('/lists?from=10000&to=10100')).resolves.toHaveProperty('statusCode', 200);
    },
    { LOG_LEVEL: 'silent' },
  ),
  { timeout: 15000 },
);
