import React from "react";
import { LayoutDashboard, ShoppingCart, ArrowLeft, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Field, inputCls } from "../ui/FormElements";
import { PrimaryBtn } from "../ui/Buttons";

export const LoginScreen = ({
  role,
  loginUsername,
  setLoginUsername,
  loginPassword,
  setLoginPassword,
  showPassword,
  setShowPassword,
  loginError,
  handleLogin,
  goToRoleSelection,
}) => {
  const tone = role === "ADMIN" ? "emerald" : "amber";
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6 font-body">
      <div className="w-full max-w-sm">
        <button
          onClick={goToRoleSelection}
          className="flex items-center gap-1.5 text-stone-500 text-sm mb-6 hover:text-stone-800"
        >
          <ArrowLeft size={15} /> Back to role selection
        </button>
        <div
          className={`w-12 h-12 rounded-xl ${
            tone === "emerald" ? "bg-emerald-800" : "bg-amber-500"
          } flex items-center justify-center mb-5`}
        >
          {role === "ADMIN" ? (
            <LayoutDashboard className="text-white" size={22} />
          ) : (
            <ShoppingCart className="text-emerald-950" size={22} />
          )}
        </div>
        <h2 className="font-display text-2xl font-semibold text-stone-900">
          {role === "ADMIN" ? "Admin login" : "Cashier login"}
        </h2>
        <p className="text-stone-500 text-sm mt-1 mb-6">Sign in to continue to Barakah POS.</p>
        {loginError && (
          <div className="mb-4 flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-md px-3 py-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            {loginError}
          </div>
        )}
        <Field label="Username" required>
          <input
            className={inputCls}
            placeholder={role === "ADMIN" ? "admin" : "john"}
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin(role, loginUsername, loginPassword)}
          />
        </Field>
        <Field label="Password" required>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className={inputCls + " pr-10"}
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin(role, loginUsername, loginPassword)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </Field>
        <div className="flex items-center justify-between mb-5 text-sm">
          <label className="flex items-center gap-2 text-stone-600">
            <input type="checkbox" className="rounded border-stone-300" /> Remember me
          </label>
          <button className="text-emerald-800 hover:underline">Forgot password?</button>
        </div>
        <PrimaryBtn className="w-full" onClick={() => handleLogin(role, loginUsername, loginPassword)}>
          Log in
        </PrimaryBtn>
        <p className="text-stone-400 text-xs mt-4 text-center">
          Demo login: username "{role === "ADMIN" ? "admin" : "john"}" & password "{role === "ADMIN" ? "admin123" : "john123"}".
        </p>
      </div>
    </div>
  );
};
