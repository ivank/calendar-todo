import { apiGenerated } from './api.generated';

export const updateWithId =
  <T extends { id: number }>(id: number, value: T) =>
  (items: T[]) => {
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items[index] = value;
    }
  };
export const add =
  <T extends { id: number }>(value: T) =>
  (items: T[]) => {
    items.push(value);
  };

export const api = apiGenerated.enhanceEndpoints({
  addTagTypes: ['DayList', 'NamedList'],
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
    getNamedLists: { providesTags: ['NamedList'] },
    postNamedLists: { invalidatesTags: ['NamedList'] },
    deleteNamedListsById: { invalidatesTags: ['NamedList'] },
  },
});
