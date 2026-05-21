"use client";

import { useState } from "react";
import {
  WAIVER_INTRO,
  WAIVER_SECTIONS,
  WAIVER_TITLE,
} from "@/lib/waiver-text";

export function WaiverContent() {
  const [expanded, setExpanded] = useState(false);

  return (
    <article>
      <h2 className="text-lg font-semibold text-neutral-900">Waiver</h2>

      <div className="mt-4 text-sm leading-relaxed text-neutral-700">
        <p className="font-medium text-neutral-900">{WAIVER_TITLE}</p>
        <p className={`mt-4 ${expanded ? "" : "line-clamp-[5]"}`}>{WAIVER_INTRO}</p>

        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="space-y-4 pt-4">
              {WAIVER_SECTIONS.map((section) => (
                <section key={section.title}>
                  <h3 className="font-medium text-neutral-900">{section.title}</h3>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="mt-2">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="mt-4 text-sm font-medium text-neutral-900 underline-offset-2 hover:underline"
      >
        {expanded ? "Read less" : "Read more"}
      </button>
    </article>
  );
}
