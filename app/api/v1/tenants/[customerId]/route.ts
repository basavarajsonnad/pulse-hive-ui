import { NextResponse } from "next/server";
import { getTenantDetails, HiveClientError } from "@/lib/hiveClient";
import { VALIDATION_FAILED, type ApiError } from "@/types/tenant";

function errorResponse(
  status: number,
  code: ApiError["code"],
  message: string,
) {
  const body: ApiError = { code, message };
  return NextResponse.json(body, { status });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ customerId: string }> },
) {
  const { customerId } = await params;

  try {
    const details = await getTenantDetails(
      customerId,
      request.headers.get("cookie"),
    );
    return NextResponse.json(details, { status: 200 });
  } catch (error) {
    if (error instanceof HiveClientError) {
      return errorResponse(error.status, error.code, error.message);
    }

    return errorResponse(400, VALIDATION_FAILED, "Unable to load tenant");
  }
}
