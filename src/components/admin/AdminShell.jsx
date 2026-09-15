import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Receipt,
  PauseCircle,
  BarChart3,
  Users as UsersIcon,
  Settings as SettingsIcon,
  User,
  LogOut,
  Menu,
  X,
  FileCheck,
  Wallet,
} from "lucide-react";
import logoImg from "../../logo/Barakah-Pos-Logo.png";

export const AdminShell = ({
  children,
  adminView,
  setAdminView,
  sidebarCollapsed,
  setSidebarCollapsed,
  currentUser,
  requestLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adminNav = [
    { section: "Overview", items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }] },
    {
      section: "Sales & Finance",
      items: [
        { id: "pos", label: "POS / Billing", icon: ShoppingCart },
        { id: "transactions", label: "Transactions", icon: Receipt },
        { id: "held-bills", label: "Held Bills", icon: PauseCircle },
        { id: "expenses", label: "Expenses", icon: Wallet },
      ],
    },
    {
      section: "Inventory",
      items: [
        { id: "products", label: "Products", icon: Package },
        { id: "grn", label: "GRN (Receiving)", icon: FileCheck },
        { id: "stock", label: "Stock", icon: Boxes },
      ],
    },
    { section: "Management", items: [{ id: "users", label: "Users", icon: UsersIcon }] },
    { section: "Analytics", items: [{ id: "reports", label: "Reports", icon: BarChart3 }] },
    { section: "Configuration", items: [{ id: "settings", label: "Settings", icon: SettingsIcon }] },
    { section: "Account", items: [{ id: "profile", label: "Profile", icon: User }] },
  ];

  const handleNavClick = (viewId) => {
    setAdminView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-body flex relative overflow-x-hidden">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-stone-900/60 z-40 md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 bg-emerald-950 shrink-0 transition-transform duration-200 md:transition-all flex flex-col ${
          mobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"
        } ${!mobileMenuOpen && (sidebarCollapsed ? "md:w-[68px]" : "md:w-64")}`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-emerald-900">
          <div className="flex items-center gap-2.5">
            <img src={logoImg} alt="Logo" className="w-8 h-8 object-contain rounded-lg shrink-0 bg-white p-0.5" />
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <span className="font-display font-semibold text-white tracking-tight">Barakah POS</span>
            )}
          </div>
          {/* Close button inside mobile drawer */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-emerald-300 hover:text-white p-1 rounded-md"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {adminNav.map((sec) => (
            <div key={sec.section} className="mb-4">
              {(!sidebarCollapsed || mobileMenuOpen) && (
                <p className="text-emerald-500/60 text-xs font-medium px-3 mb-1">{sec.section}</p>
              )}
              {sec.items.map((item) => {
                const Icon = item.icon;
                const active = adminView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    title={item.label}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md mb-0.5 text-sm transition ${
                      active ? "bg-amber-500 text-emerald-950 font-medium" : "text-emerald-100/80 hover:bg-emerald-900"
                    }`}
                  >
                    <Icon size={17} className="shrink-0" />
                    {(!sidebarCollapsed || mobileMenuOpen) && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <button
          onClick={() => setSidebarCollapsed((s) => !s)}
          className="hidden md:flex m-2 items-center justify-center gap-2 text-emerald-300/70 hover:text-white text-xs py-2 border-t border-emerald-900"
        >
          <Menu size={15} /> {!sidebarCollapsed && "Collapse"}
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
              title="Open Navigation Menu"
            >
              <Menu size={22} />
            </button>
            <p className="font-display font-semibold text-stone-800 capitalize text-base sm:text-lg">
              {adminView.replace("-", " ")}
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-stone-700">{currentUser?.name}</p>
              <p className="text-xs text-stone-400">Admin</p>
            </div>
            <button
              onClick={() => handleNavClick("profile")}
              className="w-9 h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center font-medium"
            >
              {currentUser?.name?.[0]}
            </button>
            <button onClick={requestLogout} className="text-stone-400 hover:text-rose-600 p-1" title="Logout">
              <LogOut size={19} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};
