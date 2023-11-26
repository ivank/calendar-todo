import { GetListsApiResponse, apiGenerated } from "./api.generated";

const updateWithId =
  <T extends { id: number }>(id: number, value: T) =>
  (items: T[]) => {
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0) {
      items[index] = value;
    }
  };

export const api = apiGenerated.enhanceEndpoints({
  addTagTypes: ["List"],
  endpoints: {
    patchListsById: {
      async onQueryStarted({ body, id }, { dispatch, queryFulfilled }) {
        const result = dispatch(
          api.util.updateQueryData(
            "getLists",
            undefined,
            updateWithId(id, { ...body, id }),
          ),
        );
        queryFulfilled.catch(result.undo);
      },
    },
    getLists: { providesTags: ["List"] },
    postLists: { invalidatesTags: ["List"] },
    deleteListsById: { invalidatesTags: ["List"] },
  },
});

export type List = GetListsApiResponse[0];
export type DayList = Extract<List, { type: "DAY" }>;
export type NamedList = Extract<List, { type: "NAMED" }>;

export const isDayList = (list: List): list is DayList => list.type === "DAY";
export const isNamedList = (list: List): list is NamedList =>
  list.type === "NAMED";
