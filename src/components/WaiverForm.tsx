"use client";

import { FormEvent, useEffect, useState } from "react";
import type { WaiverSubmission, WaiverSubmitResponse } from "@/types/waiver";
import { SignatureModal } from "./SignatureModal";

const inputClass =
  "mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900";

const labelClass = "block text-sm font-medium text-neutral-800";

const allowTestFail =
  process.env.NEXT_PUBLIC_ALLOW_TEST_FAIL === "true";

const RESET_DELAY_MS = 5000;

function SuccessMessage() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.reload();
    }, RESET_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="py-8 text-center">
      <p className="text-2xl font-semibold text-neutral-900">Success!</p>
      <p className="mt-3 text-base text-neutral-700">
        Your waiver has been submitted.
      </p>
      <p className="mt-2 text-sm text-neutral-500">
        A new form will load in a few seconds…
      </p>
    </div>
  );
}

export function WaiverForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);

  const submitPayload = async (
    formElement: HTMLFormElement,
    options?: { testFail?: boolean },
  ) => {
    const form = new FormData(formElement);
    const payload: WaiverSubmission = {
      firstName: String(form.get("firstName") ?? "").trim(),
      lastName: String(form.get("lastName") ?? "").trim(),
      dateOfBirth: String(form.get("dateOfBirth") ?? ""),
      phone: String(form.get("phone") ?? "").trim(),
      signatureDataUrl: signature!,
      accepted: true,
      signedAt: new Date().toISOString(),
      ...(options?.testFail ? { _testFail: true } : {}),
    };

    const endpoint =
      process.env.NEXT_PUBLIC_WAIVER_API_URL ?? "/api/submit";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => null)) as
      | WaiverSubmitResponse
      | null;

    if (!response.ok) {
      const err = data && "error" in data ? data : null;
      if (err?.notificationEmailSent) {
        throw new Error(
          "Sheet save failed, but your submission was emailed to the team.",
        );
      }
      throw new Error(
        err?.details ?? err?.error ?? "Unable to submit. Please try again.",
      );
    }

    if (data && "ok" in data && data.ok && !data.notificationEmailSent) {
      console.warn(
        "[waiver] saved but notification email was not sent (check SMTP on Cloud Function)",
      );
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!signature) {
      setErrorMessage("Please add your signature before submitting.");
      return;
    }

    const formElement = event.currentTarget;
    setStatus("submitting");

    try {
      await submitPayload(formElement);

      setStatus("success");
      setSignature(null);
      formElement.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  };

  const handleTestFail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!signature) {
      setErrorMessage("Please add your signature before testing.");
      return;
    }

    const formElement = event.currentTarget;
    setStatus("submitting");

    try {
      await submitPayload(formElement, { testFail: true });
      setStatus("error");
      setErrorMessage(
        "Test completed unexpectedly — sheet save succeeded. Is ALLOW_TEST_FAIL enabled on the Cloud Function? You should still receive a success notification email.",
      );
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  };

  if (status === "success") {
    return <SuccessMessage />;
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        id="waiver-form"
      >
        <h2 className="text-lg font-semibold text-neutral-900">Acknowledgement</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className={labelClass}>First name</span>
            <input
              className={inputClass}
              name="firstName"
              required
              autoComplete="given-name"
            />
          </label>
          <label>
            <span className={labelClass}>Last name</span>
            <input
              className={inputClass}
              name="lastName"
              required
              autoComplete="family-name"
            />
          </label>
          <label className="min-w-0">
            <span className={labelClass}>Date of birth</span>
            <input
              className={`${inputClass} block min-w-0`}
              type="date"
              name="dateOfBirth"
              required
            />
          </label>
          <label className="min-w-0">
            <span className={labelClass}>Phone number</span>
            <input
              className={inputClass}
              type="tel"
              name="phone"
              required
              autoComplete="tel"
            />
          </label>

          <div className="sm:col-span-2">
            <span className={labelClass}>Signature</span>
            <button
              type="button"
              onClick={() => setSignatureModalOpen(true)}
              className="mt-1 flex min-h-[88px] w-full flex-col items-center justify-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3 transition hover:border-neutral-400 hover:bg-neutral-100"
            >
              {signature ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={signature}
                    alt="Your signature"
                    className="max-h-16 w-full object-contain"
                  />
                  <span className="mt-2 text-xs text-neutral-500">
                    Tap to sign again
                  </span>
                </>
              ) : (
                <span className="text-sm text-neutral-600">Tap to sign</span>
              )}
            </button>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500">
              By signing above, I acknowledge that I have read and agree to The
              The Bluff Garage liability waiver and NDA.
            </p>
          </div>
        </div>

        {errorMessage ? (
          <p
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-md bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Submitting…" : "Submit"}
        </button>

        {allowTestFail ? (
          <button
            type="button"
            disabled={status === "submitting"}
            onClick={() => {
              const form = document.getElementById(
                "waiver-form",
              ) as HTMLFormElement | null;
              if (!form) return;
              void handleTestFail({
                preventDefault: () => {},
                currentTarget: form,
              } as FormEvent<HTMLFormElement>);
            }}
            className="w-full rounded-md border border-amber-300 bg-amber-50 px-6 py-3 text-sm font-medium text-amber-900 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting"
              ? "Testing…"
              : "Test failure notification (simulated sheet error)"}
          </button>
        ) : null}
      </form>

      <SignatureModal
        open={signatureModalOpen}
        onClose={() => setSignatureModalOpen(false)}
        onAccept={setSignature}
      />
    </>
  );
}
