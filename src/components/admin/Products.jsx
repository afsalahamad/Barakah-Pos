import React from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { CATEGORIES } from "../../data/seedData";
import { money } from "../../utils/helpers";
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
  const filtered = products.filter(
    (p) =>
      (productCategoryFilter === "All" || p.category === productCategoryFilter) &&
      (p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase()))
  );

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
            <option>All</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
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
              <Th>Stock</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-stone-50 hover:bg-stone-50">
                <Td className="font-medium text-stone-900">{p.name}</Td>
                <Td>{p.sku}</Td>
                <Td>{p.category}</Td>
                <Td>{money(p.price)}</Td>
                <Td>
                  {p.stock} {p.unit}
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
