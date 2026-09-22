import { NextResponse } from "next/server";
import { getSigninRegistration, HiveClientError } from "@/lib/hiveClient";
import { VALIDATION_FAILED, type ApiError } from "@/types/tenant";

function errorResponse(status: number, code: ApiError["code"], message: string) {
  const body: ApiError = { code, message };
  return NextResponse.json(body, { status });
}

export async function GET(request: Request) {
  try {
    const customerName = new URL(request.url).searchParams.get("customerName") ?? "";
    const signin = await getSigninRegistration(customerName);
    return NextResponse.json(signin, { status: 200 });
  } catch (error) {
    if (error instanceof HiveClientError) {
      return errorResponse(error.status, error.code, error.message);
    }

    return errorResponse(400, VALIDATION_FAILED, "Unable to load registration output");
  }
}
