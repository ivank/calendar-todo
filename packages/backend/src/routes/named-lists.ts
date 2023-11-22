import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Value } from '@sinclair/typebox/value';

const IdPath = Type.Object({ id: Type.Number() });

const ExistingItem = Type.Object({ id: Type.Number() });
const Line = Type.Object({ done: Type.Boolean(), text: Type.String() });

const NamedListData = Type.Object({ title: Type.String(), items: Type.Array(Line) });
const NamedList = Type.Composite([NamedListData, ExistingItem], { description: 'TodoNamedList' });
const NamedLists = Type.Array(NamedList);
const nameListSelect = { id: true, title: true, items: true };

export const namedLists: FastifyPluginAsync<{ prisma: PrismaClient }> = async (app, { prisma }) => {
  app
    .withTypeProvider<TypeBoxTypeProvider & { input: unknown }>()
    .get(
      '/',
      {
        schema: { response: { 200: NamedLists } },
        onRequest: async (req) => await req.jwtVerify(),
      },
      async ({ user }, res) => {
        res.send(
          Value.Decode(
            NamedLists,
            await prisma.todoNamedList.findMany({
              select: nameListSelect,
              where: { userId: user.id },
              orderBy: { orderBy: 'asc' },
            }),
          ),
        );
      },
    )
    .post(
      '/',
      {
        schema: {
          body: Type.Composite([Type.Object({ orderBy: Type.Number() }), NamedListData]),
          response: { 200: NamedList },
        },
        onRequest: async (req) => await req.jwtVerify(),
      },
      async ({ user, body: data }, res) => {
        res.send(
          Value.Decode(
            NamedList,
            await prisma.todoNamedList.create({ select: nameListSelect, data: { ...data, userId: user.id } }),
          ),
        );
      },
    )
    .get(
      '/:id',
      {
        schema: { params: IdPath, response: { 200: NamedList } },
        onRequest: async (req) => await req.jwtVerify(),
      },
      async ({ user, params: { id } }, res) => {
        res.send(
          Value.Decode(NamedList, await prisma.todoNamedList.findFirstOrThrow({ where: { id, userId: user.id } })),
        );
      },
    )
    .patch(
      '/:id',
      {
        schema: { params: IdPath, body: NamedListData, response: { 200: NamedList } },
        onRequest: async (req) => await req.jwtVerify(),
      },
      async ({ user, body: data, params: { id } }, res) => {
        res.send(
          Value.Decode(
            NamedList,
            await prisma.todoNamedList.update({ data, where: { id, userId: user.id }, select: nameListSelect }),
          ),
        );
      },
    )
    .delete(
      '/:id',
      {
        schema: { params: IdPath, response: { 200: NamedList } },
        onRequest: async (req) => await req.jwtVerify(),
      },
      async ({ user, params: { id } }, res) => {
        res.send(
          Value.Decode(
            NamedList,
            await prisma.todoNamedList.delete({ where: { id, userId: user.id }, select: nameListSelect }),
          ),
        );
      },
    );
};
