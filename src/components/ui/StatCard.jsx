import React from "react";

export const StatCard = ({ label, value, sub, tone = "stone" }) => (
  <div className="bg-white border border-stone-200 rounded-lg p-4">
    <p className="font-body text-sm text-stone-500">{label}</p>
    <p
      className={`font-display font-semibold text-2xl mt-1 ${
        tone === "emerald"
          ? "text-emerald-800"
          : tone === "amber"
          ? "text-amber-600"
          : tone === "rose"
          ? "text-rose-600"
          : "text-stone-900"
      }`}
    >
      {value}
    </p>
    {sub && <p className="font-body text-xs text-stone-400 mt-1">{sub}</p>}
  </div>
);
