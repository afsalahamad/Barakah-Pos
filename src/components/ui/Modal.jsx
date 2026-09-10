import React from "react";
import { X } from "lucide-react";

export const Modal = ({ title, onClose, children, footer, wide }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4">
    <div
      className={`bg-white rounded-lg shadow-xl w-full ${wide ? "max-w-2xl" : "max-w-md"} flex flex-col`}
      style={{ maxHeight: "90vh" }}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
        <h3 className="font-display font-semibold text-lg text-stone-900">{title}</h3>
        <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
          <X size={20} />
        </button>
      </div>
      <div className="px-5 py-4 overflow-y-auto">{children}</div>
      {footer && <div className="px-5 py-4 border-t border-stone-200 flex justify-end gap-2">{footer}</div>}
    </div>
  </div>
);
