import { NextResponse } from "next/server";
import type { WaiverSubmission, WaiverSubmitResponse } from "@/types/waiver";

export async function POST(request: Request) {
  let body: WaiverSubmission;

  try {
    body = (await request.json()) as WaiverSubmission;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (
    !body.firstName ||
    !body.lastName ||
    !body.email ||
    !body.dateOfBirth ||
    !body.phone ||
    !body.signatureDataUrl
  ) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 },
    );
  }

  const cloudFunctionUrl = process.env.WAIVER_CLOUD_FUNCTION_URL;

  if (cloudFunctionUrl) {
    const upstream = await fetch(cloudFunctionUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = (await upstream.json().catch(() => null)) as
      | WaiverSubmitResponse
      | { error?: string }
      | null;

    if (!upstream.ok) {
      const status =
        upstream.status >= 400 && upstream.status < 600
          ? upstream.status
          : 502;

      return NextResponse.json(
        data ?? { error: "Cloud function rejected the submission." },
        { status },
      );
    }

    return NextResponse.json(data ?? { ok: true });
  }

  console.info("[waiver] submission received", {
    name: `${body.firstName} ${body.lastName}`,
    email: body.email,
    signedAt: body.signedAt,
    hasSignature: Boolean(body.signatureDataUrl),
  });

  return NextResponse.json({
    ok: true,
    message: "Waiver recorded (dev mode).",
    notificationEmailSent: false,
  } satisfies WaiverSubmitSuccess);
}
