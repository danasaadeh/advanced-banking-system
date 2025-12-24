"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Wallet,
  Users,
  UserCircle,
  Coins,
  ArrowUpRight,
  PlusCircle,
  Loader2,
} from "lucide-react";

import type {
  CreateAccountPayload,
  Account,
  User,
  AccountType,
} from "@/features/account-management/types/accounts.data";
import { CURRENCIES } from "../utilites";

interface AccountCreationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  parentAccount: Account | null;
  value: CreateAccountPayload;
  onChange: (value: CreateAccountPayload) => void;
  onConfirm: (payload: CreateAccountPayload) => void;
  users: User[];
  accountTypes: AccountType[];
  loading?: boolean;
}

const AccountCreationDialog: React.FC<AccountCreationDialogProps> = ({
  open,
  setOpen,
  parentAccount,
  value,
  onChange,
  onConfirm,
  users,
  accountTypes,
  loading,
}) => {
  const owner = users.find((u) => u.id === value.owner_user_id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl w-full max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
        {/* Header */}
        <div className="bg-primary p-5 text-primary-foreground">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <PlusCircle size={20} />
              </div>
              <DialogTitle className="text-lg font-bold">
                {parentAccount ? "Add Sub-Account" : "New Root Account"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-primary-foreground/80 text-xs mt-1">
              Fill in the details to establish the new account.
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 px-5 py-4">
          <div className="flex flex-col gap-4 pb-4">
            {/* Account Type */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                <Wallet size={12} /> Account Type
              </Label>
              <select
                className="w-full h-9 bg-muted/50 border-none rounded-lg px-3 text-xs focus:ring-2 focus:ring-primary"
                value={value.account_type_id}
                onChange={(e) =>
                  onChange({
                    ...value,
                    account_type_id: Number(e.target.value),
                  })
                }
              >
                <option value="">Select type...</option>
                {accountTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Currency & Deposit */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                  <Coins size={12} /> Currency
                </Label>
                <select
                  className="w-full h-9 bg-muted/50 border-none rounded-lg px-3 text-xs focus:ring-2 focus:ring-primary"
                  value={value.currency}
                  onChange={(e) =>
                    onChange({ ...value, currency: e.target.value })
                  }
                >
                  <option value="">Select currency...</option>
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                  <ArrowUpRight size={12} /> Deposit
                </Label>
                <Input
                  type="number"
                  className="rounded-lg border-none bg-muted/50 h-9 text-xs"
                  placeholder="0.00"
                  value={value.initial_deposit}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      initial_deposit: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            {/* Account Owner */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                <UserCircle size={12} /> Account Owner
              </Label>
              <select
                className="w-full h-9 bg-muted/50 border-none rounded-lg px-3 text-xs focus:ring-2 focus:ring-primary"
                value={value.owner_user_id}
                onChange={(e) =>
                  onChange({
                    ...value,
                    owner_user_id: Number(e.target.value),
                    user_ids: e.target.value ? [Number(e.target.value)] : [],
                  })
                }
              >
                <option value="">Select owner</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned User (Owner Only) */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                <Users size={12} /> Assigned User
              </Label>

              <div className="border rounded-xl bg-muted/10 p-2">
                {owner ? (
                  <div className="flex items-center gap-2.5 p-2 rounded-md bg-primary/10 border border-primary/20">
                    <Checkbox checked disabled className="h-3.5 w-3.5" />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium leading-tight">
                        {owner.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {owner.email}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 text-xs text-muted-foreground text-center">
                    Select an account owner to assign
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="p-5 bg-background border-t">
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              className="flex-1 rounded-lg h-10 text-xs"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-[2] rounded-lg h-10 text-xs shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              onClick={() =>
                onConfirm({
                  ...value,
                  parent_account_id: parentAccount?.id ?? null,
                  user_ids: value.owner_user_id ? [value.owner_user_id] : [],
                })
              }
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountCreationDialog;
