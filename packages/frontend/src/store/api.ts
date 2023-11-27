import { GetListsApiResponse, PostListsApiArg, apiGenerated } from './api.generated';
import { clearChanges, loadData, loadChanges } from './db.slice';

export const api = apiGenerated.enhanceEndpoints({
  endpoints: {
    getLists: {
      onQueryStarted(_, { dispatch, queryFulfilled }) {
        queryFulfilled.then(({ data }) => dispatch(loadData(data)));
      },
    },
    postLists: {
      onQueryStarted({ body }, { dispatch, queryFulfilled }) {
        dispatch(clearChanges());
        queryFulfilled.catch(() => dispatch(loadChanges(body)));
      },
    },
  },
});

export type List = GetListsApiResponse[0];
export type Items = List['items'][0];
export type ChangesList = PostListsApiArg['body'][0];
export type DayList = Extract<List, { type: 'DAY' }>;
export type NamedList = Extract<List, { type: 'NAMED' }>;
export type DeletedDayList = Extract<ChangesList, { type: 'DAY'; isDeleted: true }>;
export type DeletedNamedList = Extract<ChangesList, { type: 'NAMED'; isDeleted: true }>;
