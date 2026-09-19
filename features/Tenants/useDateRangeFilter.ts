import { useSearchParams } from "next/navigation";
import type { DateRange } from "./types";

const RANGE_PARAM = "range";
const ALL_TIME = "all";

// The date-range chip is shared by three layout components, so it lives in the
// URL (?range=all clears the default "Last 30 days").
export function useDateRangeFilter() {
  const searchParams = useSearchParams();
  const dateRange: DateRange =
    searchParams.get(RANGE_PARAM) === ALL_TIME ? null : "30d";

  const clearDateRange = () => {
    const params = new URLSearchParams(window.location.search);
    params.set(RANGE_PARAM, ALL_TIME);
    window.history.replaceState(null, "", `?${params.toString()}`);
  };

  return {
    dateRange,
    activeFilterCount: dateRange ? 1 : 0,
    clearDateRange,
  };
}
