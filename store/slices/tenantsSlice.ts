import {
  createSelector,
  createSlice,
  nanoid,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { MOCK_NOW, TENANTS_MOCK } from "@/mock/tenants";
import type {
  DateRange,
  ITenant,
  TenantChanges,
  TenantInput,
  ITenantsState,
} from "@/components/tenants/types";

const initialState: ITenantsState = {
  items: TENANTS_MOCK,
  search: "",
  dateRange: "30d",
};

const tenantsSlice = createSlice({
  name: "tenants",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    clearDateRange: (state) => {
      state.dateRange = null;
    },
    toggleStatus: (state, action: PayloadAction<string>) => {
      const tenant = state.items.find((t) => t.id === action.payload);
      if (tenant) {
        tenant.status = tenant.status === "active" ? "disabled" : "active";
      }
    },
    updateTenant: (
      state,
      action: PayloadAction<{ id: string; changes: TenantChanges }>,
    ) => {
      const tenant = state.items.find((t) => t.id === action.payload.id);
      if (tenant) Object.assign(tenant, action.payload.changes);
    },
    addTenant: {
      reducer: (state, action: PayloadAction<ITenant>) => {
        state.items.unshift(action.payload);
      },
      prepare: (input: TenantInput) => ({
        payload: {
          ...input,
          id: nanoid(),
          // Not collected by the add drawer yet; editable inline afterwards.
          tier: "Basic" as const,
          customerGroup: "Unassigned",
          status: "active" as const,
          users: 0,
          incidents: 0,
          createdAt: new Date().toISOString().slice(0, 10),
        },
      }),
    },
    deleteTenant: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  setSearch,
  clearDateRange,
  toggleStatus,
  updateTenant,
  addTenant,
  deleteTenant,
} = tenantsSlice.actions;
export default tenantsSlice.reducer;

// Selectors take a structural type (not RootState) to avoid a circular
// import between this slice and store/index.ts.
type WithTenants = { tenants: ITenantsState };

const DATE_RANGE_DAYS: Record<Exclude<DateRange, null>, number> = { "30d": 30 };
const DAY_MS = 86_400_000;

export const selectAllTenants = (state: WithTenants) => state.tenants.items;
export const selectSearch = (state: WithTenants) => state.tenants.search;
export const selectDateRange = (state: WithTenants) => state.tenants.dateRange;
export const selectActiveFilterCount = (state: WithTenants) =>
  state.tenants.dateRange ? 1 : 0;

export const selectCustomerGroups = createSelector(selectAllTenants, (items) =>
  [...new Set(items.map((t) => t.customerGroup))].sort((a, b) =>
    a.localeCompare(b),
  ),
);

export const selectTenantCounts = createSelector(selectAllTenants, (items) => {
  const active = items.filter((t) => t.status === "active").length;
  return { active, disabled: items.length - active };
});

export const selectVisibleTenants = createSelector(
  [selectAllTenants, selectSearch, selectDateRange],
  (items, search, dateRange) => {
    const query = search.trim().toLowerCase();
    const cutoff = dateRange
      ? new Date(Date.parse(MOCK_NOW) - DATE_RANGE_DAYS[dateRange] * DAY_MS)
          .toISOString()
          .slice(0, 10)
      : null;

    return items.filter((t) => {
      if (cutoff && t.createdAt < cutoff) return false;
      if (!query) return true;
      return [t.customer, t.login, t.customerGroup].some((field) =>
        field.toLowerCase().includes(query),
      );
    });
  },
);
