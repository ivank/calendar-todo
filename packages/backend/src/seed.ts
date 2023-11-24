import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({ data: { email: 'test@example.com', name: 'Test User' } });
  await prisma.list.createMany({
    data: [
      {
        title: 'Test One',
        userId: user.id,
        position: 0,
        type: 'NAMED',
        items: [
          { done: false, text: 'pending' },
          { done: true, text: 'finished' },
        ],
      },
      {
        title: 'Test Two',
        userId: user.id,
        position: 1,
        type: 'NAMED',
        items: [
          { done: false, text: 'pending' },
          { done: true, text: 'finished' },
        ],
      },
      {
        userId: user.id,
        position: 10000,
        type: 'DAY',
        items: [
          { done: false, text: 'one' },
          { done: true, text: 'tue' },
        ],
      },
      {
        position: 10003,
        type: 'DAY',
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
