import { NextRequest, NextResponse } from "next/server";

const WRITESTACK_API_URL =
  process.env.WRITESTACK_API_URL || "https://writestack.com";
const ACADEMY_SECRET = process.env.WRITESTACK_ACADEMY_SECRET;

export async function POST(request: NextRequest) {
  if (!ACADEMY_SECRET) {
    return NextResponse.json(
      { error: "Academy secret not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const res = await fetch(
      `${WRITESTACK_API_URL}/api/v1/academy/remote/claim-promotion`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACADEMY_SECRET}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || "Claim failed" },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Claim-promotion proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
