import React from "react";
import { ShoppingCart, PauseCircle, Boxes, Wallet, User, LogOut } from "lucide-react";
import logoImg from "../../logo/Barakah-Pos-Logo.png";

export const CashierShell = ({
  children,
  cashierView,
  setCashierView,
  currentUser,
  heldBills,
  requestLogout,
}) => {
  const cashierNav = [
    { id: "billing", label: "Billing", icon: ShoppingCart },
    { id: "held-bills", label: "Held Bills", icon: PauseCircle },
    { id: "stock", label: "Stock", icon: Boxes },
    { id: "expenses", label: "Expenses", icon: Wallet },
    { id: "profile", label: "Profile", icon: User },
  ];
  const myHeldCount = heldBills.filter((b) => b.cashierId === currentUser?.id).length;

  return (
    <div className="min-h-screen bg-stone-50 font-body flex flex-col">
      <header className="h-16 bg-emerald-950 flex items-center justify-between px-4 sm:px-6 shrink-0">
        <div className="flex items-center gap-2.5">
          <img src={logoImg} alt="Logo" className="w-8 h-8 object-contain rounded-lg bg-white p-0.5" />
          <span className="font-display font-semibold text-white hidden sm:inline">Barakah POS</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
          {cashierNav.map((item) => {
            const Icon = item.icon;
            const active = cashierView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCashierView(item.id)}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-md text-sm whitespace-nowrap ${
                  active
                    ? "bg-amber-500 text-emerald-950 font-medium"
                    : "text-emerald-100/80 hover:bg-emerald-900"
                }`}
              >
                <Icon size={15} /> <span className="hidden sm:inline">{item.label}</span>
                {item.id === "held-bills" && myHeldCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                    style={{ fontSize: 10 }}
                  >
                    {myHeldCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-white text-sm font-medium">{currentUser?.name}</p>
            <p className="text-emerald-300/60 text-xs">{new Date().toLocaleDateString()}</p>
          </div>
          <button onClick={requestLogout} className="text-emerald-200 hover:text-white" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
    </div>
  );
};
