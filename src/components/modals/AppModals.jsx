import React from "react";
import { Printer } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Field, inputCls } from "../ui/FormElements";
import { PrimaryBtn, GhostBtn, DangerBtn } from "../ui/Buttons";
import { CATEGORIES } from "../../data/seedData";
import { money, fmtDate, fmtTime } from "../../utils/helpers";

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
          <Field label="Selling price" required>
            <input type="number" className={inputCls} value={d.price} onChange={(e) => set("price", e.target.value)} />
          </Field>
          <Field label="Cost price">
            <input type="number" className={inputCls} value={d.cost} onChange={(e) => set("cost", e.target.value)} />
          </Field>
          <Field label="Stock" required>
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
    return (
      <Modal
        title={isSuccess ? "Sale completed successfully." : `Invoice ${t.invoiceNumber}`}
        onClose={() => setModal(null)}
        footer={
          <>
            {isSuccess ? (
              <>
                <GhostBtn onClick={() => setModal(null)}>New bill</GhostBtn>
                <PrimaryBtn onClick={() => window.print()}>
                  <Printer size={15} /> Print bill
                </PrimaryBtn>
              </>
            ) : (
              <>
                <GhostBtn onClick={() => setModal(null)}>Close</GhostBtn>
                <PrimaryBtn onClick={() => window.print()}>
                  <Printer size={15} /> Print / Reprint
                </PrimaryBtn>
              </>
            )}
          </>
        }
      >
        <div className="receipt-print">
          <div className="text-center mb-4">
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

  return null;
};
