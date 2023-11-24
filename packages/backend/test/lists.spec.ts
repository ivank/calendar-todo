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

    const createdDay = (
      await post({
        url: '/lists',
        body: { position: 10005, type: 'DAY', items: [{ done: false, text: 'test line' }] },
      })
    ).json();
    expect(createdDay).toMatchObject({ position: 10005, type: 'DAY' });

    const createdNamed = (
      await post({
        url: '/lists',
        body: { title: 'Test Test', position: 2, type: 'NAMED', items: [{ done: false, text: 'test line' }] },
      })
    ).json();
    expect(createdNamed).toMatchObject({ title: 'Test Test', type: 'NAMED' });

    const modifiedLists = (await get('/lists?from=10000&to=10100')).json();
    expect(modifiedLists).toEqual([
      expect.objectContaining({ position: 0, type: 'NAMED' }),
      expect.objectContaining({ position: 1, type: 'NAMED' }),
      expect.objectContaining({ position: 2, id: createdNamed.id }),
      expect.objectContaining({ position: 10000, type: 'DAY' }),
      expect.objectContaining({ position: 10003, type: 'DAY' }),
      expect.objectContaining({ position: 10005, id: createdDay.id }),
    ]);

    const updatedDay = await patch({
      url: `/lists/${createdDay.id}`,
      body: {
        position: 10005,
        type: 'DAY',
        items: [
          { done: true, text: 'test line' },
          { done: false, text: 'test new' },
        ],
      },
    });
    expect(updatedDay).toHaveProperty('statusCode', 200);

    const day = (await get(`/lists/${createdDay.id}`)).json();
    expect(day).toMatchObject({
      items: [
        { done: true, text: 'test line' },
        { done: false, text: 'test new' },
      ],
    });

    const deletedDay = (await del(`/lists/${createdDay.id}`)).json();
    expect(deletedDay).toMatchObject({ position: 10005 });

    const updatedNamed = await patch({
      url: `/lists/${createdNamed.id}`,
      body: {
        title: 'Test Updated',
        position: 2,
        type: 'NAMED',
        items: [
          { done: true, text: 'test line' },
          { done: false, text: 'test new' },
        ],
      },
    });
    expect(updatedNamed).toHaveProperty('statusCode', 200);

    const named = (await get(`/lists/${createdNamed.id}`)).json();
    expect(named).toMatchObject({
      title: 'Test Updated',
      items: [
        { done: true, text: 'test line' },
        { done: false, text: 'test new' },
      ],
    });

    const deletedNamed = (await del(`/lists/${createdNamed.id}`)).json();
    expect(deletedNamed).toMatchObject({ title: 'Test Updated' });

    const cleanedLists = (await get('/lists?from=10000&to=10100')).json();
    expect(cleanedLists).toEqual([
      expect.objectContaining({ position: 0, type: 'NAMED' }),
      expect.objectContaining({ position: 1, type: 'NAMED' }),
      expect.objectContaining({ position: 10000, type: 'DAY' }),
      expect.objectContaining({ position: 10003, type: 'DAY' }),
    ]);
  }),
  { timeout: 15000 },
);
