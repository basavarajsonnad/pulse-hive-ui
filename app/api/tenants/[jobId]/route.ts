import { NextResponse } from "next/server";
import { getJob, HiveClientError } from "@/lib/hiveClient";
import { VALIDATION_FAILED, type ApiError } from "@/types/tenant";

function errorResponse(status: number, code: ApiError["code"], message: string) {
  const body: ApiError = { code, message };
  return NextResponse.json(body, { status });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params;

  try {
    const job = await getJob(jobId);
    return NextResponse.json(job, { status: 200 });
  } catch (error) {
    if (error instanceof HiveClientError) {
      return errorResponse(error.status, error.code, error.message);
    }

    return errorResponse(400, VALIDATION_FAILED, "Unable to get tenant job");
  }
}
