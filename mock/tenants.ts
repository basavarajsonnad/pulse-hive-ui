import type { IMockIndustry, ITenant, TenantTier } from "@/components/tenants/types";

// Mock data for the Tenants table. Deterministic (seeded) so the list is
// identical on every load. Replace with an API call when the backend exists.

/** "Today" for the mock data set — the "Last N days" filters are relative to it. */
export const MOCK_NOW = "2026-07-16";

export const CUSTOMER_GROUPS = [
  "Texas – DFW",
  "Pacific Northwest",
  "New York Metro",
  "Midwest – Chicago",
  "Southeast – Atlanta",
] as const;

const DAY_MS = 86_400_000;
const NOW_MS = Date.parse(MOCK_NOW);

const ORGS = [
  "Beacon Hill", "Birchwood", "Bluewater", "Brookside", "Cedar Ridge",
  "Clearwater", "Copperfield", "Crestview", "Eastgate", "Elmwood",
  "Fairview", "Foxhall", "Glenmoor", "Granite Peak", "Harborview",
  "Highland", "Ironwood", "Juniper", "Kingsbridge", "Lakeshore",
  "Maplewood", "Meridian", "Northgate", "Oakmont", "Pinecrest",
  "Redstone", "Silverline", "Summit Ridge", "Westbrook", "Willowbrook",
];

const INDUSTRIES: IMockIndustry[] = [
  { name: "Accounting", slug: "accounting", tier: "Intermediate", group: "Texas – DFW", users: 117, incidents: 6, daysAgo: 3 },
  { name: "Auto Group", slug: "auto", tier: "Intermediate", group: "Pacific Northwest", users: 191, incidents: 4, daysAgo: 8 },
  { name: "Credit Union", slug: "credit", tier: "Basic", group: "New York Metro", users: 247, incidents: 6, daysAgo: 4 },
  { name: "Dental Group", slug: "dental", tier: "Intermediate", group: "Texas – DFW", users: 239, incidents: 0, daysAgo: 3 },
  { name: "Engineering", slug: "engineering", tier: "Basic", group: "New York Metro", users: 97, incidents: 7, daysAgo: 1 },
  { name: "Food Services", slug: "food", tier: "Basic", group: "New York Metro", users: 241, incidents: 4, daysAgo: 4 },
  { name: "Insurance Services", slug: "insurance", tier: "Intermediate", group: "Texas – DFW", users: 143, incidents: 2, daysAgo: 9 },
  { name: "Law Partners", slug: "law", tier: "Intermediate", group: "Pacific Northwest", users: 171, incidents: 6, daysAgo: 2 },
  { name: "Logistics", slug: "logistics", tier: "Advanced", group: "Texas – DFW", users: 109, incidents: 2, daysAgo: 6 },
  { name: "Manufacturing", slug: "manufacturing", tier: "Basic", group: "New York Metro", users: 317, incidents: 0, daysAgo: 7 },
];

const TIERS: TenantTier[] = ["Basic", "Intermediate", "Advanced"];

const DISABLED_INDEXES = new Set([23, 87, 142, 251]);

function createRandom(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = createRandom(26);
const pick = <T,>(items: readonly T[]): T =>
  items[Math.floor(random() * items.length)];
const between = (min: number, max: number) =>
  min + Math.floor(random() * (max - min + 1));
const isoDaysAgo = (days: number) =>
  new Date(NOW_MS - days * DAY_MS).toISOString().slice(0, 10);

export const TENANTS_MOCK: ITenant[] = ORGS.flatMap((org, orgIndex) =>
  INDUSTRIES.map((industry, industryIndex): ITenant => {
    const index = orgIndex * INDUSTRIES.length + industryIndex;
    const fixed = orgIndex === 0;
    const orgSlug = org.toLowerCase().replace(/\s+/g, "-");

    return {
      id: `tnt-${String(index + 1).padStart(3, "0")}`,
      customer: `${org} ${industry.name}`,
      tier: fixed ? industry.tier : pick(TIERS),
      login: `${orgSlug}-${industry.slug}.portal26.ai`,
      customerGroup: fixed ? industry.group : pick(CUSTOMER_GROUPS),
      status: DISABLED_INDEXES.has(index) ? "disabled" : "active",
      users: fixed ? industry.users : between(40, 480),
      incidents: fixed ? industry.incidents : between(0, 9),
      createdAt: isoDaysAgo(fixed ? industry.daysAgo : between(0, 29)),
    };
  }),
);
