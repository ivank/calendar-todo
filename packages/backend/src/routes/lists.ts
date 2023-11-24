import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Value } from '@sinclair/typebox/value';

const IdPath = Type.Object({ id: Type.Number() });
const ExistingItem = Type.Object({ id: Type.Number() });
const Line = Type.Object({ done: Type.Boolean(), text: Type.String() });
const DayListData = Type.Object({ position: Type.Number(), type: Type.Literal('DAY'), items: Type.Array(Line) });
const DayList = Type.Composite([DayListData, ExistingItem]);
const NamedListData = Type.Object({
  title: Type.String(),
  position: Type.Number(),
  type: Type.Literal('NAMED'),
  items: Type.Array(Line),
});
const NamedList = Type.Composite([NamedListData, ExistingItem]);
const ListData = Type.Union([DayListData, NamedListData]);
const List = Type.Union([DayList, NamedList]);
const Lists = Type.Array(List);
const ListsQuery = Type.Object({ from: Type.Number(), to: Type.Number() });
const select = { id: true, position: true, title: true, items: true, type: true };

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
          select,
          where: { userId: user.id, OR: [{ position: { gte: from, lte: to }, type: 'DAY' }, { type: 'NAMED' }] },
          orderBy: { position: 'asc' },
        });
        res.send(Value.Decode(Lists, lists));
      },
    )
    .post(
      '/',
      { schema: { body: ListData, response: { 200: List } }, onRequest: async (req) => await req.jwtVerify() },
      async ({ user, body: data }, res) =>
        res.send(Value.Decode(List, await prisma.list.create({ data: { ...data, userId: user.id }, select }))),
    )
    .get(
      '/:id',
      { schema: { params: IdPath, response: { 200: List } }, onRequest: async (req) => await req.jwtVerify() },
      async ({ user, params: { id } }, res) =>
        res.send(Value.Decode(List, await prisma.list.findFirstOrThrow({ where: { id, userId: user.id }, select }))),
    )
    .patch(
      '/:id',
      {
        schema: { params: IdPath, body: ListData, response: { 200: List } },
        onRequest: async (req) => await req.jwtVerify(),
      },
      async ({ user, body: data, params: { id } }, res) =>
        res.send(Value.Decode(List, await prisma.list.update({ data, where: { id, userId: user.id }, select }))),
    )
    .delete(
      '/:id',
      { schema: { params: IdPath, response: { 200: List } }, onRequest: async (req) => await req.jwtVerify() },
      async ({ user, params: { id } }, res) =>
        res.send(Value.Decode(List, await prisma.list.delete({ where: { id, userId: user.id }, select }))),
    );
};
