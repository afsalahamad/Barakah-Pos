import React from "react";
import { Pencil, LogOut } from "lucide-react";
import { Field, inputCls } from "../ui/FormElements";
import { PrimaryBtn, GhostBtn, DangerBtn } from "../ui/Buttons";

export const ProfileView = ({
  currentUser,
  profileEditing,
  setProfileEditing,
  showToast,
  requestLogout,
}) => (
  <div className="max-w-md bg-white border border-stone-200 rounded-lg p-6">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-16 h-16 rounded-full bg-emerald-800 text-white flex items-center justify-center text-2xl font-display font-semibold">
        {currentUser?.name?.[0]}
      </div>
      <div>
        <p className="font-display font-semibold text-lg text-stone-900">{currentUser?.name}</p>
        <p className="text-stone-400 text-sm">{currentUser?.role === "ADMIN" ? "Admin" : "Cashier"}</p>
      </div>
    </div>
    <Field label="Name">
      <input className={inputCls} defaultValue={currentUser?.name} disabled={!profileEditing} />
    </Field>
    <Field label="Username / email">
      <input className={inputCls} defaultValue={currentUser?.username} disabled={!profileEditing} />
    </Field>
    {profileEditing && (
      <Field label="New password">
        <input type="password" className={inputCls} placeholder="••••••••" />
      </Field>
    )}
    <div className="flex gap-2 mt-4">
      {profileEditing ? (
        <>
          <PrimaryBtn
            onClick={() => {
              setProfileEditing(false);
              showToast("Profile updated.");
            }}
          >
            Save changes
          </PrimaryBtn>
          <GhostBtn onClick={() => setProfileEditing(false)}>Cancel</GhostBtn>
        </>
      ) : (
        <GhostBtn onClick={() => setProfileEditing(true)}>
          <Pencil size={15} /> Edit profile
        </GhostBtn>
      )}
      <DangerBtn className="ml-auto" onClick={requestLogout}>
        <LogOut size={15} /> Logout
      </DangerBtn>
    </div>
  </div>
);
