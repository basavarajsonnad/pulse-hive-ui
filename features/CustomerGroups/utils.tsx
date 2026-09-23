import { Tag, type TableColumnsType } from "antd";
import type { ICustomerGroup } from "./types";
import translator from "@/i18n/translator";
import styles from "./styles/CustomerGroupsTable.module.scss";

const compareText = (a: string, b: string) => a.localeCompare(b);
const compareNumber = (a: number, b: number) => a - b;

export const CUSTOMER_GROUPS_MOCK: ICustomerGroup[] = [
  {
    customerGroup: "Texas – DFW",
    ownerEmail: "owner.dfw@acmemsp.com",
    customers: 20,
    licenseMix: { basic: 8, intermediate: 9, advanced: 3 },
    users: 3419,
    incidents: 57,
  },
  {
    customerGroup: "Texas – Austin & San Antonio",
    ownerEmail: "owner.atx@acmemsp.com",
    customers: 20,
    licenseMix: { basic: 11, intermediate: 5, advanced: 4 },
    users: 3562,
    incidents: 48,
  },
  {
    customerGroup: "California – North",
    ownerEmail: "owner.norcal@acmemsp.com",
    customers: 20,
    licenseMix: { basic: 10, intermediate: 4, advanced: 6 },
    users: 3936,
    incidents: 57,
  },
  {
    customerGroup: "California – South",
    ownerEmail: "owner.socal@acmemsp.com",
    customers: 20,
    licenseMix: { basic: 7, intermediate: 8, advanced: 5 },
    users: 4365,
    incidents: 30,
  },
  {
    customerGroup: "Florida",
    ownerEmail: "owner.fl@acmemsp.com",
    customers: 20,
    licenseMix: { basic: 10, intermediate: 6, advanced: 4 },
    users: 4186,
    incidents: 52,
  },
  {
    customerGroup: "New York Metro",
    ownerEmail: "owner.nym@acmemsp.com",
    customers: 20,
    licenseMix: { basic: 11, intermediate: 7, advanced: 2 },
    users: 3406,
    incidents: 50,
  },
  {
    customerGroup: "New England",
    ownerEmail: "owner.ne@acmemsp.com",
    customers: 20,
    licenseMix: { basic: 9, intermediate: 10, advanced: 1 },
    users: 3766,
    incidents: 36,
  },
  {
    customerGroup: "Georgia",
    ownerEmail: "owner.ga@acmemsp.com",
    customers: 20,
    licenseMix: { basic: 8, intermediate: 7, advanced: 5 },
    users: 4198,
    incidents: 43,
  },
  {
    customerGroup: "Illinois",
    ownerEmail: "owner.il@acmemsp.com",
    customers: 20,
    licenseMix: { basic: 17, intermediate: 2, advanced: 1 },
    users: 4035,
    incidents: 46,
  },
  {
    customerGroup: "Ohio Valley",
    ownerEmail: "owner.oh@acmemsp.com",
    customers: 20,
    licenseMix: { basic: 7, intermediate: 11, advanced: 2 },
    users: 4453,
    incidents: 73,
  },
  {
    customerGroup: "Pacific Northwest",
    ownerEmail: "owner.pnw@acmemsp.com",
    customers: 20,
    licenseMix: { basic: 6, intermediate: 10, advanced: 4 },
    users: 3333,
    incidents: 56,
  },
  {
    customerGroup: "Arizona & Nevada",
    ownerEmail: "owner.az@acmemsp.com",
    customers: 20,
    licenseMix: { basic: 13, intermediate: 2, advanced: 5 },
    users: 3715,
    incidents: 45,
  },
  {
    customerGroup: "Colorado & Utah",
    ownerEmail: "owner.co@acmemsp.com",
    customers: 20,
    licenseMix: { basic: 9, intermediate: 7, advanced: 4 },
    users: 3950,
    incidents: 55,
  },
  {
    customerGroup: "Carolinas",
    ownerEmail: "owner.car@acmemsp.com",
    customers: 20,
    licenseMix: { basic: 9, intermediate: 8, advanced: 3 },
    users: 3432,
    incidents: 47,
  },
  {
    customerGroup: "Mid-Atlantic",
    ownerEmail: "owner.matl@acmemsp.com",
    customers: 20,
    licenseMix: { basic: 11, intermediate: 5, advanced: 4 },
    users: 4400,
    incidents: 59,
  },
];

export function filterCustomerGroups(
  customerGroups: ICustomerGroup[],
  search: string,
) {
  const query = search.trim().toLowerCase();
  if (!query) return customerGroups;

  return customerGroups.filter((g) =>
    g.customerGroup.toLowerCase().includes(query),
  );
}

const csvCell = (value: string | number) =>
  `"${String(value).replace(/"/g, '""')}"`;

export function downloadCustomerGroupsCsv(
  customerGroups: ICustomerGroup[],
  filename: string,
) {
  const header = [
    translator("customerGroups.csv.customerGroup"),
    translator("customerGroups.csv.customers"),
    translator("customerGroups.csv.basic"),
    translator("customerGroups.csv.intermediate"),
    translator("customerGroups.csv.advanced"),
  ];
  const rows = customerGroups.map((g) => [
    g.customerGroup,
    g.customers,
    g.licenseMix.basic,
    g.licenseMix.intermediate,
    g.licenseMix.advanced,
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

export const LicenseMixTags = ({
  licenseMix,
}: {
  licenseMix: ICustomerGroup["licenseMix"];
}) => (
  <span className={styles.licenseMix}>
    <Tag className={`${styles.tier} ${styles.tierBasic}`} variant="filled">
      {licenseMix.basic}B
    </Tag>
    <Tag
      className={`${styles.tier} ${styles.tierIntermediate}`}
      variant="filled"
    >
      {licenseMix.intermediate}I
    </Tag>
    <Tag className={`${styles.tier} ${styles.tierAdvanced}`} variant="filled">
      {licenseMix.advanced}A
    </Tag>
  </span>
);

export function getCustomerGroupColumns(): TableColumnsType<ICustomerGroup> {
  return [
    {
      key: "customerGroup",
      title: translator("customerGroups.columns.customerGroup"),
      sorter: (a, b) => compareText(a.customerGroup, b.customerGroup),
      render: (_, group) => (
        <span className={styles.groupName}>{group.customerGroup}</span>
      ),
    },
    {
      key: "customers",
      title: translator("customerGroups.columns.customers"),
      sorter: (a, b) => compareNumber(a.customers, b.customers),
    },
    {
      key: "licenseMix",
      title: translator("customerGroups.columns.licenseMix"),
      render: (_, group) => <LicenseMixTags licenseMix={group.licenseMix} />,
    },
  ];
}
