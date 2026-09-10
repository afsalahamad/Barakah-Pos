import React from "react";
import { Search, Minus, Plus, Trash2, PauseCircle, Check, AlertTriangle } from "lucide-react";
import { CATEGORIES } from "../../data/seedData";
import { money, isStockTracked } from "../../utils/helpers";
import { Field, inputCls } from "../ui/FormElements";
import { GhostBtn, GoldBtn } from "../ui/Buttons";
import { Badge } from "../ui/Badge";

export const BillingDesk = ({
  activeProducts,
  posSearch,
  setPosSearch,
  posCategory,
  setPosCategory,
  addToCart,
  cart,
  changeQty,
  removeFromCart,
  cartError,
  setCartError,
  cartNote,
  setCartNote,
  cartSubtotal,
  cashReceivedInput,
  setCashReceivedInput,
  change,
  holdBill,
  clearCart,
  isCompletingSale,
  completeSale,
}) => {
  const posCategories = ["All", ...CATEGORIES];
  const posFiltered = activeProducts.filter(
    (p) =>
      (posCategory === "All" || p.category === posCategory) &&
      p.name.toLowerCase().includes(posSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      <div
        className="flex-1 min-w-0 bg-white border border-stone-200 rounded-lg p-4 flex flex-col"
        style={{ minHeight: 500 }}
      >
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-2.5 text-stone-400" />
            <input
              className={inputCls + " pl-9"}
              placeholder="Search product, SKU or barcode"
              value={posSearch}
              onChange={(e) => setPosSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {posCategories.map((c) => (
            <button
              key={c}
              onClick={() => setPosCategory(c)}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                posCategory === c
                  ? "bg-emerald-800 text-white border-emerald-800"
                  : "border-stone-200 text-stone-600 hover:bg-stone-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto pr-1">
          {posFiltered.map((p) => {
            const tracked = isStockTracked(p);
            const outOfStock = tracked && p.stock <= 0;
            return (
              <button
                key={p.id}
                disabled={outOfStock}
                onClick={() => addToCart(p)}
                className={`text-left border rounded-lg p-3 transition ${
                  outOfStock
                    ? "opacity-50 cursor-not-allowed border-stone-100"
                    : "border-stone-200 hover:border-emerald-700 hover:shadow-sm"
                }`}
              >
                <p className="font-body font-medium text-sm text-stone-900 leading-snug">{p.name}</p>
                <p className="font-display font-semibold text-emerald-800 mt-1.5">{money(p.price)}</p>
                <div className="mt-1.5">
                  {!tracked ? (
                    <Badge text="Prepared" tone="indigo" />
                  ) : outOfStock ? (
                    <Badge text="Out of Stock" tone="rose" />
                  ) : (
                    <span className="text-xs text-stone-400">Stock: {p.stock}</span>
                  )}
                </div>
              </button>
            );
          })}
          {posFiltered.length === 0 && (
            <p className="col-span-full text-center text-stone-400 text-sm py-10">No products match your search.</p>
          )}
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg p-4 flex flex-col lg:w-96 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <p className="font-display font-semibold text-stone-800">Current bill</p>
          <span className="text-xs text-stone-400">
            {cart.length} item{cart.length !== 1 && "s"}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2" style={{ minHeight: 160 }}>
          {cart.length === 0 && (
            <p className="text-sm text-stone-400 text-center py-10">Search and tap a product to add it here.</p>
          )}
          {cart.map((i) => (
            <div key={i.productId} className="flex items-center gap-2 border border-stone-100 rounded-md p-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-800 truncate">{i.name}</p>
                <p className="text-xs text-stone-400">{money(i.price)} each</p>
              </div>
              <button
                onClick={() => changeQty(i.productId, -1)}
                className="w-6 h-6 rounded bg-stone-100 flex items-center justify-center hover:bg-stone-200"
              >
                <Minus size={13} />
              </button>
              <span className="w-5 text-center text-sm">{i.qty}</span>
              <button
                onClick={() => changeQty(i.productId, 1)}
                className="w-6 h-6 rounded bg-stone-100 flex items-center justify-center hover:bg-stone-200"
              >
                <Plus size={13} />
              </button>
              <span className="w-14 text-right text-sm font-medium">{money(i.lineTotal)}</span>
              <button onClick={() => removeFromCart(i.productId)} className="text-stone-300 hover:text-rose-600">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {cartError && (
          <div className="mt-2 flex items-center gap-1.5 text-rose-600 text-xs">
            <AlertTriangle size={13} />
            {cartError}
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-stone-100">
          <input
            className={inputCls + " text-sm mb-2"}
            placeholder="Add note (optional)"
            value={cartNote}
            onChange={(e) => setCartNote(e.target.value)}
          />
          <div className="flex justify-between text-sm text-stone-600 mb-1">
            <span>Subtotal</span>
            <span>{money(cartSubtotal)}</span>
          </div>
          <div className="flex justify-between font-display font-semibold text-lg text-stone-900 mb-3">
            <span>Total</span>
            <span>{money(cartSubtotal)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <Field label="Payment method">
              <input className={inputCls} value="Cash" disabled />
            </Field>
            <Field label="Cash received">
              <input
                type="number"
                className={inputCls}
                placeholder="0.00"
                value={cashReceivedInput}
                onChange={(e) => {
                  setCashReceivedInput(e.target.value);
                  setCartError("");
                }}
              />
            </Field>
          </div>
          <div className="flex justify-between text-sm text-stone-600 mb-3">
            <span>Change</span>
            <span className="font-medium">{money(Math.max(0, change))}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <GhostBtn disabled={cart.length === 0} onClick={holdBill}>
              <PauseCircle size={16} /> Hold bill
            </GhostBtn>
            <GhostBtn disabled={cart.length === 0} onClick={clearCart}>
              Clear
            </GhostBtn>
          </div>
          <GoldBtn className="w-full mt-2" disabled={cart.length === 0 || isCompletingSale} onClick={completeSale}>
            {isCompletingSale ? (
              "Completing sale..."
            ) : (
              <>
                <Check size={16} /> Complete sale
              </>
            )}
          </GoldBtn>
        </div>
      </div>
    </div>
  );
};
