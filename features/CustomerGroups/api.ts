import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "@/axiosconfig/baseQuery";

import type { ICreateCustomerGroupRequest } from "@/features/CustomerGroups/types";
import { POST } from "@/utils/constants/apiConstants";
import { CUSTOMER_GROUPS } from "@/utils/constants/urlConstants";

const customerGroupsApi = createApi({
  reducerPath: "customerGroupsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["customerGroupsApi"],
  endpoints: (builder) => ({
    addCustomerGroup: builder.mutation<unknown, ICreateCustomerGroupRequest>({
      query: (data) => ({
        url: CUSTOMER_GROUPS,
        method: POST,
        data,
        requiresAuth: false,
      }),
      invalidatesTags: ["customerGroupsApi"],
    }),
  }),
});

export const { useAddCustomerGroupMutation } = customerGroupsApi;

export default customerGroupsApi;
