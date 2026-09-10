import React from "react";
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
  Sparkles,
  Menu,
} from "lucide-react";

export const AdminShell = ({
  children,
  adminView,
  setAdminView,
  sidebarCollapsed,
  setSidebarCollapsed,
  currentUser,
  requestLogout,
}) => {
  const adminNav = [
    { section: "Overview", items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }] },
    {
      section: "Sales",
      items: [
        { id: "pos", label: "POS / Billing", icon: ShoppingCart },
        { id: "transactions", label: "Transactions", icon: Receipt },
        { id: "held-bills", label: "Held Bills", icon: PauseCircle },
      ],
    },
    {
      section: "Inventory",
      items: [
        { id: "products", label: "Products", icon: Package },
        { id: "stock", label: "Stock", icon: Boxes },
      ],
    },
    { section: "Management", items: [{ id: "users", label: "Users", icon: UsersIcon }] },
    { section: "Analytics", items: [{ id: "reports", label: "Reports", icon: BarChart3 }] },
    { section: "Configuration", items: [{ id: "settings", label: "Settings", icon: SettingsIcon }] },
    { section: "Account", items: [{ id: "profile", label: "Profile", icon: User }] },
  ];

  return (
    <div className="min-h-screen bg-stone-50 font-body flex">
      <aside
        className={`${
          sidebarCollapsed ? "" : "w-64"
        } bg-emerald-950 shrink-0 transition-all duration-200 flex flex-col`}
        style={sidebarCollapsed ? { width: 68 } : undefined}
      >
        <div className="h-16 flex items-center gap-2 px-4 border-b border-emerald-900">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
            <Sparkles className="text-emerald-950" size={16} />
          </div>
          {!sidebarCollapsed && <span className="font-display font-semibold text-white tracking-tight">Barakah POS</span>}
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {adminNav.map((sec) => (
            <div key={sec.section} className="mb-4">
              {!sidebarCollapsed && <p className="text-emerald-500/60 text-xs font-medium px-3 mb-1">{sec.section}</p>}
              {sec.items.map((item) => {
                const Icon = item.icon;
                const active = adminView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setAdminView(item.id)}
                    title={item.label}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md mb-0.5 text-sm transition ${
                      active ? "bg-amber-500 text-emerald-950 font-medium" : "text-emerald-100/80 hover:bg-emerald-900"
                    }`}
                  >
                    <Icon size={17} className="shrink-0" /> {!sidebarCollapsed && item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <button
          onClick={() => setSidebarCollapsed((s) => !s)}
          className="m-2 flex items-center justify-center gap-2 text-emerald-300/70 hover:text-white text-xs py-2 border-t border-emerald-900"
        >
          <Menu size={15} /> {!sidebarCollapsed && "Collapse"}
        </button>
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6 shrink-0">
          <p className="font-display font-semibold text-stone-800 capitalize">{adminView.replace("-", " ")}</p>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-stone-700">{currentUser?.name}</p>
              <p className="text-xs text-stone-400">Admin</p>
            </div>
            <button
              onClick={() => setAdminView("profile")}
              className="w-9 h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center font-medium"
            >
              {currentUser?.name?.[0]}
            </button>
            <button onClick={requestLogout} className="text-stone-400 hover:text-rose-600" title="Logout">
              <LogOut size={19} />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};
