import React from "react";

export const Field = ({ label, required, children }) => (
  <label className="block mb-3">
    <span className="block text-sm font-body font-medium text-stone-600 mb-1">
      {label}
      {required && <span className="text-rose-500"> *</span>}
    </span>
    {children}
  </label>
);

export const inputCls =
  "w-full rounded-md border border-stone-300 px-3 py-2 font-body text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700";
