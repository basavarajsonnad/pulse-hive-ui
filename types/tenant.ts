export const VALIDATION_FAILED = "VALIDATION_FAILED";
export const JOB_NOT_FOUND = "JOB_NOT_FOUND";

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
  | "queued"
  | "running"
  | "completed"
  | "completed_with_errors"
  | "failed";

export type CreateTenantResponse = {
  jobId: string;
  customerName: string;
  status: ProvisioningStatus;
};

export type JobStatusResponse = {
  jobId: string;
  customerName: string;
  status: ProvisioningStatus;
};

export type CustomerListItem = {
  customerName: string;
  tenantName: string | null;
};

export type CustomerListResponse = {
  customers: CustomerListItem[];
};

export type ApiError = {
  code: typeof VALIDATION_FAILED | typeof JOB_NOT_FOUND;
  message: string;
};
