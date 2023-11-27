import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Value } from '@sinclair/typebox/value';

const Timestamp = Type.Transform(Type.Number())
  .Decode((value) => new Date(value))
  .Encode((value) => value.getTime());

const Line = Type.Object({ done: Type.Boolean(), text: Type.String() });
const DayList = Type.Object({
  position: Type.Number(),
  type: Type.Literal('DAY'),
  items: Type.Array(Line),
  updatedAt: Timestamp,
});
const NamedList = Type.Object({
  position: Type.Number(),
  title: Type.String(),
  type: Type.Literal('NAMED'),
  items: Type.Array(Line),
  updatedAt: Timestamp,
});
const DeletedDayList = Type.Object({
  position: Type.Number(),
  type: Type.Literal('DAY'),
  isDeleted: Type.Literal(true),
  updatedAt: Timestamp,
});
const DeletedNamedList = Type.Object({
  position: Type.Number(),
  type: Type.Literal('NAMED'),
  isDeleted: Type.Literal(true),
  updatedAt: Timestamp,
});
const List = Type.Union([DayList, NamedList]);
const Lists = Type.Array(List);
const Sync = Type.Array(Type.Union([List, DeletedDayList, DeletedNamedList]));
const ListsQuery = Type.Object({ from: Type.Number(), to: Type.Number() });
const SyncResult = Type.Object({ synced: Type.Number() });

export const lists: FastifyPluginAsync<{ prisma: PrismaClient }> = async (app, { prisma }) => {
  app
    .withTypeProvider<TypeBoxTypeProvider & { input: unknown }>()
    .get(
      '/',
      {
        schema: { querystring: ListsQuery, response: { 200: Lists } },
        onRequest: async (req) => await req.jwtVerify(),
      },
      async ({ user, query: { from, to } }, res) => {
        const lists = await prisma.list.findMany({
          select: { position: true, title: true, items: true, type: true, updatedAt: true },
          where: { userId: user.id, OR: [{ position: { gte: from, lte: to }, type: 'DAY' }, { type: 'NAMED' }] },
          orderBy: { position: 'asc' },
        });
        res.send(Value.Encode(Lists, lists));
      },
    )
    .post(
      '/',
      { schema: { body: Sync, response: { 200: SyncResult } }, onRequest: async (req) => await req.jwtVerify() },
      async ({ user, body }, res) => {
        const items = Value.Decode(Sync, body);
        const synced = await prisma.$transaction(
          items.map((data) =>
            'isDeleted' in data
              ? prisma.list.deleteMany({ where: { position: data.position, type: data.type, userId: user.id } })
              : prisma.list.upsert({
                  create: { ...data, userId: user.id },
                  update: data,
                  where: { pos: { position: data.position, type: data.type, userId: user.id } },
                }),
          ),
        );
        res.send({ synced: synced.length });
      },
    );
};
