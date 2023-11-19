import fastify from 'fastify';
import swagger from '@fastify/swagger';
import cors from '@fastify/cors';
import { PrismaClient } from './__generated__/prisma';
import { Type, TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Value } from '@sinclair/typebox/value';

export const setupApp = async () => {
  const app = fastify({
    logger: {
      transport: { target: 'pino-pretty', options: { translateTime: 'HH:MM:ss Z', ignore: 'pid,hostname' } },
    },
  }).withTypeProvider<TypeBoxTypeProvider & { input: unknown }>();

  await app.register(swagger, { openapi: { openapi: '3.1.0', info: { title: 'Refast TuexDuex', version: '1.0.0' } } });
  await app.register(cors, { origin: true });

  const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

  const AuthInfoQueryString = Type.Object({ userId: Type.Number() });
  const IdPath = Type.Object({ id: Type.Number() });

  const ExistingItem = Type.Object({ id: Type.Number() });
  const Line = Type.Object({ done: Type.Boolean(), text: Type.String() });

  const NamedListData = Type.Object({ title: Type.String(), items: Type.Array(Line) });
  const NamedList = Type.Composite([NamedListData, ExistingItem], { description: 'TodoNamedList' });
  const NamedLists = Type.Array(NamedList);
  const nameListSelect = { id: true, title: true, items: true };

  const DayListData = Type.Object({ day: Type.String({ format: 'date' }), items: Type.Array(Line) });
  const DayList = Type.Composite([DayListData, ExistingItem], { description: 'TodoDayList' });
  const dayListSelect = { id: true, day: true, items: true };
  const DayLists = Type.Array(DayList);

  return app
    .get(
      '/named-lists',
      { schema: { querystring: AuthInfoQueryString, response: { 200: NamedLists } } },
      async ({ query: { userId } }, res) => {
        res.send(
          Value.Decode(NamedLists, await prisma.todoNamedList.findMany({ select: nameListSelect, where: { userId } })),
        );
      },
    )
    .post(
      '/named-lists',
      {
        schema: {
          querystring: AuthInfoQueryString,
          body: Type.Composite([Type.Object({ orderBy: Type.Number() }), NamedListData]),
          response: { 200: NamedList },
        },
      },
      async ({ query: { userId }, body: data }, res) => {
        res.send(
          Value.Decode(
            NamedList,
            await prisma.todoNamedList.create({ select: nameListSelect, data: { ...data, userId } }),
          ),
        );
      },
    )
    .get(
      '/named-lists/:id',
      { schema: { querystring: AuthInfoQueryString, params: IdPath, response: { 200: NamedList } } },
      async ({ params: { id } }, res) => {
        res.send(Value.Decode(NamedList, await prisma.todoNamedList.findFirstOrThrow({ where: { id } })));
      },
    )
    .patch(
      '/named-lists/:id',
      { schema: { querystring: AuthInfoQueryString, params: IdPath, body: NamedList, response: { 200: NamedList } } },
      async ({ body: data, params: { id } }, res) => {
        res.send(
          Value.Decode(NamedList, await prisma.todoNamedList.update({ data, where: { id }, select: nameListSelect })),
        );
      },
    )
    .delete(
      '/named-lists/:id',
      { schema: { querystring: AuthInfoQueryString, params: IdPath, response: { 200: NamedList } } },
      async ({ params: { id } }, res) => {
        res.send(Value.Decode(NamedList, await prisma.todoNamedList.delete({ where: { id }, select: nameListSelect })));
      },
    )
    .get(
      '/day-lists',
      {
        schema: {
          querystring: Type.Composite([
            AuthInfoQueryString,
            Type.Object({ from: Type.String({ format: 'date' }), to: Type.String({ format: 'date' }) }),
          ]),
          response: { 200: DayLists },
        },
      },
      async ({ query: { userId, from, to } }, res) => {
        res.send(
          Value.Decode(
            DayLists,
            await prisma.todoDayList.findMany({
              where: { userId, day: { gte: from, lte: to } },
              select: dayListSelect,
            }),
          ),
        );
      },
    )
    .post(
      '/day-lists',
      { schema: { querystring: AuthInfoQueryString, body: DayListData, response: { 200: DayList } } },
      async ({ query: { userId }, body: data }, res) => {
        res.send(
          Value.Decode(DayList, await prisma.todoDayList.create({ data: { ...data, userId }, select: dayListSelect })),
        );
      },
    )
    .get(
      '/day-lists/:id',
      { schema: { querystring: AuthInfoQueryString, params: IdPath, response: { 200: DayList } } },
      async ({ params: { id } }, res) => {
        res.send(
          Value.Decode(DayList, await prisma.todoDayList.findFirstOrThrow({ where: { id }, select: dayListSelect })),
        );
      },
    )
    .patch(
      '/day-lists/:id',
      { schema: { querystring: AuthInfoQueryString, params: IdPath, body: DayList, response: { 200: DayList } } },
      async ({ body: data, params: { id } }, res) => {
        res.send(
          Value.Decode(DayList, await prisma.todoDayList.update({ data, where: { id }, select: dayListSelect })),
        );
      },
    )
    .delete(
      '/day-lists/:id',
      { schema: { querystring: AuthInfoQueryString, params: IdPath, response: { 200: DayList } } },
      async ({ params: { id } }, res) => {
        res.send(Value.Decode(DayList, await prisma.todoDayList.delete({ where: { id }, select: dayListSelect })));
      },
    );
};
