import { expect, test } from 'vitest';
import { testRun } from './helpers';

test(
  'Should be able to protect urls with jwt',
  testRun(2000, async ({ get, post, patch, del }) => {
    const lists = (await get('/named-lists')).json();
    expect(lists).toEqual([
      expect.objectContaining({ title: 'Test One' }),
      expect.objectContaining({ title: 'Test Two' }),
    ]);

    const createdItem = (
      await post({
        url: '/named-lists',
        body: { title: 'Test Test', orderBy: 2, items: [{ done: false, text: 'test line' }] },
      })
    ).json();
    expect(createdItem).toMatchObject({ title: 'Test Test' });

    const modifiedLists = (await get('/named-lists')).json();
    expect(modifiedLists).toEqual([
      expect.objectContaining({ title: 'Test One' }),
      expect.objectContaining({ title: 'Test Two' }),
      expect.objectContaining({ title: 'Test Test', id: createdItem.id }),
    ]);

    const updatedItem = await patch({
      url: `/named-lists/${createdItem.id}`,
      body: {
        title: 'Test Updated',
        items: [
          { done: true, text: 'test line' },
          { done: false, text: 'test new' },
        ],
      },
    });
    expect(updatedItem).toHaveProperty('statusCode', 200);

    const item = (await get(`/named-lists/${createdItem.id}`)).json();
    expect(item).toMatchObject({
      title: 'Test Updated',
      items: [
        { done: true, text: 'test line' },
        { done: false, text: 'test new' },
      ],
    });

    const deleted = (await del(`/named-lists/${createdItem.id}`)).json();
    expect(deleted).toMatchObject({ title: 'Test Updated' });

    const cleanedLists = (await get('/named-lists')).json();
    expect(cleanedLists).toEqual([
      expect.objectContaining({ title: 'Test One' }),
      expect.objectContaining({ title: 'Test Two' }),
    ]);
  }),
);
