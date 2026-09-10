import React from "react";

export const Th = ({ children }) => (
  <th className="text-left font-body font-medium text-xs uppercase tracking-wide text-stone-400 px-3 py-2 whitespace-nowrap">
    {children}
  </th>
);

export const Td = ({ children, className = "" }) => (
  <td className={`px-3 py-2.5 font-body text-sm text-stone-700 whitespace-nowrap ${className}`}>
    {children}
  </td>
);
