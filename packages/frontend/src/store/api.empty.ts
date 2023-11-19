import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

export const apiEmpty = createApi({
  reducerPath: 'refastApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_API }),
  refetchOnMountOrArgChange: true,
  endpoints: () => ({}),
});
