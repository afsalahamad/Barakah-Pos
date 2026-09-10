import React from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { fmtDate } from "../../utils/helpers";
import { inputCls } from "../ui/FormElements";
import { PrimaryBtn } from "../ui/Buttons";
import { EmptyState } from "../ui/EmptyState";
import { Badge } from "../ui/Badge";
import { Th, Td } from "../ui/TableElements";

export const Users = ({
  users,
  userSearch,
  setUserSearch,
  openUserForm,
  confirmDeactivateUser,
}) => {
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
      <div className="p-4 flex flex-wrap gap-3 items-center justify-between border-b border-stone-100">
        <div className="relative max-w-xs flex-1" style={{ minWidth: 220 }}>
          <Search size={16} className="absolute left-3 top-2.5 text-stone-400" />
          <input
            className={inputCls + " pl-9"}
            placeholder="Search name or email"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
        </div>
        <PrimaryBtn onClick={() => openUserForm("add")}>
          <Plus size={16} /> Add user
        </PrimaryBtn>
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          title="No users created yet."
          action={
            <PrimaryBtn onClick={() => openUserForm("add")}>
              <Plus size={16} /> Add user
            </PrimaryBtn>
          }
        />
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              <Th>Name</Th>
              <Th>Username / email</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Created</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-stone-50 hover:bg-stone-50">
                <Td className="font-medium text-stone-900">{u.name}</Td>
                <Td>{u.username}</Td>
                <Td>{u.role}</Td>
                <Td>
                  <Badge text={u.status} />
                </Td>
                <Td>{fmtDate(u.createdAt)}</Td>
                <Td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openUserForm("edit", u)}
                      className="text-stone-400 hover:text-emerald-800"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => confirmDeactivateUser(u)}
                      className="text-stone-400 hover:text-rose-600"
                      title={u.status === "Active" ? "Deactivate" : "Activate"}
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
