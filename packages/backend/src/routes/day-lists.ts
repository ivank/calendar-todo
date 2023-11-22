import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Value } from '@sinclair/typebox/value';

const IdPath = Type.Object({ id: Type.Number() });

const ExistingItem = Type.Object({ id: Type.Number() });
const Line = Type.Object({ done: Type.Boolean(), text: Type.String() });

const DayListData = Type.Object({ day: Type.String({ format: 'date' }), items: Type.Array(Line) });
const DayList = Type.Composite([DayListData, ExistingItem], { description: 'TodoDayList' });
const dayListSelect = { id: true, day: true, items: true };
const DayLists = Type.Array(DayList);

export const dayLists: FastifyPluginAsync<{ prisma: PrismaClient }> = async (app, { prisma }) => {
  app

    .withTypeProvider<TypeBoxTypeProvider & { input: unknown }>()
    .get(
      '/',
      {
        schema: {
          querystring: Type.Object({ from: Type.String({ format: 'date' }), to: Type.String({ format: 'date' }) }),
          response: { 200: DayLists },
        },
        onRequest: async (req) => await req.jwtVerify(),
      },
      async ({ user, query: { from, to } }, res) => {
        res.send(
          Value.Decode(
            DayLists,
            await prisma.todoDayList.findMany({
              where: { userId: user.id, day: { gte: from, lte: to } },
              select: dayListSelect,
            }),
          ),
        );
      },
    )
    .post(
      '/',
      {
        schema: { body: DayListData, response: { 200: DayList } },
        onRequest: async (req) => await req.jwtVerify(),
      },
      async ({ user, body: data }, res) => {
        res.send(
          Value.Decode(
            DayList,
            await prisma.todoDayList.create({ data: { ...data, userId: user.id }, select: dayListSelect }),
          ),
        );
      },
    )
    .get(
      '/:id',
      {
        schema: { params: IdPath, response: { 200: DayList } },
        onRequest: async (req) => await req.jwtVerify(),
      },
      async ({ user, params: { id } }, res) => {
        res.send(
          Value.Decode(
            DayList,
            await prisma.todoDayList.findFirstOrThrow({ where: { id, userId: user.id }, select: dayListSelect }),
          ),
        );
      },
    )
    .patch(
      '/:id',
      {
        schema: { params: IdPath, body: DayList, response: { 200: DayList } },
        onRequest: async (req) => await req.jwtVerify(),
      },
      async ({ user, body: data, params: { id } }, res) => {
        res.send(
          Value.Decode(
            DayList,
            await prisma.todoDayList.update({ data, where: { id, userId: user.id }, select: dayListSelect }),
          ),
        );
      },
    )
    .delete(
      '/:id',
      {
        schema: { params: IdPath, response: { 200: DayList } },
        onRequest: async (req) => await req.jwtVerify(),
      },
      async ({ user, params: { id } }, res) => {
        res.send(
          Value.Decode(
            DayList,
            await prisma.todoDayList.delete({ where: { id, userId: user.id }, select: dayListSelect }),
          ),
        );
      },
    );
};
