import { GetListsApiResponse, PostListsApiArg, apiGenerated } from './api.generated';
import { updateCurrent } from './lists.slice';

export const api = apiGenerated.enhanceEndpoints({
  endpoints: {
    getLists: {
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        queryFulfilled.then(({ data }) => dispatch(updateCurrent(data)));
      },
    },
  },
});

export type List = GetListsApiResponse[0];
export type Items = List['items'][0];
export type SyncList = PostListsApiArg['body'][0];
export type DayList = Extract<List, { type: 'DAY' }>;
export type NamedList = Extract<List, { type: 'NAMED' }>;
export type DeletedDayList = Extract<SyncList, { type: 'DAY'; isDeleted: true }>;
export type DeletedNamedList = Extract<SyncList, { type: 'NAMED'; isDeleted: true }>;
