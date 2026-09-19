import React, { useState } from "react";
import { Search, Minus, Plus, Trash2, PauseCircle, Check, AlertTriangle, ShoppingBag, ArrowLeft } from "lucide-react";
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
  const [mobileTab, setMobileTab] = useState("products"); // 'products' | 'cart'
  const posCategories = ["All", ...CATEGORIES];
  const posFiltered = activeProducts.filter(
    (p) =>
      (posCategory === "All" || p.category === posCategory) &&
      p.name.toLowerCase().includes(posSearch.toLowerCase())
  );

  const cartItemCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full relative">
      {/* Mobile Tab Toggle Bar (< lg) */}
      <div className="lg:hidden flex bg-stone-200 p-1 rounded-lg mb-1 shrink-0">
        <button
          onClick={() => setMobileTab("products")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
            mobileTab === "products" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600"
          }`}
        >
          Products ({posFiltered.length})
        </button>
        <button
          onClick={() => setMobileTab("cart")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition relative ${
            mobileTab === "cart" ? "bg-white text-emerald-950 shadow-sm" : "text-stone-600"
          }`}
        >
          Current Cart ({cartItemCount})
          {cartItemCount > 0 && (
            <span className="ml-1 bg-amber-500 text-emerald-950 text-xs rounded-full px-1.5 py-0.2 font-bold">
              {money(cartSubtotal)}
            </span>
          )}
        </button>
      </div>

      {/* Products Column */}
      <div
        className={`flex-1 min-w-0 bg-white border border-stone-200 rounded-lg p-3 sm:p-4 flex flex-col ${
          mobileTab === "cart" ? "hidden lg:flex" : "flex"
        }`}
        style={{ minHeight: 450 }}
      >
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-2.5 text-stone-400" />
            <input
              className={inputCls + " pl-9 text-sm"}
              placeholder="Search product, SKU or barcode"
              value={posSearch}
              onChange={(e) => setPosSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 shrink-0">
          {posCategories.map((c) => (
            <button
              key={c}
              onClick={() => setPosCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm border whitespace-nowrap transition ${
                posCategory === c
                  ? "bg-emerald-800 text-white border-emerald-800 font-medium"
                  : "border-stone-200 text-stone-600 hover:bg-stone-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-2.5 overflow-y-auto pr-0.5 flex-1 content-start items-start auto-rows-max">
          {posFiltered.map((p) => {
            const tracked = isStockTracked(p);
            const outOfStock = tracked && p.stock <= 0;
            return (
              <button
                key={p.id}
                disabled={outOfStock}
                onClick={() => addToCart(p)}
                className={`text-left border rounded-lg p-2.5 sm:p-3 transition flex flex-col justify-between min-h-[105px] sm:min-h-[115px] ${
                  outOfStock
                    ? "opacity-50 cursor-not-allowed border-stone-100 bg-stone-50"
                    : "border-stone-200 hover:border-emerald-700 hover:shadow-sm bg-white active:scale-[0.98]"
                }`}
              >
                <div>
                  <p className="font-body font-medium text-xs sm:text-sm text-stone-900 leading-snug line-clamp-2">
                    {p.name}
                  </p>
                </div>
                <div className="mt-2 flex items-baseline justify-between gap-1">
                  <p className="font-display font-semibold text-emerald-800 text-sm sm:text-base">{money(p.price)}</p>
                  <div>
                    {!tracked ? (
                      <Badge text="Prepared" tone="indigo" />
                    ) : outOfStock ? (
                      <Badge text="Out" tone="rose" />
                    ) : (
                      <span className="text-[11px] text-stone-400">Stock: {p.stock}</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
          {posFiltered.length === 0 && (
            <p className="col-span-full text-center text-stone-400 text-sm py-10">No products match your search.</p>
          )}
        </div>

        {/* Floating Mobile Sticky Cart Button */}
        {cartItemCount > 0 && (
          <div className="lg:hidden sticky bottom-1 mt-2 pt-2 bg-white border-t border-stone-100">
            <GoldBtn className="w-full justify-between" onClick={() => setMobileTab("cart")}>
              <span className="flex items-center gap-2">
                <ShoppingBag size={18} /> View Cart ({cartItemCount} item{cartItemCount !== 1 && "s"})
              </span>
              <span className="font-semibold text-emerald-950">{money(cartSubtotal)}</span>
            </GoldBtn>
          </div>
        )}
      </div>

      {/* Cart & Checkout Panel */}
      <div
        className={`bg-white border border-stone-200 rounded-lg p-3 sm:p-4 flex flex-col lg:w-96 shrink-0 ${
          mobileTab === "products" ? "hidden lg:flex" : "flex"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileTab("products")}
              className="lg:hidden p-1 text-stone-500 hover:text-stone-800 rounded"
              title="Back to products"
            >
              <ArrowLeft size={18} />
            </button>
            <p className="font-display font-semibold text-stone-800">Current bill</p>
          </div>
          <span className="text-xs text-stone-400 font-medium">
            {cart.length} product{cart.length !== 1 && "s"} ({cartItemCount} unit{cartItemCount !== 1 && "s"})
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 max-h-[350px] lg:max-h-none min-h-[140px]">
          {cart.length === 0 && (
            <div className="text-center py-10">
              <ShoppingBag size={32} className="mx-auto text-stone-300 mb-2" />
              <p className="text-sm text-stone-400">Search and tap a product to add it here.</p>
            </div>
          )}
          {cart.map((i) => (
            <div key={i.productId} className="flex items-center gap-2 border border-stone-100 rounded-md p-2 bg-stone-50/50">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-stone-800 truncate">{i.name}</p>
                <p className="text-xs text-stone-400">{money(i.price)} each</p>
              </div>
              <button
                onClick={() => changeQty(i.productId, -1)}
                className="w-7 h-7 rounded bg-stone-200/70 flex items-center justify-center hover:bg-stone-300 active:scale-95 text-stone-700"
              >
                <Minus size={13} />
              </button>
              <span className="w-5 text-center text-xs sm:text-sm font-semibold">{i.qty}</span>
              <button
                onClick={() => changeQty(i.productId, 1)}
                className="w-7 h-7 rounded bg-stone-200/70 flex items-center justify-center hover:bg-stone-300 active:scale-95 text-stone-700"
              >
                <Plus size={13} />
              </button>
              <span className="w-14 text-right text-xs sm:text-sm font-medium">{money(i.lineTotal)}</span>
              <button onClick={() => removeFromCart(i.productId)} className="text-stone-300 hover:text-rose-600 p-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {cartError && (
          <div className="mt-2 flex items-center gap-1.5 text-rose-600 text-xs bg-rose-50 p-2 rounded border border-rose-200">
            <AlertTriangle size={14} className="shrink-0" />
            {cartError}
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-stone-100">
          <input
            className={inputCls + " text-xs sm:text-sm mb-2"}
            placeholder="Add note (optional)"
            value={cartNote}
            onChange={(e) => setCartNote(e.target.value)}
          />
          <div className="flex justify-between text-xs sm:text-sm text-stone-600 mb-1">
            <span>Subtotal</span>
            <span>{money(cartSubtotal)}</span>
          </div>
          <div className="flex justify-between font-display font-semibold text-base sm:text-lg text-stone-900 mb-3">
            <span>Total</span>
            <span>{money(cartSubtotal)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <Field label="Payment method">
              <input className={inputCls + " text-xs sm:text-sm"} value="Cash" disabled />
            </Field>
            <Field label="Cash received">
              <input
                type="number"
                className={inputCls + " text-xs sm:text-sm"}
                placeholder="0.00"
                value={cashReceivedInput}
                onChange={(e) => {
                  setCashReceivedInput(e.target.value);
                  setCartError("");
                }}
                onWheel={(e) => e.currentTarget.blur()}
              />
            </Field>
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-stone-600 mb-3">
            <span>Change</span>
            <span className="font-semibold text-emerald-800">{money(Math.max(0, change))}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <GhostBtn disabled={cart.length === 0} onClick={holdBill}>
              <PauseCircle size={16} /> Hold bill
            </GhostBtn>
            <GhostBtn disabled={cart.length === 0} onClick={clearCart}>
              Clear
            </GhostBtn>
          </div>
          <GoldBtn className="w-full mt-2 py-2.5" disabled={cart.length === 0 || isCompletingSale} onClick={completeSale}>
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
