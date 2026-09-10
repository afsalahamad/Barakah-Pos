import React from "react";
import { Search } from "lucide-react";
import { stockStatus, isStockTracked } from "../../utils/helpers";
import { inputCls } from "../ui/FormElements";
import { GhostBtn } from "../ui/Buttons";
import { Badge } from "../ui/Badge";
import { Th, Td } from "../ui/TableElements";

export const Stock = ({
  products,
  stockSearch,
  setStockSearch,
  stockStatusFilter,
  setStockStatusFilter,
  openStockAdjust,
  stockMovements,
}) => {
  const filtered = products.filter(
    (p) =>
      (stockStatusFilter === "All" || stockStatus(p) === stockStatusFilter) &&
      p.name.toLowerCase().includes(stockSearch.toLowerCase())
  );

  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
      <div className="p-4 flex flex-wrap gap-3 items-center border-b border-stone-100">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-2.5 text-stone-400" />
          <input
            className={inputCls + " pl-9"}
            placeholder="Search product"
            value={stockSearch}
            onChange={(e) => setStockSearch(e.target.value)}
          />
        </div>
        <select
          className={inputCls + " w-40"}
          value={stockStatusFilter}
          onChange={(e) => setStockStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
          <option value="Prepared">Prepared / Non-Stock</option>
        </select>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-100">
            <Th>Product</Th>
            <Th>SKU</Th>
            <Th>Current stock</Th>
            <Th>Minimum</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => {
            const tracked = isStockTracked(p);
            return (
              <tr key={p.id} className="border-b border-stone-50 hover:bg-stone-50">
                <Td className="font-medium text-stone-900">{p.name}</Td>
                <Td>{p.sku}</Td>
                <Td>
                  {tracked ? `${p.stock} ${p.unit || ""}` : <span className="text-stone-400 italic text-xs">On-Demand</span>}
                </Td>
                <Td>{tracked ? p.lowStockThreshold : "-"}</Td>
                <Td>
                  <Badge text={stockStatus(p)} />
                </Td>
                <Td>
                  {tracked ? (
                    <GhostBtn className="py-1.5 px-3 text-xs" onClick={() => openStockAdjust(p)}>
                      Adjust stock
                    </GhostBtn>
                  ) : (
                    <span className="text-xs text-stone-400 italic">No Stock Needed</span>
                  )}
                </Td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {stockMovements.length > 0 && (
        <div className="border-t border-stone-100 p-4">
          <p className="font-display font-semibold text-stone-800 mb-2 text-sm">Recent stock movements</p>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {stockMovements.slice(0, 8).map((m) => (
              <div key={m.id} className="text-xs text-stone-500 flex justify-between border-b border-stone-50 pb-1.5">
                <span>
                  {m.productName} — {m.movementType} ({m.oldStock} → {m.newStock})
                </span>
                <span>{m.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
