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

export type JobStatus = "in_progress" | "success" | "failure";

export type JobStatusResponse = {
  jobId: string;
  customerName: string;
  status: JobStatus;
};

export type JobListItem = {
  jobId: string;
  customerName: string;
  status: JobStatus;
  createdAt: string;
};

export type JobListResponse = {
  jobs: JobListItem[];
};

export type ApiError = {
  code: typeof VALIDATION_FAILED | typeof JOB_NOT_FOUND;
  message: string;
};
