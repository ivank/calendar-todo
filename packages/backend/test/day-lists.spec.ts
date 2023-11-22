import { expect, test } from 'vitest';
import { testRun } from './helpers';

test(
  'Should be able to protect urls with jwt',
  testRun(3000, async ({ get, post, patch, del }) => {
    const lists = (await get('/day-lists?from=2023-01-01&to=2023-01-07')).json();
    expect(lists).toEqual([
      expect.objectContaining({ day: '2023-01-01' }),
      expect.objectContaining({ day: '2023-01-02' }),
    ]);

    const createdItem = (
      await post({
        url: '/day-lists',
        body: { day: '2023-01-03', items: [{ done: false, text: 'test line' }] },
      })
    ).json();
    expect(createdItem).toMatchObject({ day: '2023-01-03' });

    const modifiedLists = (await get('/day-lists?from=2023-01-01&to=2023-01-07')).json();
    expect(modifiedLists).toEqual([
      expect.objectContaining({ day: '2023-01-01' }),
      expect.objectContaining({ day: '2023-01-02' }),
      expect.objectContaining({ day: '2023-01-03', id: createdItem.id }),
    ]);

    const updatedItem = await patch({
      url: `/day-lists/${createdItem.id}`,
      body: {
        day: '2023-01-03',
        items: [
          { done: true, text: 'test line' },
          { done: false, text: 'test new' },
        ],
      },
    });
    expect(updatedItem).toHaveProperty('statusCode', 200);

    const item = (await get(`/day-lists/${createdItem.id}`)).json();
    expect(item).toMatchObject({
      items: [
        { done: true, text: 'test line' },
        { done: false, text: 'test new' },
      ],
    });

    const deleted = (await del(`/day-lists/${createdItem.id}`)).json();
    expect(deleted).toMatchObject({ day: '2023-01-03' });

    const cleanedLists = (await get('/day-lists?from=2023-01-01&to=2023-01-07')).json();
    expect(cleanedLists).toEqual([
      expect.objectContaining({ day: '2023-01-01' }),
      expect.objectContaining({ day: '2023-01-02' }),
    ]);
  }),
);
