import { NextResponse } from "next/server";
import { createTenant, HiveClientError } from "@/lib/hiveClient";
import { isApiError, validateCreateTenant } from "@/lib/tenants/validateCreate";
import { VALIDATION_FAILED, type ApiError } from "@/types/tenant";

function errorResponse(message: string) {
  const body: ApiError = { code: VALIDATION_FAILED, message };
  return NextResponse.json(body, { status: 400 });
}

export async function POST(request: Request) {
  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return errorResponse("Request body is not valid JSON");
  }

  const parsed = validateCreateTenant(rawBody);
  if (isApiError(parsed)) {
    return errorResponse(parsed.message);
  }

  try {
    const created = await createTenant(parsed);
    return NextResponse.json(created, { status: 202 });
  } catch (error) {
    const message =
      error instanceof HiveClientError ? error.message : "Unable to create tenant";
    return errorResponse(message);
  }
}
