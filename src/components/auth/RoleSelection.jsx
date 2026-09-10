import React from "react";
import { LayoutDashboard, ShoppingCart, ChevronRight } from "lucide-react";

export const RoleSelection = ({ onSelectRole }) => (
  <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6 font-body">
    <h2 className="font-display text-2xl font-semibold text-stone-900 mb-1">How would you like to continue?</h2>
    <p className="text-stone-500 text-sm mb-8">Choose the portal that matches your role.</p>
    <div className="grid sm:grid-cols-2 gap-5 w-full max-w-2xl">
      <button
        onClick={() => onSelectRole("login-admin")}
        className="text-left bg-white border border-stone-200 rounded-xl p-6 hover:border-emerald-700 hover:shadow-md transition group"
      >
        <div className="w-11 h-11 rounded-lg bg-emerald-800 flex items-center justify-center mb-4">
          <LayoutDashboard className="text-white" size={20} />
        </div>
        <p className="font-display font-semibold text-lg text-stone-900">Admin</p>
        <p className="text-stone-500 text-sm mt-1.5">Manage products, stock, users, transactions, reports and business settings.</p>
        <p className="mt-4 text-emerald-800 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
          Continue as Admin <ChevronRight size={15} />
        </p>
      </button>
      <button
        onClick={() => onSelectRole("login-cashier")}
        className="text-left bg-white border border-stone-200 rounded-xl p-6 hover:border-amber-500 hover:shadow-md transition group"
      >
        <div className="w-11 h-11 rounded-lg bg-amber-500 flex items-center justify-center mb-4">
          <ShoppingCart className="text-emerald-950" size={20} />
        </div>
        <p className="font-display font-semibold text-lg text-stone-900">Cashier</p>
        <p className="text-stone-500 text-sm mt-1.5">Create bills, process sales, hold bills and view stock.</p>
        <p className="mt-4 text-amber-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
          Continue as Cashier <ChevronRight size={15} />
        </p>
      </button>
    </div>
  </div>
);
