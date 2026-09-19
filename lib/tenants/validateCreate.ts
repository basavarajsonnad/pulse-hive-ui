import {
  CUSTOMER_NAME_PATTERN,
  VALIDATION_FAILED,
  type ApiError,
  type CreateTenantRequest,
  type SsoConfig,
} from "@/types/tenant";

const BODY_FIELDS = new Set(["customerName", "sso"]);
const SSO_FIELDS = new Set([
  "metadataUrl",
  "providerName",
  "emailAttribute",
  "groupsAttribute",
]);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function unknownField(
  record: Record<string, unknown>,
  allowed: Set<string>,
): string | null {
  for (const key of Object.keys(record)) {
    if (!allowed.has(key)) {
      return key;
    }
  }
  return null;
}

function readSso(value: unknown): SsoConfig | ApiError {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { code: VALIDATION_FAILED, message: "sso block is incomplete" };
  }

  const sso = value as Record<string, unknown>;
  const extra = unknownField(sso, SSO_FIELDS);
  if (extra) {
    return { code: VALIDATION_FAILED, message: `Unknown field: ${extra}` };
  }

  const fields: Array<keyof SsoConfig> = [
    "metadataUrl",
    "providerName",
    "emailAttribute",
    "groupsAttribute",
  ];

  for (const field of fields) {
    if (!isNonEmptyString(sso[field])) {
      return { code: VALIDATION_FAILED, message: "sso block is incomplete" };
    }
  }

  return {
    metadataUrl: (sso.metadataUrl as string).trim(),
    providerName: (sso.providerName as string).trim(),
    emailAttribute: (sso.emailAttribute as string).trim(),
    groupsAttribute: (sso.groupsAttribute as string).trim(),
  };
}

export function validateCreateTenant(
  body: unknown,
): CreateTenantRequest | ApiError {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { code: VALIDATION_FAILED, message: "Request body is not valid JSON" };
  }

  const record = body as Record<string, unknown>;
  const extra = unknownField(record, BODY_FIELDS);
  if (extra) {
    return { code: VALIDATION_FAILED, message: `Unknown field: ${extra}` };
  }

  if (!isNonEmptyString(record.customerName)) {
    return { code: VALIDATION_FAILED, message: "customerName is missing" };
  }

  const customerName = record.customerName.trim();
  if (!CUSTOMER_NAME_PATTERN.test(customerName)) {
    return {
      code: VALIDATION_FAILED,
      message: "customerName must be 3-25 letters, digits, or hyphens",
    };
  }

  const sso = readSso(record.sso);
  if ("code" in sso) {
    return sso;
  }

  return { customerName, sso };
}

export function isApiError(
  value: CreateTenantRequest | ApiError,
): value is ApiError {
  return "code" in value;
}
