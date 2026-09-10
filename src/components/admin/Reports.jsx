import React, { useState, useMemo } from "react";
import {
  Calendar,
  Download,
  AlertTriangle,
  Receipt,
  Package,
  Truck,
  DollarSign,
  FileText,
  TrendingUp,
  Tag,
} from "lucide-react";
import { money } from "../../utils/helpers";
import { StatCard } from "../ui/StatCard";
import { EmptyState } from "../ui/EmptyState";
import { Badge } from "../ui/Badge";
import { Th, Td } from "../ui/TableElements";
import { GoldBtn, GhostBtn } from "../ui/Buttons";
import { inputCls } from "../ui/FormElements";
import { generateReportPDF } from "../../utils/pdfGenerator";

export const Reports = ({
  transactions = [],
  products = [],
  expenses = [],
  grns = [],
  business = {},
  currentUser = {},
}) => {
  // Helper for YYYY-MM-DD
  const formatDateInput = (d) => {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = formatDateInput(new Date());

  // Local State
  const [reportType, setReportType] = useState("Sales"); // Sales | Product | Expenses | GRN | Profit & Loss
  const [quickFilter, setQuickFilter] = useState("Today"); // Today | Yesterday | This Week | This Month | Last 7 Days | Last 30 Days | Custom
  const [fromDate, setFromDate] = useState(todayStr);
  const [toDate, setToDate] = useState(todayStr);

  // Quick Filter Handler
  const handleQuickFilter = (type) => {
    setQuickFilter(type);
    const now = new Date();
    let start = new Date();
    let end = new Date();

    if (type === "Today") {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (type === "Yesterday") {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    } else if (type === "This Week") {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday start
      start = new Date(now.setDate(diff));
      end = new Date();
    } else if (type === "This Month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date();
    } else if (type === "Last 7 Days") {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
      end = new Date();
    } else if (type === "Last 30 Days") {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
      end = new Date();
    }

    if (type !== "Custom") {
      setFromDate(formatDateInput(start));
      setToDate(formatDateInput(end));
    }
  };

  // Date Timestamps
  const startMs = useMemo(() => {
    if (!fromDate) return 0;
    return new Date(fromDate + "T00:00:00.000").getTime();
  }, [fromDate]);

  const endMs = useMemo(() => {
    if (!toDate) return 0;
    return new Date(toDate + "T23:59:59.999").getTime();
  }, [toDate]);

  const invalidDateRange = fromDate && toDate && startMs > endMs;

  // Filtered Source Data
  const filteredTxns = useMemo(() => {
    if (invalidDateRange) return [];
    return transactions.filter((t) => {
      const time = new Date(t.createdAt).getTime();
      return time >= startMs && time <= endMs;
    });
  }, [transactions, startMs, endMs, invalidDateRange]);

  const filteredExpenses = useMemo(() => {
    if (invalidDateRange) return [];
    return expenses.filter((e) => {
      const time = new Date(e.createdAt).getTime();
      return time >= startMs && time <= endMs;
    });
  }, [expenses, startMs, endMs, invalidDateRange]);

  const filteredGrns = useMemo(() => {
    if (invalidDateRange) return [];
    return grns.filter((g) => {
      const time = new Date(g.createdAt).getTime();
      return time >= startMs && time <= endMs;
    });
  }, [grns, startMs, endMs, invalidDateRange]);

  /* -------------------------- CALCULATIONS -------------------------- */
  // Sales Report Calculations
  const grossRevenue = filteredTxns.reduce((s, t) => s + t.total, 0);
  const totalOrders = filteredTxns.length;
  const itemsSold = filteredTxns.reduce((s, t) => s + t.items.reduce((a, i) => a + i.qty, 0), 0);
  const avgOrderValue = totalOrders > 0 ? grossRevenue / totalOrders : 0;

  const cogs = filteredTxns.reduce(
    (s, t) =>
      s +
      t.items.reduce((acc, it) => {
        const prod = products.find((p) => p.id === it.productId);
        const unitCost = prod ? prod.cost : 0;
        return acc + unitCost * it.qty;
      }, 0),
    0
  );

  const grossProfit = grossRevenue - cogs;
  const totalExpenses = filteredExpenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = grossProfit - totalExpenses;

  // Product Sales Calculations
  const productSalesMap = useMemo(() => {
    const map = {};
    filteredTxns.forEach((t) => {
      t.items.forEach((it) => {
        const prod = products.find((p) => p.id === it.productId);
        const unitCost = prod ? prod.cost : 0;
        const lineCost = unitCost * it.qty;
        const lineGrossProfit = it.lineTotal - lineCost;

        if (!map[it.productId]) {
          map[it.productId] = {
            id: it.productId,
            name: it.name,
            qty: 0,
            revenue: 0,
            cost: 0,
            grossProfit: 0,
          };
        }
        map[it.productId].qty += it.qty;
        map[it.productId].revenue += it.lineTotal;
        map[it.productId].cost += lineCost;
        map[it.productId].grossProfit += lineGrossProfit;
      });
    });
    return Object.values(map).sort((a, b) => b.qty - a.qty);
  }, [filteredTxns, products]);

  // Expense Category Breakdown
  const expenseCategoriesMap = useMemo(() => {
    const map = {};
    filteredExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map);
  }, [filteredExpenses]);

  // GRN Summaries
  const totalGrnItems = filteredGrns.reduce(
    (s, g) => s + g.items.reduce((acc, it) => acc + it.receivedQty, 0),
    0
  );
  const totalGrnCost = filteredGrns.reduce((s, g) => s + g.totalCost, 0);

  /* -------------------------- PDF EXPORT HANDLER -------------------------- */
  const handleDownloadPDF = () => {
    let summaryData = [];
    let tableData = { headers: [], rows: [] };

    if (reportType === "Sales") {
      summaryData = [
        { label: "Gross Revenue", value: money(grossRevenue) },
        { label: "Total Orders", value: String(totalOrders) },
        { label: "Items Sold", value: String(itemsSold) },
        { label: "Average Order Value", value: money(avgOrderValue) },
        { label: "Cost of Goods (COGS)", value: money(cogs) },
        { label: "Gross Profit", value: money(grossProfit) },
        { label: "Total Expenses", value: money(totalExpenses) },
        { label: "Net Profit", value: money(netProfit) },
      ];
      tableData = {
        headers: ["Invoice #", "Cashier", "Items", "Total", "Payment", "Date/Time"],
        rows: filteredTxns.map((t) => [
          t.invoiceNumber,
          t.cashierName,
          `${t.items.reduce((a, i) => a + i.qty, 0)} items`,
          money(t.total),
          t.paymentMethod || "Cash",
          new Date(t.createdAt).toLocaleString(),
        ]),
      };
    } else if (reportType === "Product") {
      summaryData = [
        { label: "Unique Products Sold", value: String(productSalesMap.length) },
        { label: "Total Units Sold", value: String(itemsSold) },
        { label: "Total Revenue", value: money(grossRevenue) },
        { label: "Total Gross Profit", value: money(grossProfit) },
      ];
      tableData = {
        headers: ["Product Name", "Quantity Sold", "Revenue", "Cost", "Gross Profit"],
        rows: productSalesMap.map((p) => [
          p.name,
          String(p.qty),
          money(p.revenue),
          money(p.cost),
          money(p.grossProfit),
        ]),
      };
    } else if (reportType === "Expenses") {
      summaryData = [
        { label: "Total Expenses", value: money(totalExpenses) },
        { label: "Total Expense Count", value: String(filteredExpenses.length) },
      ];
      tableData = {
        headers: ["Expense ID", "Category", "Amount", "Note", "Recorded By", "Date/Time"],
        rows: filteredExpenses.map((e) => [
          e.expenseNumber,
          e.category,
          money(e.amount),
          e.note || "-",
          e.cashierName,
          new Date(e.createdAt).toLocaleString(),
        ]),
      };
    } else if (reportType === "GRN") {
      summaryData = [
        { label: "Total GRN Records", value: String(filteredGrns.length) },
        { label: "Total Received Units", value: String(totalGrnItems) },
        { label: "Total Purchase Cost", value: money(totalGrnCost) },
      ];
      tableData = {
        headers: ["GRN Number", "Supplier", "Ref / Inv #", "Items Count", "Total Cost", "Created By", "Date"],
        rows: filteredGrns.map((g) => [
          g.grnNumber,
          g.supplier,
          g.supplierRef || "-",
          `${g.items.reduce((a, i) => a + i.receivedQty, 0)} units`,
          money(g.totalCost),
          g.createdBy,
          new Date(g.createdAt).toLocaleDateString(),
        ]),
      };
    } else if (reportType === "Profit & Loss") {
      summaryData = [
        { label: "Gross Revenue", value: money(grossRevenue) },
        { label: "COGS", value: money(cogs) },
        { label: "Gross Profit", value: money(grossProfit) },
        { label: "Net Profit", value: money(netProfit) },
      ];
      tableData = {
        headers: ["Financial Line Item", "Amount"],
        rows: [
          ["Gross Revenue (Sales)", money(grossRevenue)],
          ["Cost of Goods Sold (COGS)", `- ${money(cogs)}`],
          ["GROSS PROFIT", money(grossProfit)],
          ["Operating Expenses", `- ${money(totalExpenses)}`],
          ["NET PROFIT", money(netProfit)],
        ],
      };
    }

    generateReportPDF({
      reportType,
      fromDate,
      toDate,
      business,
      currentUser,
      summaryData,
      tableData,
    });
  };

  const reportTypes = [
    { id: "Sales", label: "Sales Report", icon: TrendingUp },
    { id: "Product", label: "Product Sales", icon: Package },
    { id: "Expenses", label: "Expense Report", icon: Receipt },
    { id: "GRN", label: "GRN / Purchases", icon: Truck },
    { id: "Profit & Loss", label: "Profit & Loss", icon: DollarSign },
  ];

  const quickFilters = ["Today", "Yesterday", "This Week", "This Month", "Last 7 Days", "Last 30 Days", "Custom"];

  return (
    <div className="space-y-4">
      {/* SECTION 1 — REPORT CONTROLS (Date Range & Quick Filters) */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-xl text-stone-900 flex items-center gap-2">
              <FileText className="text-emerald-800" size={24} /> Financial & Operational Reports
            </h2>
            <p className="text-stone-500 text-sm mt-0.5">
              Select date range and report category to generate analytics and export PDF reports.
            </p>
          </div>
          <GoldBtn onClick={handleDownloadPDF} disabled={invalidDateRange} className="shrink-0">
            <Download size={16} /> Download PDF
          </GoldBtn>
        </div>

        {/* Date Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 pt-3 border-t border-stone-100 justify-between items-start lg:items-center">
          {/* Quick Filter Buttons */}
          <div className="flex gap-1 flex-wrap">
            {quickFilters.map((q) => (
              <button
                key={q}
                onClick={() => handleQuickFilter(q)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  quickFilter === q
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Date Pickers */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-stone-500 font-medium">From:</span>
              <input
                type="date"
                className={inputCls + " text-xs py-1 px-2 w-36"}
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setQuickFilter("Custom");
                }}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-stone-500 font-medium">To:</span>
              <input
                type="date"
                className={inputCls + " text-xs py-1 px-2 w-36"}
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setQuickFilter("Custom");
                }}
              />
            </div>
          </div>
        </div>

        {/* Validation Error Banner */}
        {invalidDateRange && (
          <div className="bg-rose-50 border border-rose-200 rounded-md p-3 flex items-center gap-2 text-rose-700 text-sm">
            <AlertTriangle size={16} className="shrink-0" />
            <span>Invalid Date Range: "From Date" cannot be after "To Date". Please select a valid period.</span>
          </div>
        )}
      </div>

      {/* SECTION 2 — REPORT TYPE SELECTOR TABS */}
      <div className="flex gap-2 border-b border-stone-200 overflow-x-auto pb-1">
        {reportTypes.map((tab) => {
          const Icon = tab.icon;
          const active = reportType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-display text-sm font-semibold transition border-b-2 whitespace-nowrap ${
                active
                  ? "border-emerald-800 text-emerald-900 bg-white shadow-xs"
                  : "border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-100/60"
              }`}
            >
              <Icon size={16} className={active ? "text-emerald-800" : "text-stone-400"} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SECTION 3 — REPORT CONTENT VIEWS */}
      {!invalidDateRange && (
        <>
          {/* 1. SALES REPORT VIEW */}
          {reportType === "Sales" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard label="Gross Revenue" value={money(grossRevenue)} tone="emerald" />
                <StatCard label="Total Orders" value={totalOrders} />
                <StatCard label="Items Sold" value={itemsSold} />
                <StatCard label="Average Order Value" value={money(avgOrderValue)} />
                <StatCard label="Cost of Goods (COGS)" value={money(cogs)} tone="amber" />
                <StatCard label="Gross Profit" value={money(grossProfit)} tone="emerald" />
                <StatCard label="Operating Expenses" value={money(totalExpenses)} tone="rose" />
                <StatCard label="Net Profit" value={money(netProfit)} tone={netProfit >= 0 ? "emerald" : "rose"} />
              </div>

              {/* Transactions Breakdown Table */}
              <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-stone-100 flex justify-between items-center">
                  <h3 className="font-display font-semibold text-stone-800 text-sm">
                    Sales Transactions ({filteredTxns.length})
                  </h3>
                  <span className="text-xs text-stone-400">{fromDate} to {toDate}</span>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50">
                      <Th>Invoice #</Th>
                      <Th>Cashier</Th>
                      <Th>Items Count</Th>
                      <Th>Total Amount</Th>
                      <Th>Payment</Th>
                      <Th>Cash Received</Th>
                      <Th>Change</Th>
                      <Th>Date & Time</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredTxns.map((t) => (
                      <tr key={t.id} className="hover:bg-stone-50/60 transition text-xs">
                        <Td className="font-mono font-semibold text-stone-900">{t.invoiceNumber}</Td>
                        <Td className="text-stone-800">{t.cashierName}</Td>
                        <Td className="text-stone-600">{t.items.reduce((a, i) => a + i.qty, 0)} items</Td>
                        <Td className="font-display font-bold text-emerald-800">{money(t.total)}</Td>
                        <Td className="text-stone-600">{t.paymentMethod || "Cash"}</Td>
                        <Td className="text-stone-600">{money(t.cashReceived)}</Td>
                        <Td className="text-stone-600">{money(t.change)}</Td>
                        <Td className="text-stone-500">{new Date(t.createdAt).toLocaleString()}</Td>
                      </tr>
                    ))}
                    {filteredTxns.length === 0 && (
                      <tr>
                        <Td colSpan={8} className="text-center text-stone-400 py-10">
                          No sales transactions found for the selected date range.
                        </Td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. PRODUCT SALES REPORT VIEW */}
          {reportType === "Product" && (
            <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-stone-100 flex justify-between items-center">
                <h3 className="font-display font-semibold text-stone-800 text-sm">
                  Product Sales & Profitability Breakdown ({productSalesMap.length} products)
                </h3>
                <span className="text-xs text-stone-400">{fromDate} to {toDate}</span>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50">
                    <Th>Product Name</Th>
                    <Th>Units Sold</Th>
                    <Th>Gross Revenue</Th>
                    <Th>Estimated Cost</Th>
                    <Th>Gross Profit</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {productSalesMap.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/60 transition text-xs">
                      <Td className="font-medium text-stone-900">{p.name}</Td>
                      <Td className="font-bold text-stone-800">{p.qty} units</Td>
                      <Td className="font-display font-semibold text-stone-900">{money(p.revenue)}</Td>
                      <Td className="text-stone-500">{money(p.cost)}</Td>
                      <Td className="font-display font-bold text-emerald-800">{money(p.grossProfit)}</Td>
                    </tr>
                  ))}
                  {productSalesMap.length === 0 && (
                    <tr>
                      <Td colSpan={5} className="text-center text-stone-400 py-10">
                        No product sales records found for the selected date range.
                      </Td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. EXPENSE REPORT VIEW */}
          {reportType === "Expenses" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="Total Expenses" value={money(totalExpenses)} tone="rose" />
                <StatCard label="Total Expense Count" value={filteredExpenses.length} />
                <div className="bg-white border border-stone-200 rounded-lg p-4 flex flex-col justify-center">
                  <p className="text-xs text-stone-400 font-medium mb-1">Category Breakdown</p>
                  <div className="flex flex-wrap gap-1.5">
                    {expenseCategoriesMap.map(([cat, amt]) => (
                      <span key={cat} className="text-[11px] bg-stone-100 border border-stone-200 px-2 py-0.5 rounded text-stone-700 font-medium">
                        {cat}: <span className="text-rose-700 font-bold">{money(amt)}</span>
                      </span>
                    ))}
                    {expenseCategoriesMap.length === 0 && <span className="text-xs text-stone-400 italic">No expense categories</span>}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50">
                      <Th>Expense ID</Th>
                      <Th>Category</Th>
                      <Th>Amount</Th>
                      <Th>Note / Description</Th>
                      <Th>Recorded By</Th>
                      <Th>Date & Time</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-stone-50/60 transition text-xs">
                        <Td className="font-mono font-semibold text-stone-900">{exp.expenseNumber}</Td>
                        <Td>
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-700 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">
                            <Tag size={11} className="text-emerald-700" /> {exp.category}
                          </span>
                        </Td>
                        <Td className="font-display font-bold text-rose-700">{money(exp.amount)}</Td>
                        <Td className="text-stone-700 max-w-xs truncate">{exp.note || "-"}</Td>
                        <Td className="text-stone-800">{exp.cashierName}</Td>
                        <Td className="text-stone-500">{new Date(exp.createdAt).toLocaleString()}</Td>
                      </tr>
                    ))}
                    {filteredExpenses.length === 0 && (
                      <tr>
                        <Td colSpan={6} className="text-center text-stone-400 py-10">
                          No expense records found for the selected date range.
                        </Td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. GRN / PURCHASE REPORT VIEW */}
          {reportType === "GRN" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Total GRNs Received" value={filteredGrns.length} />
                <StatCard label="Total Received Items" value={`${totalGrnItems} units`} />
                <StatCard label="Total Purchase Cost" value={money(totalGrnCost)} tone="emerald" />
              </div>

              <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50">
                      <Th>GRN Number</Th>
                      <Th>Supplier</Th>
                      <Th>Ref / Inv #</Th>
                      <Th>Received Items</Th>
                      <Th>Total Purchase Cost</Th>
                      <Th>Created By</Th>
                      <Th>Date</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredGrns.map((g) => (
                      <tr key={g.id} className="hover:bg-stone-50/60 transition text-xs">
                        <Td className="font-mono font-semibold text-stone-900">{g.grnNumber}</Td>
                        <Td className="font-medium text-stone-800">{g.supplier}</Td>
                        <Td className="text-stone-500 font-mono">{g.supplierRef || "-"}</Td>
                        <Td className="text-stone-700">
                          {g.items.reduce((a, i) => a + i.receivedQty, 0)} units ({g.items.length} products)
                        </Td>
                        <Td className="font-display font-bold text-emerald-800">{money(g.totalCost)}</Td>
                        <Td className="text-stone-700">{g.createdBy}</Td>
                        <Td className="text-stone-500">{new Date(g.createdAt).toLocaleDateString()}</Td>
                      </tr>
                    ))}
                    {filteredGrns.length === 0 && (
                      <tr>
                        <Td colSpan={7} className="text-center text-stone-400 py-10">
                          No Goods Received Notes found for the selected date range.
                        </Td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. PROFIT & LOSS SUMMARY VIEW */}
          {reportType === "Profit & Loss" && (
            <div className="max-w-2xl mx-auto bg-white border border-stone-200 rounded-lg p-6 space-y-6 shadow-xs">
              <div className="border-b border-stone-100 pb-4 text-center">
                <h3 className="font-display font-bold text-xl text-stone-900">PROFIT & LOSS STATEMENT</h3>
                <p className="text-stone-500 text-xs mt-1">
                  Reporting Period: <span className="font-medium text-stone-700">{fromDate} to {toDate}</span>
                </p>
              </div>

              <div className="space-y-3 font-body text-sm">
                <div className="flex justify-between items-center py-2 border-b border-stone-100">
                  <span className="font-medium text-stone-800">Gross Sales Revenue</span>
                  <span className="font-display font-semibold text-stone-900">{money(grossRevenue)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-stone-100 text-stone-600 pl-4">
                  <span>Less: Cost of Goods Sold (COGS)</span>
                  <span className="font-mono text-rose-700">- {money(cogs)}</span>
                </div>

                <div className="flex justify-between items-center py-3 bg-stone-50 px-3 rounded-md font-display font-bold text-base text-stone-900">
                  <span>GROSS PROFIT</span>
                  <span className="text-emerald-800">{money(grossProfit)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-stone-100 text-stone-600 pl-4">
                  <span>Less: Operating Expenses</span>
                  <span className="font-mono text-rose-700">- {money(totalExpenses)}</span>
                </div>

                <div className="flex justify-between items-center py-4 bg-emerald-900 text-white px-4 rounded-lg font-display font-bold text-lg shadow-sm">
                  <span>NET PROFIT</span>
                  <span className="text-amber-400">{money(netProfit)}</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
