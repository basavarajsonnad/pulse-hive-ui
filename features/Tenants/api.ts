import { createApi } from "@reduxjs/toolkit/query/react";
import { nanoid } from "@reduxjs/toolkit";
import axiosBaseQuery from "@/axiosconfig/baseQuery";
import type { IApiResponse } from "@/axiosconfig/types";

import type {
  ITenant,
  TenantChanges,
  TenantInput,
} from "@/features/Tenants/types";
import { GET } from "@/utils/constants/apiConstants";
import { TENANTS } from "@/utils/constants/urlConstants";

const buildTenant = (input: TenantInput): ITenant => ({
  ...input,
  id: nanoid(),
  tier: "Basic",
  customerGroup: "Unassigned",
  status: "active",
  users: 0,
  incidents: 0,
  createdAt: new Date().toISOString(),
});

// Only GET /api/tenants exists so far. The write endpoints below just patch the
// cached list (no request is sent) until their real endpoints are added.
const tenantsApi = createApi({
  reducerPath: "tenantsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["tenantsApi"],
  endpoints: (builder) => ({
    listTenants: builder.query<ITenant[], void>({
      query: () => ({
        url: TENANTS,
        method: GET,
        requiresAuth: false,
      }),
      transformResponse: (response: IApiResponse<ITenant[]>) => response.data,
      providesTags: ["tenantsApi"],
    }),
    addTenant: builder.mutation<null, TenantInput>({
      queryFn: () => ({ data: null }),
      onQueryStarted: (input, { dispatch }) => {
        dispatch(
          tenantsApi.util.updateQueryData("listTenants", undefined, (tenants) => {
            tenants.unshift(buildTenant(input));
          }),
        );
      },
    }),
    updateTenant: builder.mutation<
      null,
      { id: string; changes: TenantChanges }
    >({
      queryFn: () => ({ data: null }),
      onQueryStarted: ({ id, changes }, { dispatch }) => {
        dispatch(
          tenantsApi.util.updateQueryData("listTenants", undefined, (tenants) => {
            const tenant = tenants.find((t) => t.id === id);
            if (tenant) Object.assign(tenant, changes);
          }),
        );
      },
    }),
    toggleTenantStatus: builder.mutation<null, string>({
      queryFn: () => ({ data: null }),
      onQueryStarted: (id, { dispatch }) => {
        dispatch(
          tenantsApi.util.updateQueryData("listTenants", undefined, (tenants) => {
            const tenant = tenants.find((t) => t.id === id);
            if (tenant) {
              tenant.status = tenant.status === "active" ? "disabled" : "active";
            }
          }),
        );
      },
    }),
    deleteTenant: builder.mutation<null, string>({
      queryFn: () => ({ data: null }),
      onQueryStarted: (id, { dispatch }) => {
        dispatch(
          tenantsApi.util.updateQueryData("listTenants", undefined, (tenants) => {
            const index = tenants.findIndex((t) => t.id === id);
            if (index !== -1) tenants.splice(index, 1);
          }),
        );
      },
    }),
  }),
});

export const {
  useListTenantsQuery,
  useAddTenantMutation,
  useUpdateTenantMutation,
  useToggleTenantStatusMutation,
  useDeleteTenantMutation,
} = tenantsApi;

export default tenantsApi;
