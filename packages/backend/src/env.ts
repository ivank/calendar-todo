import { Type, Static } from '@sinclair/typebox';

export const Env = Type.Object({ JWT_SECRET: Type.String(), ORIGIN: Type.String() });
export type EnvType = Static<typeof Env>;
