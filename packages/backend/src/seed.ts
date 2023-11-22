import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
    },
  });
  await prisma.todoNamedList.createMany({
    data: [
      {
        title: 'Test One',
        userId: user.id,
        orderBy: 0,
        items: [
          { done: false, text: 'pending' },
          { done: true, text: 'finished' },
        ],
      },
      {
        title: 'Test Two',
        userId: user.id,
        orderBy: 1,
        items: [
          { done: false, text: 'pending' },
          { done: true, text: 'finished' },
        ],
      },
    ],
  });
  await prisma.todoDayList.createMany({
    data: [
      {
        userId: user.id,
        day: '2023-01-01',
        items: [
          { done: false, text: 'one' },
          { done: true, text: 'tue' },
        ],
      },
      {
        day: '2023-01-02',
        userId: user.id,
        items: [
          { done: false, text: 'three' },
          { done: true, text: 'four' },
        ],
      },
    ],
  });
}
main().finally(() => prisma.$disconnect());
