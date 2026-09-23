import { Tag, type TableColumnsType } from "antd";
import { TENANT_TIER_OPTIONS } from "./types";
import type {
  ColumnFilters,
  DateRange,
  ITenant,
  ITenantProps,
  TenantStatus,
} from "./types";
import translator from "@/i18n/translator";
import styles from "./styles/TenantsTable.module.scss";

const LOGIN_SUFFIX = ".portal26.ai";

const toTenantLogin = (customer: string) =>
  `${customer
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}${LOGIN_SUFFIX}`;

export const getTenantLogin = (tenant: ITenant) =>
  tenant.tenantName ?? toTenantLogin(tenant.customerName);

const TIER_CLASS: Record<string, string> = {
  basic: styles.tierBasic,
  intermediate: styles.tierIntermediate,
  advanced: styles.tierAdvanced,
};

const DAY_MS = 86_400_000;

const compareText = (a: string, b: string) => a.localeCompare(b);

export const EMPTY_TENANTS: ITenant[] = [];

const DATE_RANGE_DAYS = { "30d": 30 } as const;

export function filterTenants(
  tenants: ITenant[],
  search: string,
  dateRange: DateRange,
) {
  const query = search.trim().toLowerCase();
  const cutoff = dateRange
    ? new Date(Date.now() - DATE_RANGE_DAYS[dateRange] * DAY_MS)
        .toISOString()
        .slice(0, 10)
    : null;

  return tenants.filter((t) => {
    if (cutoff && t.createdAt < cutoff) return false;
    if (!query) return true;
    return [t.customerName, getTenantLogin(t)].some((field) =>
      field.toLowerCase().includes(query),
    );
  });
}

export function getTenantCounts(tenants: ITenant[]) {
  const count = (status: TenantStatus) =>
    tenants.filter((t) => t.status === status).length;
  return {
    active: count("active"),
    running: count("in_progress"),
    failed: count("failed"),
  };
}

export const STATUS_FILTER_OPTIONS = [
  { text: translator("tenants.status.inProgress"), value: "in_progress" },
  { text: translator("tenants.status.active"), value: "active" },
  { text: translator("tenants.status.failed"), value: "failed" },
];

const STATUS_LABELS: Record<TenantStatus, string> = {
  in_progress: translator("tenants.status.inProgress"),
  active: translator("tenants.status.active"),
  failed: translator("tenants.status.failed"),
};

const STATUS_CLASS: Record<TenantStatus, string> = {
  in_progress: styles.statusInProgress,
  active: styles.statusActive,
  failed: styles.statusFailed,
};

export const TIER_FILTER_OPTIONS = TENANT_TIER_OPTIONS.map(
  ({ value, label }) => ({ value, text: label }),
);

const CREATED_BUCKETS: Record<string, (daysAgo: number) => boolean> = {
  "7d": (d) => d <= 7,
  "14d": (d) => d <= 14,
  older: (d) => d > 14,
};

export const CREATED_FILTER_OPTIONS = [
  { text: translator("common.dateRanges.last7Days"), value: "7d" },
  { text: translator("common.dateRanges.last14Days"), value: "14d" },
  { text: translator("common.dateRanges.olderThan14Days"), value: "older" },
];

const selected = (filters: ColumnFilters, key: string) =>
  filters[key]?.map(String) ?? [];

export function matchesColumnFilters(tenant: ITenant, filters: ColumnFilters) {
  const status = selected(filters, "status");
  if (status.length && !status.includes(tenant.status)) return false;

  const tiers = selected(filters, "tier");
  if (tiers.length && !tiers.includes(tenant.liscencePackage)) return false;

  const created = selected(filters, "createdAt");
  if (created.length) {
    const daysAgo = (Date.now() - Date.parse(tenant.createdAt)) / DAY_MS;
    if (!created.some((bucket) => CREATED_BUCKETS[bucket]?.(daysAgo))) {
      return false;
    }
  }

  return true;
}

// Fixed locale + UTC so server and client render the same string.
const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export const formatDate = (iso: string) => dateFormat.format(new Date(iso));

const csvCell = (value: string | number) =>
  `"${String(value).replace(/"/g, '""')}"`;

export function downloadTenantsCsv(tenants: ITenant[], filename: string) {
  const header = [
    translator("tenants.csv.customer"),
    translator("tenants.csv.licensePackage"),
    translator("tenants.csv.login"),
    translator("tenants.csv.status"),
    translator("tenants.csv.createdAt"),
  ];
  const rows = tenants.map((t) => [
    t.customerName,
    t.liscencePackage,
    getTenantLogin(t),
    t.status,
    t.createdAt,
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\n");

  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export const TierTag = ({ tenant }: ITenantProps) => (
  <Tag
    className={`${styles.tier} ${TIER_CLASS[tenant.liscencePackage]}`}
    variant="filled"
  >
    {tenant.liscencePackage}
  </Tag>
);

export const StatusPill = ({ tenant }: ITenantProps) => (
  <span className={`${styles.status} ${STATUS_CLASS[tenant.status]}`}>
    {STATUS_LABELS[tenant.status]}
  </span>
);

export const TenantLogin = ({ tenant }: ITenantProps) => {
  const login = getTenantLogin(tenant);

  return tenant.status === "failed" ? (
    <span className={styles.loginDisabled} aria-disabled="true">
      {login} <span aria-hidden>↗</span>
    </span>
  ) : (
    <a
      className={styles.login}
      href={`https://${login}`}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
    >
      {login} <span aria-hidden>↗</span>
    </a>
  );
};

export function getTenantColumns(
  columnFilters: ColumnFilters,
): TableColumnsType<ITenant> {
  return [
    {
      key: "customer",
      title: translator("tenants.columns.customer"),
      sorter: (a, b) => compareText(a.customerName, b.customerName),
      render: (_, tenant) => (
        <span className={styles.customerName}>{tenant.customerName}</span>
      ),
    },
    {
      key: "login",
      title: translator("tenants.columns.login"),
      sorter: (a, b) => compareText(getTenantLogin(a), getTenantLogin(b)),
      render: (_, tenant) => <TenantLogin tenant={tenant} />,
    },
    {
      key: "tier",
      title: translator("tenants.columns.tier"),
      filters: TIER_FILTER_OPTIONS,
      filteredValue: columnFilters.tier ?? null,
      render: (_, tenant) => <TierTag tenant={tenant} />,
    },
    {
      key: "status",
      title: translator("tenants.columns.status"),
      filters: STATUS_FILTER_OPTIONS,
      filteredValue: columnFilters.status ?? null,
      render: (_, tenant) => <StatusPill tenant={tenant} />,
    },
    {
      key: "createdAt",
      title: translator("tenants.columns.createdAt"),
      sorter: (a, b) => compareText(a.createdAt, b.createdAt),
      filters: CREATED_FILTER_OPTIONS,
      filteredValue: columnFilters.createdAt ?? null,
      render: (_, tenant) => (
        <span className={styles.muted}>{formatDate(tenant.createdAt)}</span>
      ),
    },
  ];
}
