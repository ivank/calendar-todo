import { EnvType } from '../src/env.js';
import { setupApp } from '../src/app.js';
import { FastifyInstance, InjectOptions, LightMyRequestResponse } from 'fastify';
import { IncomingHttpHeaders } from 'http';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';

const execAsync = promisify(exec);

export const toTestEnv = (id: number, customEnv?: Partial<EnvType>): EnvType => ({
  DATABASE_URL: `postgresql://refast-admin:refast-pass@localhost:5432/refast_test_${id}`,
  PORT: String(id),
  HOST: 'localhost',
  SERVER_URL: `http://localhost:${id}`,
  ORIGIN: 'http://localhost:5173',
  JWT_SECRET: `secret-jwt-${id}`,
  LOG_LEVEL: 'error',
  ...customEnv,
});

export interface TestRunContext {
  app: FastifyInstance;
  /**
   * Calls app.inject with authorization headers that should allow it to connect to protected endpoints
   */
  api: Api;
  get: Api;
  post: Api;
  patch: Api;
  del: Api;
  env: EnvType;
}

export const testRun =
  (id: number, test: (context: TestRunContext) => Promise<unknown>, customEnv?: Partial<EnvType>) => async () => {
    const env = toTestEnv(id, customEnv);
    const app = await setupApp(env);
    await execAsync(`yarn prisma migrate reset --force --skip-generate`, { env: { ...process.env, ...env } });
    await test({
      app,
      api: toApi(app),
      get: toApi(app, { method: 'GET' }),
      post: toApi(app, { method: 'POST' }),
      patch: toApi(app, { method: 'PATCH' }),
      del: toApi(app, { method: 'DELETE' }),
      env,
    });
    await app.close();
  };

/**
 * A custom inject call with predefined headers
 */
export type Api = (opts: InjectOptions | string) => Promise<LightMyRequestResponse>;

/**
 * Wrap the app.inject function by adding headers needed for authenticated request
 */
export const toApi =
  (app: FastifyInstance, additional?: InjectOptions): Api =>
  (opts) =>
    app.inject(
      typeof opts === 'string'
        ? { url: opts, ...additional, headers: toHeaders(app) }
        : { ...opts, ...additional, headers: toHeaders(app) },
    );

export const toHeaders = (app: FastifyInstance): IncomingHttpHeaders => ({
  authorization: `Bearer ${app.jwt.sign({ id: 1, email: 'test@example.com', name: 'Test User' })}`,
});
