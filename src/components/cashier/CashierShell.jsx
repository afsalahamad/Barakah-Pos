import React from "react";
import { ShoppingCart, PauseCircle, Boxes, Wallet, User, LogOut } from "lucide-react";
import logoImg from "../../logo/Barakah-Pos-Logo.png";

export const CashierShell = ({
  children,
  cashierView,
  setCashierView,
  currentUser,
  heldBills = [],
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
    <div className="min-h-screen bg-stone-50 font-body flex flex-col pb-16 md:pb-0">
      {/* Top Header */}
      <header className="h-16 bg-emerald-950 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2.5">
          <img src={logoImg} alt="Logo" className="w-8 h-8 object-contain rounded-lg bg-white p-0.5" />
          <span className="font-display font-semibold text-white text-base sm:text-lg">Barakah POS</span>
        </div>

        {/* Desktop Header Nav */}
        <div className="hidden md:flex items-center gap-1.5">
          {cashierNav.map((item) => {
            const Icon = item.icon;
            const active = cashierView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCashierView(item.id)}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-md text-sm whitespace-nowrap transition ${
                  active
                    ? "bg-amber-500 text-emerald-950 font-medium"
                    : "text-emerald-100/80 hover:bg-emerald-900"
                }`}
              >
                <Icon size={16} /> <span>{item.label}</span>
                {item.id === "held-bills" && myHeldCount > 0 && (
                  <span
                    className="ml-1 bg-rose-500 text-white text-xs rounded-full px-1.5 py-0.2 font-bold"
                    style={{ fontSize: 10 }}
                  >
                    {myHeldCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-white text-sm font-medium">{currentUser?.name}</p>
            <p className="text-emerald-300/60 text-xs">Cashier</p>
          </div>
          <button
            onClick={() => setCashierView("profile")}
            className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-medium text-xs md:hidden"
          >
            {currentUser?.name?.[0]}
          </button>
          <button onClick={requestLogout} className="text-emerald-200 hover:text-white p-1" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-3 sm:p-6 overflow-y-auto">{children}</main>

      {/* Mobile Bottom Navigation Bar (< md) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-emerald-950 border-t border-emerald-900 flex items-center justify-around z-40 px-1">
        {cashierNav.map((item) => {
          const Icon = item.icon;
          const active = cashierView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCashierView(item.id)}
              className={`relative flex flex-col items-center justify-center w-full h-full py-1 text-xs transition ${
                active ? "text-amber-400 font-medium" : "text-emerald-200/70 hover:text-emerald-100"
              }`}
            >
              <Icon size={19} className="mb-0.5" />
              <span className="text-[11px] leading-tight">{item.label}</span>
              {item.id === "held-bills" && myHeldCount > 0 && (
                <span
                  className="absolute top-2 right-4 bg-rose-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold"
                >
                  {myHeldCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
