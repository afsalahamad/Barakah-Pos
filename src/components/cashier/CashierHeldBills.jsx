import React from "react";
import { money, fmtTime } from "../../utils/helpers";
import { PrimaryBtn, GhostBtn } from "../ui/Buttons";
import { EmptyState } from "../ui/EmptyState";

export const CashierHeldBills = ({
  heldBills,
  currentUser,
  resumeHeldBill,
  cancelHeldBill,
}) => {
  const userHeldBills = heldBills.filter((b) => b.cashierId === currentUser.id);

  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
      {userHeldBills.length === 0 ? (
        <EmptyState
          title="No held bills."
          subtitle="Bills you hold will appear here so you can resume them later."
        />
      ) : (
        <div className="divide-y divide-stone-100">
          {userHeldBills.map((b) => (
            <div key={b.id} className="p-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-medium text-stone-900">
                  {b.holdReference} <span className="text-stone-400 font-normal text-sm">· {fmtTime(b.createdAt)}</span>
                </p>
                <p className="text-sm text-stone-500">
                  {b.items.reduce((s, i) => s + i.qty, 0)} items · {money(b.total)}
                </p>
              </div>
              <div className="flex gap-2">
                <PrimaryBtn className="py-1.5 px-3 text-sm" onClick={() => resumeHeldBill(b)}>
                  Resume
                </PrimaryBtn>
                <GhostBtn className="py-1.5 px-3 text-sm" onClick={() => cancelHeldBill(b)}>
                  Cancel
                </GhostBtn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
