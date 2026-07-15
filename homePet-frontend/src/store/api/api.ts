import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './createBaseApi';
import { TAG_TYPES } from './tagTypes';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: TAG_TYPES,
  endpoints: () => ({}),
});
