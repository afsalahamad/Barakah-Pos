import React from "react";
import { Plus, Boxes, Receipt, BarChart3, Users as UsersIcon } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { StatCard } from "../ui/StatCard";
import { Badge } from "../ui/Badge";
import { Th, Td } from "../ui/TableElements";
import { GhostBtn } from "../ui/Buttons";
import { money, fmtDate, fmtTime, stockStatus } from "../../utils/helpers";

export const Dashboard = ({
  todayRevenue,
  todaysTxns,
  todayItemsSold,
  lowStockProducts,
  last7,
  transactions,
  bestSellers,
  setAdminView,
  setModal,
  openProductForm,
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Today's revenue" value={money(todayRevenue)} tone="emerald" />
      <StatCard label="Today's transactions" value={todaysTxns.length} />
      <StatCard label="Items sold today" value={todayItemsSold} />
      <StatCard
        label="Low stock items"
        value={lowStockProducts.length}
        tone={lowStockProducts.length ? "rose" : "stone"}
      />
    </div>

    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 bg-white border border-stone-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-display font-semibold text-stone-800">Sales, last 7 days</p>
        </div>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={last7}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#78716c" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#78716c" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip
                formatter={(v) => money(v)}
                contentStyle={{
                  fontFamily: "IBM Plex Sans",
                  fontSize: 13,
                  borderRadius: 8,
                  border: "1px solid #e7e5e4",
                }}
              />
              <Bar dataKey="revenue" fill="#065f46" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white border border-stone-200 rounded-lg p-4">
        <p className="font-display font-semibold text-stone-800 mb-3">Low stock alerts</p>
        {lowStockProducts.length === 0 ? (
          <p className="text-sm text-stone-400">Everything is well stocked.</p>
        ) : (
          <div className="space-y-2">
            {lowStockProducts.slice(0, 6).map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-stone-700 truncate pr-2">{p.name}</span>
                <Badge text={stockStatus(p)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
          <p className="font-display font-semibold text-stone-800">Recent transactions</p>
          <button onClick={() => setAdminView("transactions")} className="text-sm text-emerald-800 hover:underline">
            View all
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              <Th>Invoice</Th>
              <Th>Cashier</Th>
              <Th>Items</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 5).map((t) => (
              <tr
                key={t.id}
                className="border-b border-stone-50 hover:bg-stone-50 cursor-pointer"
                onClick={() => setModal({ type: "transactionDetail", txn: t })}
              >
                <Td className="font-medium text-stone-900">
                  {t.invoiceNumber}
                  <div className="text-xs text-stone-400 font-normal">
                    {fmtDate(t.createdAt)}, {fmtTime(t.createdAt)}
                  </div>
                </Td>
                <Td>{t.cashierName}</Td>
                <Td>{t.items.reduce((s, i) => s + i.qty, 0)} items</Td>
                <Td className="font-medium">{money(t.total)}</Td>
                <Td>
                  <Badge text={t.status} />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white border border-stone-200 rounded-lg p-4">
        <p className="font-display font-semibold text-stone-800 mb-3">Quick actions</p>
        <div className="grid grid-cols-2 gap-2">
          <GhostBtn className="text-sm py-2" onClick={() => openProductForm("add")}>
            <Plus size={14} /> Add product
          </GhostBtn>
          <GhostBtn className="text-sm py-2" onClick={() => setAdminView("stock")}>
            <Boxes size={14} /> View stock
          </GhostBtn>
          <GhostBtn className="text-sm py-2" onClick={() => setAdminView("transactions")}>
            <Receipt size={14} /> Transactions
          </GhostBtn>
          <GhostBtn className="text-sm py-2" onClick={() => setAdminView("reports")}>
            <BarChart3 size={14} /> Reports
          </GhostBtn>
          <GhostBtn className="text-sm py-2 col-span-2" onClick={() => setAdminView("users")}>
            <UsersIcon size={14} /> Manage users
          </GhostBtn>
        </div>
        <p className="font-display font-semibold text-stone-800 mt-5 mb-2 text-sm">Best sellers</p>
        <div className="space-y-1.5">
          {bestSellers.map((b, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-stone-600 truncate pr-2">{b.name}</span>
              <span className="text-stone-400">{b.qty} sold</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
