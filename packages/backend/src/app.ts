import fastify from 'fastify';
import swagger from '@fastify/swagger';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Value } from '@sinclair/typebox/value';
import { auth } from './routes/auth.js';
import { Env } from './env.js';
import { namedLists } from './routes/named-lists.js';
import { dayLists } from './routes/day-lists.js';
import fastifyJwt from '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: number; email: string; name: string };
    user: { id: number; email: string; name: string };
  }
}

export const setupApp = async () => {
  const env = Value.Decode(Env, process.env);
  const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

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
