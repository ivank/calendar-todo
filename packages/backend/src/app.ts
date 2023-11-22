import fastify from 'fastify';
import swagger from '@fastify/swagger';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { auth } from './routes/auth.js';
import { EnvType } from './env.js';
import { namedLists } from './routes/named-lists.js';
import { dayLists } from './routes/day-lists.js';
import fastifyJwt from '@fastify/jwt';
import './load-formats.js';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: number; email: string; name: string };
    user: { id: number; email: string; name: string };
  }
}

const toPrismaLogLevels = (minLevel: 'query' | 'info' | 'warn' | 'error') => {
  const levels = ['error', 'warn', 'info', 'query'] as const;
  const minLevelIndex = levels.findIndex((level) => level === minLevel);
  return levels.slice(0, minLevelIndex);
};

export const setupApp = async (env: EnvType) => {
  const prisma = new PrismaClient({ log: toPrismaLogLevels(env.LOG_LEVEL), datasourceUrl: env.DATABASE_URL });

  const app = fastify({
    logger: {
      transport: { target: 'pino-pretty', options: { translateTime: 'HH:MM:ss Z', ignore: 'pid,hostname' } },
    },
  }).withTypeProvider<TypeBoxTypeProvider & { input: unknown }>();

  await app.register(swagger, { openapi: { openapi: '3.1.0', info: { title: 'Refast TuexDuex', version: '1.0.0' } } });
  await app.register(cors, { origin: env.ORIGIN, credentials: true });
  await app.register(fastifyJwt, { secret: env.JWT_SECRET });

  // Routes
  // ========================================================
  await app.register(auth, { prisma, env, prefix: '/auth' });
  await app.register(namedLists, { prisma, prefix: '/named-lists' });
  await app.register(dayLists, { prisma, prefix: '/day-lists' });

  return app;
};
