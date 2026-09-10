import React from "react";
import { money, fmtDate, fmtTime } from "../../utils/helpers";
import { EmptyState } from "../ui/EmptyState";
import { Badge } from "../ui/Badge";
import { Th, Td } from "../ui/TableElements";

export const AdminHeldBills = ({ heldBills }) => (
  <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
    {heldBills.length === 0 ? (
      <EmptyState
        title="No held bills."
        subtitle="Bills held by cashiers will appear here until resumed or completed."
      />
    ) : (
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-100">
            <Th>Hold reference</Th>
            <Th>Cashier</Th>
            <Th>Date</Th>
            <Th>Items</Th>
            <Th>Total</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {heldBills.map((b) => (
            <tr key={b.id} className="border-b border-stone-50 hover:bg-stone-50">
              <Td className="font-medium text-stone-900">{b.holdReference}</Td>
              <Td>{b.cashierName}</Td>
              <Td>
                {fmtDate(b.createdAt)} <span className="text-stone-400">{fmtTime(b.createdAt)}</span>
              </Td>
              <Td>{b.items.reduce((s, i) => s + i.qty, 0)} items</Td>
              <Td className="font-medium">{money(b.total)}</Td>
              <Td>
                <Badge text={b.status} />
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
