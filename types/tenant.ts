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

export type CreateTenantResponse = {
  jobId: string;
  customerName: string;
  status: string;
};

export type ProvisioningJobStatus = "in_progress" | "complete" | "failed";

export type ProvisioningStep = {
  name: string;
  status: string;
  startedAt: string | null;
  endedAt: string | null;
  detail: string | null;
};

export type ProvisioningJobResponse = {
  jobId: string;
  customerName: string;
  tenantName: string | null;
  status: string;
  startedAt: string;
  updatedAt: string;
  steps: ProvisioningStep[];
};

export type ApiError = {
  code: typeof VALIDATION_FAILED | typeof JOB_NOT_FOUND;
  message: string;
};
