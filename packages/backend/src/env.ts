import { Type, Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

export const Env = Type.Object({
  JWT_SECRET: Type.String(),
  ORIGIN: Type.String({ format: 'uri' }),
  DATABASE_URL: Type.String({ format: 'uri' }),
  SERVER_URL: Type.String({ format: 'uri' }),
  PORT: Type.String(),
  HOST: Type.String(),
  LOG_LEVEL: Type.Union([
    Type.Literal('fatal'),
    Type.Literal('error'),
    Type.Literal('warn'),
    Type.Literal('info'),
    Type.Literal('debug'),
    Type.Literal('trace'),
    Type.Literal('silent'),
  ]),
});
export type EnvType = Static<typeof Env>;

export const loadEnv = () => Value.Decode(Env, process.env);
