export const CUSTOMER_NAME_PATTERN = /^[a-zA-Z0-9-]{3,25}$/;
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

export type CreateTenantResponse = {
  jobId: string;
  customerName: string;
  status: string;
};

export type ApiError = {
  code: typeof VALIDATION_FAILED;
  message: string;
};
