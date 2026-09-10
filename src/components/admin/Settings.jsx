import React from "react";
import { Field, inputCls } from "../ui/FormElements";
import { PrimaryBtn } from "../ui/Buttons";

export const Settings = ({ business, setBusiness, showToast }) => (
  <div className="max-w-2xl space-y-4">
    <div className="bg-white border border-stone-200 rounded-lg p-5">
      <p className="font-display font-semibold text-stone-800 mb-4">Business settings</p>
      <div className="grid sm:grid-cols-2 gap-x-4">
        <Field label="Business name">
          <input
            className={inputCls}
            value={business.name}
            onChange={(e) => setBusiness({ ...business, name: e.target.value })}
          />
        </Field>
        <Field label="Currency">
          <input
            className={inputCls}
            value={business.currency}
            onChange={(e) => setBusiness({ ...business, currency: e.target.value })}
          />
        </Field>
        <Field label="Phone">
          <input
            className={inputCls}
            value={business.phone}
            onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
          />
        </Field>
        <Field label="Email">
          <input
            className={inputCls}
            value={business.email}
            onChange={(e) => setBusiness({ ...business, email: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Address">
        <input
          className={inputCls}
          value={business.address}
          onChange={(e) => setBusiness({ ...business, address: e.target.value })}
        />
      </Field>
    </div>
    <div className="bg-white border border-stone-200 rounded-lg p-5">
      <p className="font-display font-semibold text-stone-800 mb-4">Receipt settings</p>
      <Field label="Invoice number prefix">
        <input
          className={inputCls}
          value={business.invoicePrefix}
          onChange={(e) => setBusiness({ ...business, invoicePrefix: e.target.value })}
        />
      </Field>
      <Field label="Receipt header">
        <input
          className={inputCls}
          value={business.receiptHeader}
          onChange={(e) => setBusiness({ ...business, receiptHeader: e.target.value })}
        />
      </Field>
      <Field label="Receipt footer">
        <input
          className={inputCls}
          value={business.receiptFooter}
          onChange={(e) => setBusiness({ ...business, receiptFooter: e.target.value })}
        />
      </Field>
    </div>
    <PrimaryBtn onClick={() => showToast("Settings saved.")}>Save changes</PrimaryBtn>
  </div>
);
