import React from "react";

export const EmptyState = ({ title, subtitle, action }) => (
  <div className="text-center py-14 px-4">
    <p className="font-display font-semibold text-stone-700">{title}</p>
    {subtitle && <p className="font-body text-sm text-stone-400 mt-1">{subtitle}</p>}
    {action && <div className="mt-4 flex justify-center">{action}</div>}
  </div>
);
