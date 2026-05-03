import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // TODO: Implement non-Malaysian savings account creation
  return NextResponse.json(
    { error: "Not implemented yet" },
    { status: 501 }
  );
}