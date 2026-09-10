import React from "react";
import { TONE, STATUS_TONE } from "../../utils/helpers";

export const Badge = ({ text, tone }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-medium font-body ${
      TONE[tone || STATUS_TONE[text] || "stone"]
    }`}
  >
    {text}
  </span>
);
