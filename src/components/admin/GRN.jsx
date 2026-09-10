import React, { useState } from "react";
import { Search, Plus, Eye, Truck } from "lucide-react";
import { money } from "../../utils/helpers";
import { GoldBtn, GhostBtn } from "../ui/Buttons";
import { inputCls } from "../ui/FormElements";
import { Th, Td } from "../ui/TableElements";
import { Badge } from "../ui/Badge";

export const GRN = ({ grns, openGrnForm, viewGrnDetails }) => {
  const [search, setSearch] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("All");

  const suppliers = ["All", ...Array.from(new Set(grns.map((g) => g.supplier)))];

  const filteredGrns = grns.filter((g) => {
    const matchSearch =
      g.grnNumber.toLowerCase().includes(search.toLowerCase()) ||
      g.supplier.toLowerCase().includes(search.toLowerCase()) ||
      (g.supplierRef && g.supplierRef.toLowerCase().includes(search.toLowerCase()));
    const matchSupp = supplierFilter === "All" || g.supplier === supplierFilter;
    return matchSearch && matchSupp;
  });

  const totalReceivedCost = filteredGrns.reduce((s, g) => s + g.totalCost, 0);
  const totalItemsReceived = filteredGrns.reduce(
    (s, g) => s + g.items.reduce((acc, it) => acc + it.receivedQty, 0),
    0
  );

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-stone-900 flex items-center gap-2">
            <Truck className="text-emerald-800" size={24} /> Goods Received Notes (GRN)
          </h2>
          <p className="text-stone-500 text-sm mt-0.5">
            Receive stock from suppliers, update product inventory, and track purchase orders.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-emerald-50 border border-emerald-200/60 rounded-lg px-3.5 py-1.5 text-right">
            <p className="text-xs text-emerald-700 font-medium">Total Received Value</p>
            <p className="font-display font-bold text-base text-emerald-900">{money(totalReceivedCost)}</p>
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-1.5 text-right">
            <p className="text-xs text-stone-500 font-medium">Total Items</p>
            <p className="font-display font-bold text-base text-stone-800">{totalItemsReceived} units</p>
          </div>
          <GoldBtn onClick={openGrnForm} className="shrink-0">
            <Plus size={16} /> New GRN
          </GoldBtn>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-lg p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-2.5 text-stone-400" />
          <input
            className={inputCls + " pl-9"}
            placeholder="Search GRN #, supplier, invoice ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-medium text-stone-500 shrink-0">Supplier:</span>
          <select
            className={inputCls + " w-full sm:w-56 text-sm"}
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
          >
            {suppliers.map((supp) => (
              <option key={supp} value={supp}>
                {supp}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* GRN Table */}
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              <Th>GRN Number</Th>
              <Th>Supplier</Th>
              <Th>Ref / Inv #</Th>
              <Th>Items Count</Th>
              <Th>Total Cost</Th>
              <Th>Created By</Th>
              <Th>Date</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredGrns.map((g) => {
              const itemTypesCount = g.items.length;
              const totalQty = g.items.reduce((acc, it) => acc + it.receivedQty, 0);
              return (
                <tr key={g.id} className="hover:bg-stone-50/60 transition">
                  <Td className="font-mono font-semibold text-stone-900">{g.grnNumber}</Td>
                  <Td className="font-medium text-stone-800">{g.supplier}</Td>
                  <Td className="text-stone-500 text-xs font-mono">{g.supplierRef || "N/A"}</Td>
                  <Td className="text-stone-700">
                    <span className="font-medium">{totalQty} units</span>{" "}
                    <span className="text-xs text-stone-400">({itemTypesCount} items)</span>
                  </Td>
                  <Td className="font-display font-bold text-emerald-800">{money(g.totalCost)}</Td>
                  <Td className="text-stone-700">{g.createdBy}</Td>
                  <Td className="text-xs text-stone-500">{new Date(g.createdAt).toLocaleDateString()}</Td>
                  <Td>
                    <Badge text={g.status || "Completed"} tone="emerald" />
                  </Td>
                  <Td>
                    <GhostBtn onClick={() => viewGrnDetails(g)} className="text-xs py-1 px-2.5">
                      <Eye size={14} /> View
                    </GhostBtn>
                  </Td>
                </tr>
              );
            })}
            {filteredGrns.length === 0 && (
              <tr>
                <Td colSpan={9} className="text-center text-stone-400 py-10">
                  No Goods Received Notes match your search criteria.
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
