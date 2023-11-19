import { apiEmpty as api } from './api.empty';
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getNamedLists: build.query<GetNamedListsApiResponse, GetNamedListsApiArg>({
      query: (queryArg) => ({ url: `/named-lists`, params: { userId: queryArg.userId } }),
    }),
    postNamedLists: build.mutation<PostNamedListsApiResponse, PostNamedListsApiArg>({
      query: (queryArg) => ({
        url: `/named-lists`,
        method: 'POST',
        body: queryArg.body,
        params: { userId: queryArg.userId },
      }),
    }),
    getNamedListsById: build.query<GetNamedListsByIdApiResponse, GetNamedListsByIdApiArg>({
      query: (queryArg) => ({ url: `/named-lists/${queryArg.id}`, params: { userId: queryArg.userId } }),
    }),
    patchNamedListsById: build.mutation<PatchNamedListsByIdApiResponse, PatchNamedListsByIdApiArg>({
      query: (queryArg) => ({
        url: `/named-lists/${queryArg.id}`,
        method: 'PATCH',
        body: queryArg.body,
        params: { userId: queryArg.userId },
      }),
    }),
    deleteNamedListsById: build.mutation<DeleteNamedListsByIdApiResponse, DeleteNamedListsByIdApiArg>({
      query: (queryArg) => ({
        url: `/named-lists/${queryArg.id}`,
        method: 'DELETE',
        params: { userId: queryArg.userId },
      }),
    }),
    getDayLists: build.query<GetDayListsApiResponse, GetDayListsApiArg>({
      query: (queryArg) => ({
        url: `/day-lists`,
        params: { userId: queryArg.userId, from: queryArg['from'], to: queryArg.to },
      }),
    }),
    postDayLists: build.mutation<PostDayListsApiResponse, PostDayListsApiArg>({
      query: (queryArg) => ({
        url: `/day-lists`,
        method: 'POST',
        body: queryArg.body,
        params: { userId: queryArg.userId },
      }),
    }),
    getDayListsById: build.query<GetDayListsByIdApiResponse, GetDayListsByIdApiArg>({
      query: (queryArg) => ({ url: `/day-lists/${queryArg.id}`, params: { userId: queryArg.userId } }),
    }),
    patchDayListsById: build.mutation<PatchDayListsByIdApiResponse, PatchDayListsByIdApiArg>({
      query: (queryArg) => ({
        url: `/day-lists/${queryArg.id}`,
        method: 'PATCH',
        body: queryArg.body,
        params: { userId: queryArg.userId },
      }),
    }),
    deleteDayListsById: build.mutation<DeleteDayListsByIdApiResponse, DeleteDayListsByIdApiArg>({
      query: (queryArg) => ({
        url: `/day-lists/${queryArg.id}`,
        method: 'DELETE',
        params: { userId: queryArg.userId },
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as apiGenerated };
export type GetNamedListsApiResponse = /** status 200 Default Response */ {
  title: string;
  items: {
    done: boolean;
    text: string;
  }[];
  id: number;
}[];
export type GetNamedListsApiArg = {
  userId: number;
};
export type PostNamedListsApiResponse = /** status 200 TodoNamedList */ {
  title: string;
  items: {
    done: boolean;
    text: string;
  }[];
  id: number;
};
export type PostNamedListsApiArg = {
  userId: number;
  body: {
    orderBy: number;
    title: string;
    items: {
      done: boolean;
      text: string;
    }[];
  };
};
export type GetNamedListsByIdApiResponse = /** status 200 TodoNamedList */ {
  title: string;
  items: {
    done: boolean;
    text: string;
  }[];
  id: number;
};
export type GetNamedListsByIdApiArg = {
  userId: number;
  id: number;
};
export type PatchNamedListsByIdApiResponse = /** status 200 TodoNamedList */ {
  title: string;
  items: {
    done: boolean;
    text: string;
  }[];
  id: number;
};
export type PatchNamedListsByIdApiArg = {
  userId: number;
  id: number;
  /** TodoNamedList */
  body: {
    title: string;
    items: {
      done: boolean;
      text: string;
    }[];
    id: number;
  };
};
export type DeleteNamedListsByIdApiResponse = /** status 200 TodoNamedList */ {
  title: string;
  items: {
    done: boolean;
    text: string;
  }[];
  id: number;
};
export type DeleteNamedListsByIdApiArg = {
  userId: number;
  id: number;
};
export type GetDayListsApiResponse = /** status 200 Default Response */ {
  day: string;
  items: {
    done: boolean;
    text: string;
  }[];
  id: number;
}[];
export type GetDayListsApiArg = {
  userId: number;
  from: string;
  to: string;
};
export type PostDayListsApiResponse = /** status 200 TodoDayList */ {
  day: string;
  items: {
    done: boolean;
    text: string;
  }[];
  id: number;
};
export type PostDayListsApiArg = {
  userId: number;
  body: {
    day: string;
    items: {
      done: boolean;
      text: string;
    }[];
  };
};
export type GetDayListsByIdApiResponse = /** status 200 TodoDayList */ {
  day: string;
  items: {
    done: boolean;
    text: string;
  }[];
  id: number;
};
export type GetDayListsByIdApiArg = {
  userId: number;
  id: number;
};
export type PatchDayListsByIdApiResponse = /** status 200 TodoDayList */ {
  day: string;
  items: {
    done: boolean;
    text: string;
  }[];
  id: number;
};
export type PatchDayListsByIdApiArg = {
  userId: number;
  id: number;
  /** TodoDayList */
  body: {
    day: string;
    items: {
      done: boolean;
      text: string;
    }[];
    id: number;
  };
};
export type DeleteDayListsByIdApiResponse = /** status 200 TodoDayList */ {
  day: string;
  items: {
    done: boolean;
    text: string;
  }[];
  id: number;
};
export type DeleteDayListsByIdApiArg = {
  userId: number;
  id: number;
};
export const {
  useGetNamedListsQuery,
  usePostNamedListsMutation,
  useGetNamedListsByIdQuery,
  usePatchNamedListsByIdMutation,
  useDeleteNamedListsByIdMutation,
  useGetDayListsQuery,
  usePostDayListsMutation,
  useGetDayListsByIdQuery,
  usePatchDayListsByIdMutation,
  useDeleteDayListsByIdMutation,
} = injectedRtkApi;
