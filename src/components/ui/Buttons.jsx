import React from "react";

export const PrimaryBtn = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center gap-2 rounded-md bg-emerald-800 text-white font-body font-medium px-4 py-2.5 hover:bg-emerald-900 active:bg-emerald-950 transition disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

export const GhostBtn = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center gap-2 rounded-md border border-stone-300 bg-white text-stone-700 font-body font-medium px-4 py-2.5 hover:bg-stone-50 transition disabled:opacity-40 ${className}`}
  >
    {children}
  </button>
);

export const DangerBtn = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center gap-2 rounded-md bg-rose-600 text-white font-body font-medium px-4 py-2.5 hover:bg-rose-700 transition disabled:opacity-40 ${className}`}
  >
    {children}
  </button>
);

export const GoldBtn = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center gap-2 rounded-md bg-amber-500 text-stone-900 font-body font-semibold px-4 py-2.5 hover:bg-amber-400 transition disabled:opacity-40 ${className}`}
  >
    {children}
  </button>
);
