import React from "react";
import { Search } from "lucide-react";
import { money, stockStatus } from "../../utils/helpers";
import { inputCls } from "../ui/FormElements";
import { Badge } from "../ui/Badge";
import { Th, Td } from "../ui/TableElements";

export const CashierStock = ({
  activeProducts,
  cashierStockSearch,
  setCashierStockSearch,
}) => {
  const filtered = activeProducts.filter((p) =>
    p.name.toLowerCase().includes(cashierStockSearch.toLowerCase())
  );

  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-stone-100">
        <div className="relative max-w-xs">
          <Search size={16} className="absolute left-3 top-2.5 text-stone-400" />
          <input
            className={inputCls + " pl-9"}
            placeholder="Search product"
            value={cashierStockSearch}
            onChange={(e) => setCashierStockSearch(e.target.value)}
          />
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-100">
            <Th>Product</Th>
            <Th>SKU</Th>
            <Th>Price</Th>
            <Th>Available stock</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} className="border-b border-stone-50">
              <Td className="font-medium text-stone-900">{p.name}</Td>
              <Td>{p.sku}</Td>
              <Td>{money(p.price)}</Td>
              <Td>{p.stock}</Td>
              <Td>
                <Badge text={stockStatus(p)} />
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
