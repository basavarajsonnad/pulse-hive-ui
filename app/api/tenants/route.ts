import { NextResponse } from "next/server";
import { createTenant, HiveClientError, listTenants } from "@/lib/hiveClient";
import { VALIDATION_FAILED, type ApiError } from "@/types/tenant";

function errorResponse(status: number, code: ApiError["code"], message: string) {
  const body: ApiError = { code, message };
  return NextResponse.json(body, { status });
}

export async function GET(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  try {
    const search = new URL(request.url).search;
    const customers = await listTenants(search, { cookie });
    return NextResponse.json(customers, { status: 200 });
  } catch (error) {
    if (error instanceof HiveClientError) {
      return errorResponse(error.status, error.code, error.message);
    }

    return errorResponse(400, VALIDATION_FAILED, "Unable to list tenants");
  }
}

export async function POST(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const rawBody = await request.text();

  try {
    const created = await createTenant(rawBody, { cookie });
    return NextResponse.json(created, { status: 202 });
  } catch (error) {
    if (error instanceof HiveClientError) {
      return errorResponse(error.status, error.code, error.message);
    }

    return errorResponse(400, VALIDATION_FAILED, "Unable to create tenant");
  }
}
