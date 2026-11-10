import { NextResponse } from "next/server";
import type {
  WaiverSubmission,
  WaiverSubmitResponse,
  WaiverSubmitSuccess,
} from "@/types/waiver";

function isAtLeast18(dateOfBirth: string): boolean {
  const dob = new Date(`${dateOfBirth}T00:00:00`);
  if (Number.isNaN(dob.getTime())) return false;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age >= 18;
}

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
    !body.dateOfBirth ||
    !body.phone ||
    !body.signatureDataUrl
  ) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 },
    );
  }

  if (!isAtLeast18(body.dateOfBirth)) {
    return NextResponse.json(
      { error: "You must be at least 18 years old to sign this agreement." },
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
    phone: body.phone,
    entityName: body.entityName,
    signedAt: body.signedAt,
    hasSignature: Boolean(body.signatureDataUrl),
  });

  return NextResponse.json({
    ok: true,
    message: "Waiver recorded (dev mode).",
    notificationEmailSent: false,
  } satisfies WaiverSubmitSuccess);
}
