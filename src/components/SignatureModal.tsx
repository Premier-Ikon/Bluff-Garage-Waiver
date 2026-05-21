"use client";

import { useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

type SignatureModalProps = {
  open: boolean;
  onClose: () => void;
  onAccept: (dataUrl: string) => void;
};

export function SignatureModal({ open, onClose, onAccept }: SignatureModalProps) {
  const padRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      padRef.current?.clear();
    }
  }, [open]);

  if (!open) return null;

  const handleAccept = () => {
    const pad = padRef.current;
    if (!pad || pad.isEmpty()) return;
    onAccept(pad.toDataURL("image/png"));
    onClose();
  };

  const handleClear = () => {
    padRef.current?.clear();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signature-modal-title"
    >
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2
          id="signature-modal-title"
          className="text-lg font-semibold text-neutral-900"
        >
          Sign to accept waiver
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Use your finger or stylus to sign below.
        </p>

        <div className="mt-4 overflow-hidden rounded-lg border border-neutral-300 bg-white touch-none">
          <SignatureCanvas
            ref={padRef}
            canvasProps={{
              className: "h-48 w-full touch-none sm:h-56",
            }}
            penColor="#171717"
            minWidth={1.5}
            maxWidth={3}
          />
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Accept signature
          </button>
        </div>
      </div>
    </div>
  );
}
