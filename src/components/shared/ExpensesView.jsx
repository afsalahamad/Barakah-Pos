import React, { useState } from "react";
import { Search, Plus, Receipt, Tag, User, Calendar } from "lucide-react";
import { EXPENSE_CATEGORIES } from "../../data/seedData";
import { money } from "../../utils/helpers";
import { GoldBtn } from "../ui/Buttons";
import { inputCls } from "../ui/FormElements";
import { Th, Td } from "../ui/TableElements";

export const ExpensesView = ({
  expenses = [],
  openExpenseForm,
  currentUser,
  isAdmin = false,
}) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const todayDateStr = new Date().toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Dynamic Local Business Date Checker
  const checkIsToday = (dateValue) => {
    if (!dateValue) return false;
    const expenseDate = new Date(dateValue);
    const today = new Date();
    return (
      expenseDate.getFullYear() === today.getFullYear() &&
      expenseDate.getMonth() === today.getMonth() &&
      expenseDate.getDate() === today.getDate()
    );
  };

  const isCashier = currentUser?.role === "CASHIER" || !isAdmin;

  // Strict Role-Based Visibility:
  // CASHIER -> ONLY view expenses from the current local business date (isToday)
  // ADMIN -> View full expense history
  const visibleExpenses = isCashier
    ? expenses.filter((e) => checkIsToday(e.createdAt || e.created_at || e.date))
    : expenses;

  const filteredExpenses = visibleExpenses.filter((e) => {
    const matchSearch =
      (e.expenseNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.note || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.cashierName || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || e.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const totalExpenseAmount = visibleExpenses.reduce(
    (s, e) => s + Number(e.amount || 0),
    0
  );

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-stone-900 flex items-center gap-2">
            <Receipt className="text-emerald-800" size={24} />
            {isCashier ? "Today's Expenses" : "Operational Expenses"}
          </h2>
          <p className="text-stone-500 text-sm mt-0.5 flex items-center gap-1.5">
            {isCashier ? (
              <>
                <Calendar size={14} className="text-emerald-700 shrink-0" />
                <span className="font-medium text-stone-700">{todayDateStr}</span>
                <span className="text-stone-400">•</span>
                <span>Record and manage shop expenses incurred today.</span>
              </>
            ) : (
              "Track store operational expenses recorded across all terminals."
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200/60 rounded-lg px-4 py-2 text-right">
            <p className="text-xs text-emerald-700 font-medium">
              {isCashier ? "Today's Total Expenses" : "Total Listed Expenses"}
            </p>
            <p className="font-display font-bold text-lg text-emerald-900">
              {money(totalExpenseAmount)}
            </p>
          </div>
          <GoldBtn onClick={openExpenseForm} className="shrink-0">
            <Plus size={16} /> Add Expense
          </GoldBtn>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-lg p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-2.5 text-stone-400" />
          <input
            className={inputCls + " pl-9"}
            placeholder="Search note, ID, or cashier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-medium text-stone-500 shrink-0">Category:</span>
          <select
            className={inputCls + " w-full sm:w-48 text-sm"}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty State for Cashier when no expenses today */}
      {isCashier && visibleExpenses.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-lg p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
            <Receipt size={24} />
          </div>
          <h3 className="font-display font-bold text-lg text-stone-800">
            No expenses recorded today.
          </h3>
          <p className="text-stone-500 text-sm mt-1 max-w-sm">
            Record any shop expenses, transport, delivery, or supplies incurred today.
          </p>
          <div className="mt-4">
            <GoldBtn onClick={openExpenseForm}>
              <Plus size={16} /> Add Expense
            </GoldBtn>
          </div>
        </div>
      ) : (
        /* Expense Table */
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50">
                <Th>Expense ID</Th>
                <Th>Category</Th>
                <Th>Amount</Th>
                <Th>Note / Description</Th>
                <Th>Recorded By</Th>
                <Th>Time / Date</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-stone-50/60 transition">
                  <Td className="font-mono font-semibold text-stone-900">
                    {exp.expenseNumber || exp.id}
                  </Td>
                  <Td>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-700 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">
                      <Tag size={11} className="text-emerald-700" /> {exp.category}
                    </span>
                  </Td>
                  <Td className="font-display font-bold text-rose-700">
                    {money(exp.amount)}
                  </Td>
                  <Td className="text-stone-700 max-w-xs truncate">
                    {exp.note || <span className="text-stone-300 italic">No notes</span>}
                  </Td>
                  <Td>
                    <span className="flex items-center gap-1.5 text-stone-800 text-sm">
                      <User size={13} className="text-stone-400" /> {exp.cashierName || "Staff"}
                    </span>
                  </Td>
                  <Td className="text-xs text-stone-500">
                    {new Date(exp.createdAt || exp.created_at || exp.date).toLocaleString(undefined, {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </Td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <Td colSpan={6} className="text-center text-stone-400 py-10">
                    No expense records match your current filters.
                  </Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
