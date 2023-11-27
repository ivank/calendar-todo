import { expect, test } from 'vitest';
import { testRun } from './helpers';

test(
  'Should be able to retrieve and modify day and named lists',
  testRun(3000, async ({ get, post, patch, del }) => {
    const lists = (await get('/lists?from=10000&to=10100')).json();
    expect(lists).toEqual([
      expect.objectContaining({ position: 0, type: 'NAMED' }),
      expect.objectContaining({ position: 1, type: 'NAMED' }),
      expect.objectContaining({ position: 10000, type: 'DAY' }),
      expect.objectContaining({ position: 10003, type: 'DAY' }),
    ]);

    const sync1 = await post({
      url: '/lists',
      body: [
        {
          position: 10005,
          type: 'DAY',
          items: [{ done: false, text: 'test line' }],
          updatedAt: 1701009812582,
        },
        {
          position: 2,
          title: 'Test Test',
          type: 'NAMED',
          items: [{ done: false, text: 'test line' }],
          updatedAt: 1701009812582,
        },
        {
          position: 3,
          title: 'Somber',
          type: 'NAMED',
          items: [{ done: true, text: 'done done' }],
          updatedAt: 1701009812582,
        },
      ],
    });

    expect(sync1.json()).toEqual({ synced: 3 });

    const lists2 = (await get('/lists?from=10000&to=10100')).json();
    expect(lists2).toEqual([
      expect.objectContaining({ position: 0, type: 'NAMED' }),
      expect.objectContaining({ position: 1, type: 'NAMED' }),
      expect.objectContaining({ position: 2, type: 'NAMED' }),
      expect.objectContaining({ position: 3, type: 'NAMED' }),
      expect.objectContaining({ position: 10000, type: 'DAY' }),
      expect.objectContaining({ position: 10003, type: 'DAY' }),
      expect.objectContaining({ position: 10005, type: 'DAY' }),
    ]);

    const sync2 = await post({
      url: '/lists',
      body: [
        { position: 10005, type: 'DAY', items: [{ done: true, text: 'fixed' }], updatedAt: 1701009812583 },
        { position: 2, isDeleted: true, type: 'NAMED', updatedAt: 1701009812583 },
      ],
    });
    expect(sync2.json()).toEqual({ synced: 2 });

    const list2 = await get('/lists?from=10000&to=10100');
    expect(list2.json()).toEqual([
      expect.objectContaining({ position: 0, type: 'NAMED' }),
      expect.objectContaining({ position: 1, type: 'NAMED' }),
      expect.objectContaining({ position: 3, type: 'NAMED' }),
      expect.objectContaining({ position: 10000, type: 'DAY' }),
      expect.objectContaining({ position: 10003, type: 'DAY' }),
      expect.objectContaining({ position: 10005, type: 'DAY', items: [{ done: true, text: 'fixed' }] }),
    ]);

    const sync3 = await post({
      url: '/lists',
      body: [
        { position: 10005, type: 'DAY', isDeleted: true, updatedAt: 1701009812584 },
        { position: 3, isDeleted: true, type: 'NAMED', updatedAt: 1701009812584 },
      ],
    });
    expect(sync3.json()).toEqual({ synced: 2 });

    const list3 = await get('/lists?from=10000&to=10100');
    expect(list3.json()).toEqual([
      expect.objectContaining({ position: 0, type: 'NAMED' }),
      expect.objectContaining({ position: 1, type: 'NAMED' }),
      expect.objectContaining({ position: 10000, type: 'DAY' }),
      expect.objectContaining({ position: 10003, type: 'DAY' }),
    ]);
  }),
  { timeout: 15000 },
);
