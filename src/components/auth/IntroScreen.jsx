import React from "react";
import { ChevronRight } from "lucide-react";
import { PrimaryBtn } from "../ui/Buttons";
import logoImg from "../../logo/Barakah-Pos-Logo.png";

export const IntroScreen = ({ onGetStarted }) => (
  <div className="min-h-screen bg-emerald-950 flex items-center justify-center relative overflow-hidden font-body">
    <div
      className="absolute inset-0"
      style={{
        opacity: 0.06,
        backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
        backgroundSize: "26px 26px",
      }}
    />
    <div className="relative z-10 text-center px-6 max-w-md">
      <img
        src={logoImg}
        alt="Barakah POS Logo"
        className="mx-auto w-24 h-24 object-contain rounded-2xl mb-6 bg-white/90 p-2 shadow-lg"
      />
      <h1 className="font-display text-4xl font-bold text-white tracking-tight">Barakah POS</h1>
      <p className="text-amber-400 font-medium mt-2">Simple, fast and professional billing for your business.</p>
      <p className="text-emerald-200/70 text-sm mt-3">
        Welcome to Barakah Mart's counter system — built for a calm, unhurried checkout.
      </p>
      <PrimaryBtn
        className="mt-8 mx-auto bg-amber-500 text-emerald-950 hover:bg-amber-400 px-8 py-3"
        onClick={onGetStarted}
      >
        Get started <ChevronRight size={18} />
      </PrimaryBtn>
      <p className="text-emerald-300/40 text-xs mt-8">Version 1.0</p>
    </div>
  </div>
);
