import React from "react";
import { money, stockStatus } from "../../utils/helpers";
import { StatCard } from "../ui/StatCard";
import { EmptyState } from "../ui/EmptyState";
import { Badge } from "../ui/Badge";
import { Th, Td } from "../ui/TableElements";

export const Reports = ({
  reportTab,
  setReportTab,
  reportRange,
  setReportRange,
  rangeTxns,
  products,
}) => {
  const totalSales = rangeTxns.reduce((s, t) => s + t.total, 0);
  const itemsSold = rangeTxns.reduce((s, t) => s + t.items.reduce((a, i) => a + i.qty, 0), 0);
  const avgTxn = rangeTxns.length ? totalSales / rangeTxns.length : 0;
  const productMap = {};
  rangeTxns.forEach((t) =>
    t.items.forEach((i) => {
      productMap[i.productId] = productMap[i.productId] || { name: i.name, qty: 0, revenue: 0 };
      productMap[i.productId].qty += i.qty;
      productMap[i.productId].revenue += i.lineTotal;
    })
  );
  const productRows = Object.values(productMap).sort((a, b) => b.qty - a.qty);
  const cashierMap = {};
  rangeTxns.forEach((t) => {
    cashierMap[t.cashierName] = cashierMap[t.cashierName] || { count: 0, total: 0 };
    cashierMap[t.cashierName].count += 1;
    cashierMap[t.cashierName].total += t.total;
  });
  const cashierRows = Object.entries(cashierMap);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 bg-white border border-stone-200 rounded-md p-1">
          {["Sales", "Product", "Stock", "Cashier", "Summary"].map((tab) => (
            <button
              key={tab}
              onClick={() => setReportTab(tab)}
              className={`px-3 py-1.5 rounded text-sm font-medium ${
                reportTab === tab ? "bg-emerald-800 text-white" : "text-stone-500 hover:bg-stone-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-white border border-stone-200 rounded-md p-1">
          {["Today", "7 Days", "30 Days"].map((r) => (
            <button
              key={r}
              onClick={() => setReportRange(r)}
              className={`px-3 py-1.5 rounded text-sm font-medium ${
                reportRange === r ? "bg-amber-500 text-emerald-950" : "text-stone-500 hover:bg-stone-50"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {rangeTxns.length === 0 && reportTab !== "Stock" ? (
        <div className="bg-white border border-stone-200 rounded-lg">
          <EmptyState title="No data available for the selected period." />
        </div>
      ) : (
        <>
          {reportTab === "Sales" && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total sales" value={money(totalSales)} tone="emerald" />
              <StatCard label="Transaction count" value={rangeTxns.length} />
              <StatCard label="Items sold" value={itemsSold} />
              <StatCard label="Average transaction" value={money(avgTxn)} />
            </div>
          )}
          {reportTab === "Product" && (
            <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100">
                    <Th>Product</Th>
                    <Th>Quantity sold</Th>
                    <Th>Revenue</Th>
                  </tr>
                </thead>
                <tbody>
                  {productRows.map((r, i) => (
                    <tr key={i} className="border-b border-stone-50">
                      <Td className="font-medium text-stone-900">{r.name}</Td>
                      <Td>{r.qty}</Td>
                      <Td>{money(r.revenue)}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {reportTab === "Stock" && (
            <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100">
                    <Th>Product</Th>
                    <Th>Current stock</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-stone-50">
                      <Td className="font-medium text-stone-900">{p.name}</Td>
                      <Td>{p.stock}</Td>
                      <Td>
                        <Badge text={stockStatus(p)} />
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {reportTab === "Cashier" && (
            <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100">
                    <Th>Cashier</Th>
                    <Th>Transactions</Th>
                    <Th>Sales amount</Th>
                    <Th>Average transaction</Th>
                  </tr>
                </thead>
                <tbody>
                  {cashierRows.map(([name, r], i) => (
                    <tr key={i} className="border-b border-stone-50">
                      <Td className="font-medium text-stone-900">{name}</Td>
                      <Td>{r.count}</Td>
                      <Td>{money(r.total)}</Td>
                      <Td>{money(r.total / r.count)}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {reportTab === "Summary" && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Revenue" value={money(totalSales)} tone="emerald" />
              <StatCard label="Orders" value={rangeTxns.length} />
              <StatCard label="Items sold" value={itemsSold} />
              <StatCard label="Average order value" value={money(avgTxn)} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
