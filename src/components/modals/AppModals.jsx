import React from "react";
import { Printer, Plus, Trash2, Truck, Receipt, FileCheck, Package } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Field, inputCls } from "../ui/FormElements";
import { PrimaryBtn, GhostBtn, DangerBtn, GoldBtn } from "../ui/Buttons";
import { CATEGORIES, EXPENSE_CATEGORIES } from "../../data/seedData";
import { money, fmtDate, fmtTime } from "../../utils/helpers";
import logoImg from "../../logo/Barakah-Pos-Logo.png";

export const AppModals = ({
  modal,
  setModal,
  doLogout,
  saveProduct,
  deactivateProduct,
  applyStockAdjust,
  saveUser,
  toggleUserStatus,
  removeHeldBill,
  products,
  business,
  createGrn,
  createExpense,
}) => {
  if (!modal) return null;

  if (modal.type === "confirmLogout")
    return (
      <Modal
        title="You have an active bill"
        onClose={() => setModal(null)}
        footer={
          <>
            <GhostBtn onClick={() => setModal(null)}>Cancel</GhostBtn>
            <DangerBtn onClick={doLogout}>Logout and discard</DangerBtn>
          </>
        }
      >
        <p className="text-stone-600 text-sm">
          Are you sure you want to logout? The bill currently in progress has not been saved and will be discarded.
        </p>
      </Modal>
    );

  if (modal.type === "productForm") {
    const d = modal.data;
    const set = (k, v) => setModal({ ...modal, data: { ...d, [k]: v } });
    return (
      <Modal
        title={modal.mode === "add" ? "Add product" : "Edit product"}
        onClose={() => setModal(null)}
        wide
        footer={
          <>
            <GhostBtn onClick={() => setModal(null)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={saveProduct}>Save product</PrimaryBtn>
          </>
        }
      >
        <div className="grid sm:grid-cols-2 gap-x-4">
          <Field label="Product name" required>
            <input className={inputCls} value={d.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Category">
            <select className={inputCls} value={d.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="SKU">
            <input className={inputCls} value={d.sku} onChange={(e) => set("sku", e.target.value)} />
          </Field>
          <Field label="Barcode">
            <input className={inputCls} value={d.barcode} onChange={(e) => set("barcode", e.target.value)} />
          </Field>
          <Field label="Inventory Tracking" required>
            <select
              className={inputCls}
              value={d.inventoryType || "STOCK_TRACKED"}
              onChange={(e) => set("inventoryType", e.target.value)}
            >
              <option value="STOCK_TRACKED">Stock Tracked (Physical Inventory)</option>
              <option value="NON_STOCK">Non-Stock / Prepared (On-Demand)</option>
            </select>
          </Field>
          <Field label="Selling price" required>
            <input type="number" className={inputCls} value={d.price} onChange={(e) => set("price", e.target.value)} />
          </Field>
          <Field label="Cost price">
            <input type="number" className={inputCls} value={d.cost} onChange={(e) => set("cost", e.target.value)} />
          </Field>
          {(d.inventoryType || "STOCK_TRACKED") === "STOCK_TRACKED" && (
            <>
              <Field label="Current Stock" required>
                <input type="number" className={inputCls} value={d.stock} onChange={(e) => set("stock", e.target.value)} />
              </Field>
              <Field label="Low stock threshold">
                <input
                  type="number"
                  className={inputCls}
                  value={d.lowStockThreshold}
                  onChange={(e) => set("lowStockThreshold", e.target.value)}
                />
              </Field>
              <Field label="Unit">
                <input className={inputCls} value={d.unit} onChange={(e) => set("unit", e.target.value)} />
              </Field>
            </>
          )}
          <Field label="Status">
            <select className={inputCls} value={d.status} onChange={(e) => set("status", e.target.value)}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </Field>
        </div>
        <Field label="Description">
          <textarea
            className={inputCls}
            rows={2}
            value={d.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>
      </Modal>
    );
  }

  if (modal.type === "confirmDeactivateProduct") {
    const activating = modal.product.status !== "Active";
    return (
      <Modal
        title={activating ? "Activate product" : "Deactivate product"}
        onClose={() => setModal(null)}
        footer={
          <>
            <GhostBtn onClick={() => setModal(null)}>Cancel</GhostBtn>
            <DangerBtn onClick={deactivateProduct}>Confirm</DangerBtn>
          </>
        }
      >
        <p className="text-stone-600 text-sm">
          Are you sure you want to {activating ? "activate" : "deactivate"} <strong>{modal.product.name}</strong>?{" "}
          {!activating && "It will no longer appear in the cashier POS."}
        </p>
      </Modal>
    );
  }

  if (modal.type === "stockAdjust") {
    const { product, adjType, qty, reason } = modal;
    return (
      <Modal
        title={`Adjust stock — ${product.name}`}
        onClose={() => setModal(null)}
        footer={
          <>
            <GhostBtn onClick={() => setModal(null)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={applyStockAdjust}>Confirm</PrimaryBtn>
          </>
        }
      >
        <p className="text-sm text-stone-500 mb-3">
          Current stock: <strong>{product.stock} {product.unit}</strong>
        </p>
        <Field label="Adjustment type">
          <select
            className={inputCls}
            value={adjType}
            onChange={(e) => setModal({ ...modal, adjType: e.target.value })}
          >
            <option>Add Stock</option>
            <option>Remove Stock</option>
            <option>Correction</option>
          </select>
        </Field>
        <Field label={adjType === "Correction" ? "New stock quantity" : "Quantity"} required>
          <input
            type="number"
            className={inputCls}
            value={qty}
            onChange={(e) => setModal({ ...modal, qty: e.target.value })}
          />
        </Field>
        <Field label="Reason" required>
          <input
            className={inputCls}
            value={reason}
            onChange={(e) => setModal({ ...modal, reason: e.target.value })}
            placeholder="e.g. New delivery, damaged goods"
          />
        </Field>
      </Modal>
    );
  }

  if (modal.type === "userForm") {
    const d = modal.data;
    const set = (k, v) => setModal({ ...modal, data: { ...d, [k]: v } });
    return (
      <Modal
        title={modal.mode === "add" ? "Add user" : "Edit user"}
        onClose={() => setModal(null)}
        footer={
          <>
            <GhostBtn onClick={() => setModal(null)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={saveUser}>Save user</PrimaryBtn>
          </>
        }
      >
        <Field label="Full name" required>
          <input className={inputCls} value={d.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Username / email" required>
          <input className={inputCls} value={d.username} onChange={(e) => set("username", e.target.value)} />
        </Field>
        <Field label="Role">
          <select className={inputCls} value={d.role} onChange={(e) => set("role", e.target.value)}>
            <option>ADMIN</option>
            <option>CASHIER</option>
          </select>
        </Field>
        <Field label="Status">
          <select className={inputCls} value={d.status} onChange={(e) => set("status", e.target.value)}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </Field>
        {modal.mode === "add" && (
          <Field label="Temporary password" required>
            <input type="password" className={inputCls} placeholder="••••••••" />
          </Field>
        )}
      </Modal>
    );
  }

  if (modal.type === "confirmDeactivateUser") {
    const activating = modal.user.status !== "Active";
    return (
      <Modal
        title={activating ? "Activate user" : "Deactivate user"}
        onClose={() => setModal(null)}
        footer={
          <>
            <GhostBtn onClick={() => setModal(null)}>Cancel</GhostBtn>
            <DangerBtn onClick={toggleUserStatus}>Confirm</DangerBtn>
          </>
        }
      >
        <p className="text-stone-600 text-sm">
          Are you sure you want to {activating ? "activate" : "deactivate"} <strong>{modal.user.name}</strong>?{" "}
          {!activating && "They will no longer be able to log in. Their transaction history will remain unchanged."}
        </p>
      </Modal>
    );
  }

  if (modal.type === "confirmCancelHeld")
    return (
      <Modal
        title="Remove held bill"
        onClose={() => setModal(null)}
        footer={
          <>
            <GhostBtn onClick={() => setModal(null)}>Cancel</GhostBtn>
            <DangerBtn onClick={removeHeldBill}>Remove</DangerBtn>
          </>
        }
      >
        <p className="text-stone-600 text-sm">
          Are you sure you want to remove <strong>{modal.bill.holdReference}</strong>? This cannot be undone.
        </p>
      </Modal>
    );

  if (modal.type === "stockShortage")
    return (
      <Modal title="Stock has changed" onClose={() => setModal(null)} footer={<GhostBtn onClick={() => setModal(null)}>Close</GhostBtn>}>
        <p className="text-stone-600 text-sm mb-3">Stock levels changed while this bill was on hold. Adjust the cart before resuming.</p>
        <div className="space-y-1.5">
          {modal.shortages.map((s, i) => {
            const p = products.find((pp) => pp.id === s.productId);
            return (
              <div key={i} className="text-sm flex justify-between border-b border-stone-100 pb-1.5">
                <span>{s.name}</span>
                <span className="text-rose-600">
                  Requested {s.qty}, available {p?.stock ?? 0}
                </span>
              </div>
            );
          })}
        </div>
      </Modal>
    );

  if (modal.type === "transactionDetail" || modal.type === "saleSuccess") {
    const t = modal.txn;
    const isSuccess = modal.type === "saleSuccess";
    const paperWidth = business.receiptPaperWidth || "80mm";
    return (
      <Modal
        title={
          <span className="flex items-center justify-between w-full pr-6">
            <span>{isSuccess ? "Sale completed successfully." : `Invoice ${t.invoiceNumber}`}</span>
            <span className="text-xs font-normal text-stone-400 font-body">
              {paperWidth} thermal · F9 to print
            </span>
          </span>
        }
        onClose={() => setModal(null)}
        footer={
          <>
            {isSuccess ? (
              <>
                <GhostBtn onClick={() => setModal(null)}>New bill</GhostBtn>
                <PrimaryBtn onClick={() => window.print()}>
                  <Printer size={15} /> Print bill (F9)
                </PrimaryBtn>
              </>
            ) : (
              <>
                <GhostBtn onClick={() => setModal(null)}>Close</GhostBtn>
                <PrimaryBtn onClick={() => window.print()}>
                  <Printer size={15} /> Print (F9)
                </PrimaryBtn>
              </>
            )}
          </>
        }
      >
        <div className="receipt-print">
          <div className="text-center mb-4">
            <img src={logoImg} alt="Logo" className="w-12 h-12 object-contain mx-auto mb-1" />
            <p className="font-display font-bold text-lg">{business.name}</p>
            <p className="text-xs text-stone-500">{business.address}</p>
            <p className="text-xs text-stone-500">
              {business.phone} · {business.email}
            </p>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-stone-500">Invoice</span>
            <span className="font-medium">{t.invoiceNumber}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-stone-500">Date</span>
            <span>
              {fmtDate(t.createdAt)}, {fmtTime(t.createdAt)}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-stone-500">Cashier</span>
            <span>{t.cashierName}</span>
          </div>
          <div className="border-t border-b border-stone-200 py-2 my-2">
            {t.items.map((i, idx) => (
              <div key={idx} className="flex justify-between text-sm py-1">
                <span>
                  {i.name} × {i.qty}
                </span>
                <span>{money(i.lineTotal)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Subtotal</span>
            <span>{money(t.subtotal)}</span>
          </div>
          <div className="flex justify-between font-display font-semibold text-base mb-2">
            <span>Grand total</span>
            <span>{money(t.total)}</span>
          </div>
          <div className="flex justify-between text-sm text-stone-500">
            <span>Payment method</span>
            <span>{t.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-sm text-stone-500">
            <span>Cash received</span>
            <span>{money(t.cashReceived)}</span>
          </div>
          <div className="flex justify-between text-sm text-stone-500 mb-2">
            <span>Change</span>
            <span>{money(t.change)}</span>
          </div>
          {t.notes && <p className="text-xs text-stone-400 italic mb-2">Note: {t.notes}</p>}
          <p className="text-center text-xs text-stone-400 mt-4">{business.receiptFooter}</p>
        </div>
      </Modal>
    );
  }

  if (modal.type === "grnForm") {
    const d = modal.data;
    const stockTrackedProducts = products.filter(
      (p) => (p.inventoryType || "STOCK_TRACKED") === "STOCK_TRACKED"
    );
    const setHeader = (k, v) => setModal({ ...modal, data: { ...d, [k]: v } });
    const updateItem = (idx, k, v) => {
      const newItems = [...d.items];
      newItems[idx] = { ...newItems[idx], [k]: v };
      if (k === "productId") {
        const prod = products.find((p) => p.id === v);
        if (prod) {
          newItems[idx].name = prod.name;
          newItems[idx].unitCost = prod.cost || 0;
        }
      }
      setModal({ ...modal, data: { ...d, items: newItems } });
    };
    const addItem = () => {
      const defaultProd = stockTrackedProducts[0] || products[0];
      setModal({
        ...modal,
        data: {
          ...d,
          items: [
            ...d.items,
            {
              productId: defaultProd?.id || "",
              name: defaultProd?.name || "",
              receivedQty: 1,
              unitCost: defaultProd?.cost || 0,
            },
          ],
        },
      });
    };
    const removeItem = (idx) => {
      if (d.items.length <= 1) return;
      setModal({ ...modal, data: { ...d, items: d.items.filter((_, i) => i !== idx) } });
    };

    const grnTotalCost = d.items.reduce(
      (s, it) => s + (+it.receivedQty || 0) * (+it.unitCost || 0),
      0
    );

    return (
      <Modal
        title="Create Goods Received Note (GRN)"
        onClose={() => setModal(null)}
        wide
        footer={
          <>
            <GhostBtn onClick={() => setModal(null)}>Cancel</GhostBtn>
            <GoldBtn onClick={() => createGrn(d)}>
              <FileCheck size={16} /> Complete & Receive Stock
            </GoldBtn>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Supplier Name" required>
              <input
                className={inputCls}
                placeholder="e.g. Al-Barakah Global Dist."
                value={d.supplier}
                onChange={(e) => setHeader("supplier", e.target.value)}
              />
            </Field>
            <Field label="Supplier Ref / Invoice #">
              <input
                className={inputCls}
                placeholder="e.g. SUP-INV-9901"
                value={d.supplierRef}
                onChange={(e) => setHeader("supplierRef", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Notes / Reference Details">
            <input
              className={inputCls}
              placeholder="e.g. Shipment delivered via express cargo."
              value={d.notes}
              onChange={(e) => setHeader("notes", e.target.value)}
            />
          </Field>

          {/* Line Items Table */}
          <div className="border border-stone-200 rounded-lg p-3 bg-stone-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-display font-semibold text-sm text-stone-800">Received Products</p>
              <GhostBtn onClick={addItem} className="text-xs py-1 px-2.5">
                <Plus size={14} /> Add Row
              </GhostBtn>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {d.items.map((it, idx) => {
                const selectedProd = products.find((p) => p.id === it.productId);
                const lineTotal = (+it.receivedQty || 0) * (+it.unitCost || 0);
                return (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 border border-stone-200 rounded-md text-xs"
                  >
                    <div className="col-span-4">
                      <label className="text-[10px] text-stone-400 block mb-0.5">Product</label>
                      <select
                        className={inputCls + " text-xs py-1"}
                        value={it.productId}
                        onChange={(e) => updateItem(idx, "productId", e.target.value)}
                      >
                        {stockTrackedProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (Stock: {p.stock})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-[10px] text-stone-400 block mb-0.5">Current</span>
                      <span className="font-medium text-stone-700">{selectedProd?.stock ?? 0}</span>
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] text-stone-400 block mb-0.5">Qty Recvd</label>
                      <input
                        type="number"
                        min="1"
                        className={inputCls + " text-xs py-1 text-center font-medium"}
                        value={it.receivedQty}
                        onChange={(e) => updateItem(idx, "receivedQty", e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] text-stone-400 block mb-0.5">Unit Cost</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className={inputCls + " text-xs py-1 text-right"}
                        value={it.unitCost}
                        onChange={(e) => updateItem(idx, "unitCost", e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 flex items-center justify-between pl-1">
                      <div>
                        <span className="text-[10px] text-stone-400 block mb-0.5">Total</span>
                        <span className="font-semibold text-emerald-800">{money(lineTotal)}</span>
                      </div>
                      {d.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="text-stone-300 hover:text-rose-600 p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-stone-200 font-display font-semibold text-sm">
              <span>Total GRN Value</span>
              <span className="text-emerald-900 text-base">{money(grnTotalCost)}</span>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  if (modal.type === "grnDetails") {
    const g = modal.grn;
    return (
      <Modal
        title={`GRN Details — ${g.grnNumber}`}
        onClose={() => setModal(null)}
        wide
        footer={<GhostBtn onClick={() => setModal(null)}>Close</GhostBtn>}
      >
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 border border-stone-200 rounded-lg p-3">
            <div>
              <p className="text-xs text-stone-400">Supplier</p>
              <p className="font-medium text-stone-900">{g.supplier}</p>
            </div>
            <div>
              <p className="text-xs text-stone-400">Supplier Invoice / Ref</p>
              <p className="font-mono text-stone-700">{g.supplierRef || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-stone-400">Received Date</p>
              <p className="text-stone-800">{new Date(g.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-stone-400">Created By</p>
              <p className="text-stone-800">{g.createdBy}</p>
            </div>
          </div>

          {g.notes && (
            <p className="text-xs text-stone-500 italic bg-amber-50/50 p-2.5 rounded border border-amber-100">
              Note: {g.notes}
            </p>
          )}

          <div>
            <p className="font-display font-semibold text-stone-800 mb-2">Received Product Items</p>
            <div className="border border-stone-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 border-b border-stone-200 font-medium text-stone-600">
                  <tr>
                    <th className="p-2.5">Product Name</th>
                    <th className="p-2.5 text-center">Qty Received</th>
                    <th className="p-2.5 text-right">Unit Purchase Cost</th>
                    <th className="p-2.5 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {g.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-medium text-stone-900">{it.name}</td>
                      <td className="p-2.5 text-center font-bold text-emerald-800">+{it.receivedQty}</td>
                      <td className="p-2.5 text-right text-stone-600">{money(it.unitCost)}</td>
                      <td className="p-2.5 text-right font-medium text-stone-900">{money(it.lineTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <span className="font-medium text-emerald-900">Grand Total Purchase Cost</span>
            <span className="font-display font-bold text-lg text-emerald-950">{money(g.totalCost)}</span>
          </div>
        </div>
      </Modal>
    );
  }

  if (modal.type === "expenseForm") {
    const d = modal.data;
    const set = (k, v) => setModal({ ...modal, data: { ...d, [k]: v } });
    return (
      <Modal
        title="Add Operational Expense"
        onClose={() => setModal(null)}
        footer={
          <>
            <GhostBtn onClick={() => setModal(null)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={() => createExpense(d)}>Save Expense</PrimaryBtn>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="Category" required>
            <select className={inputCls} value={d.category} onChange={(e) => set("category", e.target.value)}>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </Field>
          <Field label={`Amount (${business.currency || "USD"})`} required>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className={inputCls}
              placeholder="0.00"
              value={d.amount}
              onChange={(e) => set("amount", e.target.value)}
            />
          </Field>
          <Field label="Note / Description">
            <input
              className={inputCls}
              placeholder="e.g. Paid delivery driver for customer order #104"
              value={d.note}
              onChange={(e) => set("note", e.target.value)}
            />
          </Field>
        </div>
      </Modal>
    );
  }

  return null;
};
