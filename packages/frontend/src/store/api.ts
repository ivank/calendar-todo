import { apiGenerated } from './api.generated';

export const updateWithId =
  <T extends { id: number }>(id: number, value: T) =>
  (items: T[]) => {
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items[index] = value;
    }
  };

export const api = apiGenerated.enhanceEndpoints({
  addTagTypes: ['User'],
  endpoints: {
    patchDayListsById: {
      async onQueryStarted({ body }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(api.util.updateQueryData('getDayLists', undefined, updateWithId(body.id, body)));
        queryFulfilled.catch(patchResult.undo);
      },
    },
    patchNamedListsById: {
      async onQueryStarted({ body }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(api.util.updateQueryData('getNamedLists', undefined, updateWithId(body.id, body)));
        queryFulfilled.catch(patchResult.undo);
      },
    },
  },
});
