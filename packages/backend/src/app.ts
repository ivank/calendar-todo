import fastify from 'fastify';
import swagger from '@fastify/swagger';
import cors from '@fastify/cors';
import { Prisma, PrismaClient } from '@prisma/client';
import { auth } from './routes/auth.js';
import { EnvType } from './env.js';
import { lists } from './routes/lists.js';
import fastifyJwt from '@fastify/jwt';
import './load-formats.js';
import { wellKnown } from './routes/well-known.js';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: number };
    user: { id: number };
  }
}

/**
 * Convert fastify log level into prisma log levels.
 */
const prismaLevels: Record<EnvType['LOG_LEVEL'], Prisma.LogLevel[]> = {
  silent: [],
  fatal: ['error'],
  error: ['error'],
  warn: ['error', 'warn'],
  info: ['error', 'warn', 'info'],
  debug: ['error', 'warn', 'info', 'query'],
  trace: ['error', 'warn', 'info', 'query'],
};

export const setupApp = async (env: EnvType) => {
  const prisma = new PrismaClient({ log: prismaLevels[env.LOG_LEVEL], datasourceUrl: env.DATABASE_URL });

  const app = fastify({ logger: { level: env.LOG_LEVEL, transport: { target: '@fastify/one-line-logger' } } });
  await app.register(swagger, {
    openapi: {
      openapi: '3.1.0',
      servers: [{ url: env.SERVER_URL, description: 'Deployment' }],
      info: { title: 'Calendar Todo', version: '1.0.0' },
    },
  });
  await app.register(cors, { origin: env.ORIGIN, credentials: true });
  await app.register(fastifyJwt, { secret: env.JWT_SECRET });

  app.setErrorHandler(function (error, { log }, res) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && (error.code === 'P2025' || error.code === 'P2016')) {
      res.status(404).send({ message: `Unable to find ${error.meta?.tableName ?? 'database'} record` });
    } else {
      log.error(error);
      res.send(error);
    }
  });

  // Routes
  // ========================================================
  await app.register(wellKnown, { prefix: '/.well-known' });
  await app.register(auth, { prisma, env, prefix: '/auth' });
  await app.register(lists, { prisma, prefix: '/lists' });

  return app;
};
