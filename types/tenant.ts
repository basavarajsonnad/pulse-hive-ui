export const VALIDATION_FAILED = "VALIDATION_FAILED";

export type SsoConfig = {
  metadataUrl: string;
  providerName: string;
  emailAttribute: string;
  groupsAttribute: string;
};

export type CreateTenantRequest = {
  customerName: string;
  licensePackage: "basic" | "intermediate" | "advanced";
  sso: SsoConfig;
};

/** Hive job CHECK values. */
export type JobProvisioningStatus =
  | "queued"
  | "running"
  | "completed"
  | "completed_with_errors"
  | "failed";

/** Alias used by main-branch UI types. */
export type ProvisioningStatus = JobProvisioningStatus;

export type CustomerStatus = "in_progress" | "completed" | "failed";

export type CreateTenantResponse = {
  jobId: string;
  customerName: string;
  licensePackage: "basic" | "intermediate" | "advanced";
  status: JobProvisioningStatus;
};

export type CustomerListItem = {
  customerId: string;
  mspId: string;
  customerName: string;
  tenantName: string | null;
  licensePackage: "basic" | "intermediate" | "advanced";
  status: CustomerStatus;
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

export type SigninRegistrationResponse = {
  customerId: string;
  mspId: string;
  customerName: string;
  tenantName: string | null;
  licensePackage: "basic" | "intermediate" | "advanced";
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
  registrationOutput: string | null;
};

export type ApiError = {
  code: typeof VALIDATION_FAILED;
  message: string;
};
