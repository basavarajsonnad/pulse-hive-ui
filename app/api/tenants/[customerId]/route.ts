import { NextResponse } from "next/server";
import { getSigninRegistration, HiveClientError } from "@/lib/hiveClient";
import { VALIDATION_FAILED, type ApiError } from "@/types/tenant";

function errorResponse(status: number, code: ApiError["code"], message: string) {
  const body: ApiError = { code, message };
  return NextResponse.json(body, { status });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ customerId: string }> },
) {
  const cookie = request.headers.get("cookie") ?? "";
  try {
    const { customerId } = await context.params;
    const signin = await getSigninRegistration(customerId, { cookie });
    return NextResponse.json(signin, { status: 200 });
  } catch (error) {
    if (error instanceof HiveClientError) {
      return errorResponse(error.status, error.code, error.message);
    }

    return errorResponse(400, VALIDATION_FAILED, "Unable to load registration output");
  }
}
