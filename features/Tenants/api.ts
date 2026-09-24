import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "@/axiosconfig/baseQuery";

import type {
  ICreateTenantRequest,
  ITenantDetails,
  ITenantsQuery,
  ITenantsResponse,
} from "@/features/Tenants/types";
import {
  toHiveCreateTenant,
  toUiTenantDetails,
  toUiTenantsResponse,
} from "@/features/Tenants/adapters";
import { GET, POST } from "@/utils/constants/apiConstants";
import { TENANTS } from "@/utils/constants/urlConstants";

const tenantsApi = createApi({
  reducerPath: "tenantsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["tenantsApi"],
  endpoints: (builder) => ({
    listTenants: builder.query<ITenantsResponse, ITenantsQuery>({
      query: ({ page, size }) => ({
        url: TENANTS,
        method: GET,
        data: { page, size },
        requiresAuth: false,
      }),
      transformResponse: toUiTenantsResponse,
      providesTags: ["tenantsApi"],
    }),
    addTenant: builder.mutation<unknown, ICreateTenantRequest>({
      query: (data) => ({
        url: TENANTS,
        method: POST,
        data: toHiveCreateTenant(data),
        requiresAuth: false,
      }),
      invalidatesTags: ["tenantsApi"],
    }),
    getTenantDetails: builder.query<ITenantDetails, string>({
      query: (customerId) => ({
        url: `${TENANTS}/${encodeURIComponent(customerId)}`,
        method: GET,
        requiresAuth: false,
      }),
      transformResponse: toUiTenantDetails,
      providesTags: ["tenantsApi"],
    }),
  }),
  refetchOnFocus: true,
});

export const {
  useListTenantsQuery,
  useAddTenantMutation,
  useGetTenantDetailsQuery,
} = tenantsApi;

export default tenantsApi;
