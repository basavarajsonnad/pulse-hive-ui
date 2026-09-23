export const VALIDATION_FAILED = "VALIDATION_FAILED";

export type SsoConfig = {
  metadataUrl: string;
  providerName: string;
  emailAttribute: string;
  groupsAttribute: string;
};

export type CreateTenantRequest = {
  customerName: string;
  sso: SsoConfig;
};

/** Hive DB / V1 CHECK values. UI mapping from in_progress comes later. */
export type ProvisioningStatus =
  "queued" | "running" | "completed" | "completed_with_errors" | "failed";

export type CreateTenantResponse = {
  jobId: string;
  customerName: string;
  status: ProvisioningStatus;
};

export type CustomerListItem = {
  customerId: string;
  mspId: string;
  customerName: string;
  tenantName: string | null;
  licensePackage: string;
  status: ProvisioningStatus;
  createdAt: string;
  updatedAt: string;
};

export type CustomerListResponse = {
  customers: CustomerListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

/** GET /api/v1/tenants/{customerId} */
export type CustomerDetails = {
  customerId: string;
  mspId: string;
  customerName: string;
  tenantName: string | null;
  licensePackage: string;
  status: ProvisioningStatus;
  createdAt: string;
  updatedAt: string;
  /** MANUAL STEP instructions when SSO registration needs attention; null otherwise. */
  registrationOutput: string | null;
};

export type ApiError = {
  code: typeof VALIDATION_FAILED;
  message: string;
};
