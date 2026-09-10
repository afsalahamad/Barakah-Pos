import React, { useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { CATEGORIES } from "../../data/seedData";
import { money, isStockTracked } from "../../utils/helpers";
import { inputCls } from "../ui/FormElements";
import { PrimaryBtn } from "../ui/Buttons";
import { EmptyState } from "../ui/EmptyState";
import { Badge } from "../ui/Badge";
import { Th, Td } from "../ui/TableElements";

export const Products = ({
  products,
  productSearch,
  setProductSearch,
  productCategoryFilter,
  setProductCategoryFilter,
  openProductForm,
  confirmDeactivateProduct,
}) => {
  const [inventoryTypeFilter, setInventoryTypeFilter] = useState("All");

  const filtered = products.filter((p) => {
    const matchCat = productCategoryFilter === "All" || p.category === productCategoryFilter;
    const matchSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase());
    const isTracked = isStockTracked(p);
    const matchInv =
      inventoryTypeFilter === "All" ||
      (inventoryTypeFilter === "Stock Tracked" && isTracked) ||
      (inventoryTypeFilter === "Prepared" && !isTracked);
    return matchCat && matchSearch && matchInv;
  });

  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
      <div className="p-4 flex flex-wrap gap-3 items-center justify-between border-b border-stone-100">
        <div className="flex gap-2 flex-1" style={{ minWidth: 240 }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-2.5 text-stone-400" />
            <input
              className={inputCls + " pl-9"}
              placeholder="Search name or SKU"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />
          </div>
          <select
            className={inputCls + " w-40"}
            value={productCategoryFilter}
            onChange={(e) => setProductCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className={inputCls + " w-40"}
            value={inventoryTypeFilter}
            onChange={(e) => setInventoryTypeFilter(e.target.value)}
          >
            <option value="All">All Tracking</option>
            <option value="Stock Tracked">Stock Tracked</option>
            <option value="Prepared">Prepared / Non-Stock</option>
          </select>
        </div>
        <PrimaryBtn onClick={() => openProductForm("add")}>
          <Plus size={16} /> Add product
        </PrimaryBtn>
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          title="No products yet."
          subtitle="Add your first product to start selling."
          action={
            <PrimaryBtn onClick={() => openProductForm("add")}>
              <Plus size={16} /> Add product
            </PrimaryBtn>
          }
        />
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              <Th>Product</Th>
              <Th>SKU</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Inventory Mode</Th>
              <Th>Current Stock</Th>
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
                  <Td>{p.category}</Td>
                  <Td>{money(p.price)}</Td>
                  <Td>
                    <Badge text={tracked ? "Stock Tracked" : "Prepared"} tone={tracked ? "emerald" : "indigo"} />
                  </Td>
                  <Td>
                    {tracked ? (
                      `${p.stock} ${p.unit || ""}`
                    ) : (
                      <span className="text-stone-400 italic text-xs">On-Demand</span>
                    )}
                  </Td>
                  <Td>
                    <Badge text={p.status} />
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openProductForm("edit", p)}
                        className="text-stone-400 hover:text-emerald-800"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => confirmDeactivateProduct(p)}
                        className="text-stone-400 hover:text-rose-600"
                        title={p.status === "Active" ? "Deactivate" : "Activate"}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
