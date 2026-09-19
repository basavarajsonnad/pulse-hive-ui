import { Button, Popconfirm, Tag, Tooltip, type TableColumnsType } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import EditableCell from "./EditableCell";
import type {
  ColumnFilters,
  DateRange,
  ITenant,
  ITenantColumnsParams,
} from "./types";
import styles from "./styles/TenantsTable.module.scss";

export const LOGIN_SUFFIX = ".portal26.ai";

const TIER_CLASS = {
  Basic: styles.tierBasic,
  Intermediate: styles.tierIntermediate,
  Advanced: styles.tierAdvanced,
} as const;

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
    return [t.customer, t.login, t.customerGroup].some((field) =>
      field.toLowerCase().includes(query),
    );
  });
}

export const getCustomerGroups = (tenants: ITenant[]) =>
  [...new Set(tenants.map((t) => t.customerGroup))].sort(compareText);

export function getTenantCounts(tenants: ITenant[]) {
  const active = tenants.filter((t) => t.status === "active").length;
  return { active, disabled: tenants.length - active };
}

const INCIDENT_BUCKETS: Record<string, (n: number) => boolean> = {
  none: (n) => n === 0,
  low: (n) => n >= 1 && n <= 3,
  high: (n) => n >= 4,
};

export const STATUS_FILTER_OPTIONS = [
  { text: "Active", value: "active" },
  { text: "Disabled", value: "disabled" },
];

export const INCIDENT_FILTER_OPTIONS = [
  { text: "No incidents", value: "none" },
  { text: "1–3", value: "low" },
  { text: "4 or more", value: "high" },
];

const CREATED_BUCKETS: Record<string, (daysAgo: number) => boolean> = {
  "7d": (d) => d <= 7,
  "14d": (d) => d <= 14,
  older: (d) => d > 14,
};

export const CREATED_FILTER_OPTIONS = [
  { text: "Last 7 days", value: "7d" },
  { text: "Last 14 days", value: "14d" },
  { text: "Older than 14 days", value: "older" },
];

const selected = (filters: ColumnFilters, key: string) =>
  filters[key]?.map(String) ?? [];

export function matchesColumnFilters(tenant: ITenant, filters: ColumnFilters) {
  const status = selected(filters, "status");
  if (status.length && !status.includes(tenant.status)) return false;

  const groups = selected(filters, "customerGroup");
  if (groups.length && !groups.includes(tenant.customerGroup)) return false;

  const incidents = selected(filters, "incidents");
  if (
    incidents.length &&
    !incidents.some((bucket) => INCIDENT_BUCKETS[bucket]?.(tenant.incidents))
  ) {
    return false;
  }

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
    "Customer",
    "Tier",
    "Tenant / Login",
    "Customer Group",
    "Status",
    "Users",
    "Incidents",
    "Created",
  ];
  const rows = tenants.map((t) => [
    t.customer,
    t.tier,
    t.login,
    t.customerGroup,
    t.status,
    t.users,
    t.incidents,
    t.createdAt,
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");

  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function getTenantColumns({
  columnFilters,
  customerGroups,
  onEdit,
  onUpdate,
  onDelete,
  onToggleStatus,
}: ITenantColumnsParams): TableColumnsType<ITenant> {
  return [
    {
      key: "customer",
      title: "Customer",
      sorter: (a, b) => compareText(a.customer, b.customer),
      render: (_, tenant) => (
        <EditableCell
          value={tenant.customer}
          label="customer name"
          onSave={(customer) => onUpdate(tenant.id, { customer })}
        >
          <span className={styles.customerName}>{tenant.customer}</span>
          <Tag
            className={`${styles.tier} ${TIER_CLASS[tenant.tier]}`}
            variant="filled"
          >
            {tenant.tier}
          </Tag>
        </EditableCell>
      ),
    },
    {
      key: "login",
      title: "Tenant / Login",
      sorter: (a, b) => compareText(a.login, b.login),
      render: (_, tenant) => (
        <EditableCell
          value={tenant.login}
          label="tenant login"
          onSave={(login) => onUpdate(tenant.id, { login })}
        >
          <a
            className={styles.login}
            href={`https://${tenant.login}`}
            target="_blank"
            rel="noreferrer"
          >
            {tenant.login} <span aria-hidden>↗</span>
          </a>
        </EditableCell>
      ),
    },
    {
      key: "customerGroup",
      title: "Customer Group",
      sorter: (a, b) => compareText(a.customerGroup, b.customerGroup),
      filters: customerGroups.map((group) => ({ text: group, value: group })),
      filteredValue: columnFilters.customerGroup ?? null,
      render: (_, tenant) => (
        <EditableCell
          value={tenant.customerGroup}
          label="customer group"
          options={customerGroups}
          onSave={(customerGroup) => onUpdate(tenant.id, { customerGroup })}
        >
          {tenant.customerGroup}
        </EditableCell>
      ),
    },
    {
      key: "status",
      title: "Status",
      filters: STATUS_FILTER_OPTIONS,
      filteredValue: columnFilters.status ?? null,
      render: (_, tenant) => (
        <Tooltip title="Click to toggle">
          <button
            type="button"
            className={`${styles.status} ${
              tenant.status === "active"
                ? styles.statusActive
                : styles.statusDisabled
            }`}
            onClick={() => onToggleStatus(tenant.id)}
          >
            {tenant.status === "active" ? "Active" : "Disabled"}
          </button>
        </Tooltip>
      ),
    },
    {
      key: "users",
      title: "Users",
      align: "right",
      sorter: (a, b) => a.users - b.users,
      render: (_, tenant) => tenant.users,
    },
    {
      key: "incidents",
      title: "Incidents",
      align: "right",
      filters: INCIDENT_FILTER_OPTIONS,
      filteredValue: columnFilters.incidents ?? null,
      render: (_, tenant) => tenant.incidents,
    },
    {
      key: "createdAt",
      title: "Created",
      sorter: (a, b) => compareText(a.createdAt, b.createdAt),
      filters: CREATED_FILTER_OPTIONS,
      filteredValue: columnFilters.createdAt ?? null,
      render: (_, tenant) => (
        <span className={styles.muted}>{formatDate(tenant.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      align: "right",
      render: (_, tenant) => (
        <span className={styles.actions}>
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              aria-label={`Edit ${tenant.customer}`}
              onClick={() => onEdit(tenant)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this customer?"
            description={tenant.customer}
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(tenant.id)}
          >
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              aria-label={`Delete ${tenant.customer}`}
            />
          </Popconfirm>
        </span>
      ),
    },
  ];
}
