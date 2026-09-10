import React from "react";
import { Search, Printer } from "lucide-react";
import { money, fmtDate, fmtTime } from "../../utils/helpers";
import { inputCls } from "../ui/FormElements";
import { EmptyState } from "../ui/EmptyState";
import { Badge } from "../ui/Badge";
import { Th, Td } from "../ui/TableElements";

export const Transactions = ({ transactions, txnSearch, setTxnSearch, setModal }) => {
  const filtered = transactions.filter(
    (t) =>
      t.invoiceNumber.toLowerCase().includes(txnSearch.toLowerCase()) ||
      t.cashierName.toLowerCase().includes(txnSearch.toLowerCase())
  );

  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-stone-100">
        <div className="relative max-w-xs">
          <Search size={16} className="absolute left-3 top-2.5 text-stone-400" />
          <input
            className={inputCls + " pl-9"}
            placeholder="Search invoice or cashier"
            value={txnSearch}
            onChange={(e) => setTxnSearch(e.target.value)}
          />
        </div>
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="No transactions found." />
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              <Th>Invoice</Th>
              <Th>Date</Th>
              <Th>Cashier</Th>
              <Th>Items</Th>
              <Th>Total</Th>
              <Th>Payment</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-stone-50 hover:bg-stone-50">
                <Td className="font-medium text-stone-900">{t.invoiceNumber}</Td>
                <Td>
                  {fmtDate(t.createdAt)} <span className="text-stone-400">{fmtTime(t.createdAt)}</span>
                </Td>
                <Td>{t.cashierName}</Td>
                <Td>{t.items.reduce((s, i) => s + i.qty, 0)}</Td>
                <Td className="font-medium">{money(t.total)}</Td>
                <Td>{t.paymentMethod}</Td>
                <Td>
                  <Badge text={t.status} />
                </Td>
                <Td>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setModal({ type: "transactionDetail", txn: t })}
                      className="text-emerald-800 hover:underline text-xs font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setModal({ type: "transactionDetail", txn: t, print: true })}
                      className="text-stone-400 hover:text-stone-700"
                      title="Print / Reprint"
                    >
                      <Printer size={15} />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
