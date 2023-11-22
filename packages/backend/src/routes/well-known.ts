import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import { createReadStream } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const wellKnown: FastifyPluginAsync = async (app) => {
  app
    .get('/health-check', { schema: { response: { 200: Type.Object({ healthy: Type.Boolean() }) } } }, async (_, res) =>
      res.send({ healthy: true }),
    )
    .get('/openapi.json', {}, async (_, res) => {
      res.header('Content-Type', 'application/octet-stream');
      const openapiFile = join(dirname(fileURLToPath(import.meta.url)), '../../openapi.json');
      res.send(createReadStream(openapiFile, 'utf8'));
    });
};
