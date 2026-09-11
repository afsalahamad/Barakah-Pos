import React, { useState } from "react";
import { Field, inputCls } from "../ui/FormElements";
import { PrimaryBtn, GhostBtn } from "../ui/Buttons";
import { isSupabaseConfigured, seedSupabaseDatabase } from "../../services/supabaseService";
import { Database, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

export const Settings = ({ business, setBusiness, showToast }) => {
  const [seeding, setSeeding] = useState(false);
  const isConnected = isSupabaseConfigured();

  const handleSeed = async () => {
    setSeeding(true);
    const res = await seedSupabaseDatabase();
    setSeeding(false);
    showToast(res.message);
  };

  return (
    <div className="max-w-2xl space-y-4 font-body">
      {/* Supabase Cloud Connection Box */}
      <div className="bg-white border border-stone-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Database className="text-amber-600" size={20} />
            <p className="font-display font-semibold text-stone-800">Supabase Cloud Database</p>
          </div>
          {isConnected ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle size={13} /> Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
              <AlertCircle size={13} /> Demo / Local Mode
            </span>
          )}
        </div>

        <p className="text-xs text-stone-600 mb-4">
          {isConnected
            ? "Your Barakah-POS application is connected to your Supabase Cloud Database. Changes to products, sales, and expenses are saved directly to the cloud."
            : "To connect your live Supabase database, open `.env` file in the project folder and paste your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`."}
        </p>

        {isConnected && (
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">Seed initial demo products to your Supabase database</span>
            <GhostBtn onClick={handleSeed} disabled={seeding}>
              <RefreshCw size={14} className={seeding ? "animate-spin" : ""} />
              {seeding ? "Seeding..." : "Seed Database"}
            </GhostBtn>
          </div>
        )}
      </div>

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
};

