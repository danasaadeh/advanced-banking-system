"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type {
  AccountGroupResponse,
  Account,
} from "@/features/account-management/types/accounts.data";
import {
  User,
  DollarSign,
  CreditCard,
  Calendar,
  CheckCircle,
  Layers,
} from "lucide-react";

interface Props {
  account: AccountGroupResponse | undefined;
  open: boolean;
  setOpen: (val: boolean) => void;
}

const AccountDetailsDialog: React.FC<Props> = ({ account, open, setOpen }) => {
  if (!account?.data) return null;

  const acc = account.data;

  const renderUsers = (users: Account["users"]) => (
    <ul className="pl-4 list-disc">
      {users.map((user) => (
        <li key={user.id} className="text-sm flex items-center gap-1">
          <User className="w-4 h-4 text-blue-500" />
          {user.name} ({user.email}){" "}
          {user.is_owner && (
            <span className="font-semibold text-green-600">- Owner</span>
          )}
        </li>
      ))}
    </ul>
  );

  const renderChildren = (children: Account["children"]) => (
    <ul className="pl-4 list-disc space-y-1">
      {children.map((child) => (
        <li key={child.id} className="border-l-2 border-gray-300 pl-3 py-1">
          <p className="text-sm font-semibold flex items-center gap-1">
            <Layers className="w-4 h-4 text-purple-500" />
            <span className="truncate max-w-[200px]">
              {child.account_number}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs">
              {child.account_type.name}
            </span>
          </p>
          <p className="text-xs flex items-center gap-2">
            <DollarSign className="w-3 h-3 text-green-500" />
            Balance:{" "}
            <span className="font-medium">
              {child.balance} {child.currency}
            </span>{" "}
            | Status:{" "}
            <span
              className={`font-semibold ${
                child.current_state.state === "active"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {child.current_state.state}
            </span>
          </p>
          {child.users.length > 0 && (
            <div className="mt-1">{renderUsers(child.users)}</div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogTitle className="text-lg font-bold mb-4 text-gray-700">
          Account Details
        </DialogTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Basic Info */}
          <div className="space-y-2 p-4 border rounded-lg bg-gray-50">
            <p className="flex items-start gap-1">
              <span className="font-semibold">Account Number:</span>
              <span className=" font-sans  truncate max-w-[180px]">
                {acc.account_number}
              </span>
            </p>
            <p className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="font-semibold">Type:</span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                {acc.account_type?.name}
              </span>
            </p>
            <p className="text-sm text-gray-500 pl-5">
              {acc.account_type?.description}
            </p>
            <p className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="font-semibold">Balance:</span>
              <span className="ml-1 font-medium text-green-700">
                {acc.balance} {acc.currency}
              </span>
            </p>
            <p className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              <span className="font-semibold">Status:</span>
              <span
                className={`ml-1 font-semibold ${
                  acc.current_state.state === "active"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {acc.current_state.state}
              </span>
            </p>
            <p className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="font-semibold">Created At:</span>{" "}
              {acc.created_at}
            </p>
            <p className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="font-semibold">Updated At:</span>{" "}
              {acc.updated_at || "-"}
            </p>
          </div>

          {/* Users */}
          <div className="space-y-2 p-4 border rounded-lg bg-gray-50">
            <p className="font-semibold flex items-center gap-1">
              <User className="w-4 h-4 text-blue-500" /> Users
            </p>
            {acc.users.length > 0 ? (
              renderUsers(acc.users)
            ) : (
              <p className="text-sm text-gray-500">No users</p>
            )}
          </div>

          {/* Features */}
          <div className="col-span-1 sm:col-span-2 p-4 border rounded-lg bg-gray-50">
            <p className="font-semibold mb-1 flex items-center gap-1">
              <Layers className="w-4 h-4 text-purple-500" /> Features
            </p>
            {acc.features.length > 0 ? (
              <pre className="text-xs bg-gray-100 p-2 rounded-lg overflow-auto">
                {JSON.stringify(acc.features, null, 2)}
              </pre>
            ) : (
              <p className="text-sm text-gray-500">No features</p>
            )}
          </div>

          {/* Children */}
          <div className="col-span-1 sm:col-span-2 p-4 border rounded-lg bg-gray-50">
            <p className="font-semibold mb-1 flex items-center gap-1">
              <Layers className="w-4 h-4 text-purple-500" /> Children Accounts
            </p>
            {acc.children.length > 0 ? (
              renderChildren(acc.children)
            ) : (
              <p className="text-sm text-gray-500">No child accounts</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountDetailsDialog;
