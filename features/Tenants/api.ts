import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "@/axiosconfig/baseQuery";

import type {
  ICreateTenantRequest,
  ITenantsResponse,
} from "@/features/Tenants/types";
import { GET, POST } from "@/utils/constants/apiConstants";
import { TENANTS } from "@/utils/constants/urlConstants";

const tenantsApi = createApi({
  reducerPath: "tenantsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["tenantsApi"],
  endpoints: (builder) => ({
    listTenants: builder.query<ITenantsResponse, void>({
      query: () => ({
        url: TENANTS,
        method: GET,
        requiresAuth: false,
      }),
      providesTags: ["tenantsApi"],
    }),
    addTenant: builder.mutation<unknown, ICreateTenantRequest>({
      query: (data) => ({
        url: TENANTS,
        method: POST,
        data,
        requiresAuth: false,
      }),
      invalidatesTags: ["tenantsApi"],
    }),
  }),
  refetchOnFocus: true,
});

export const { useListTenantsQuery, useAddTenantMutation } = tenantsApi;

export default tenantsApi;
