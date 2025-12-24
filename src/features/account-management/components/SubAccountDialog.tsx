"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { PlusCircle, ChevronRight, Loader2, Users } from "lucide-react";

import type {
  CreateAccountPayload,
  Account,
  User,
  AccountType,
} from "../types/accounts.data";

interface SubAccountDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  parentAccount: Account;
  value: CreateAccountPayload;
  onChange: (value: CreateAccountPayload) => void;
  onConfirm: (payload: CreateAccountPayload) => void;
  users: User[];
  accountTypes: AccountType[];
  loading?: boolean;
}

const SubAccountDialog: React.FC<SubAccountDialogProps> = ({
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
  const payload: CreateAccountPayload = {
    ...value,
    parent_account_id: parentAccount.id,
    currency: parentAccount.currency,
  };

  const owner = users.find((u) => u.id === payload.owner_user_id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl w-full p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-background">
        {/* Header */}
        <div className="bg-black dark:bg-zinc-800 p-5 text-white">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <PlusCircle size={18} className="text-primary" />
              <DialogTitle className="text-lg font-bold">
                Create Sub-Account
              </DialogTitle>
            </div>

            <div className="flex items-center gap-2 mt-2 py-1 px-3 bg-white/5 rounded-lg w-fit border border-white/10">
              <span className="text-[9px] uppercase text-zinc-400 font-bold">
                Parent
              </span>
              <ChevronRight size={12} className="text-zinc-600" />
              <span className="text-xs font-mono text-zinc-200">
                {parentAccount.account_number}
              </span>
              <span className="ml-2 text-[10px] text-primary font-bold">
                {parentAccount.currency}
              </span>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <ScrollArea className="max-h-[50vh] px-6 py-4">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">
                  Account Type
                </Label>
                <select
                  className="w-full h-9 bg-muted/50 border-none rounded-lg px-3 text-xs focus:ring-1 focus:ring-primary text-foreground appearance-none cursor-pointer"
                  value={payload.account_type_id}
                  onChange={(e) =>
                    onChange({
                      ...payload,
                      account_type_id: Number(e.target.value),
                    })
                  }
                >
                  <option value="">Select type...</option>
                  {accountTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">
                  Initial Deposit
                </Label>
                <Input
                  type="number"
                  className="h-9 text-xs bg-muted/50 border-none rounded-lg"
                  placeholder="0.00"
                  value={payload.initial_deposit}
                  onChange={(e) =>
                    onChange({
                      ...payload,
                      initial_deposit: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            {/* Account Owner */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">
                Account Owner
              </Label>
              <select
                className="w-full h-9 bg-muted/50 border-none rounded-lg px-3 text-xs focus:ring-1 focus:ring-primary text-foreground"
                value={payload.owner_user_id}
                onChange={(e) =>
                  onChange({
                    ...payload,
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
        <div className="p-4 bg-background border-t flex gap-3">
          <Button
            variant="ghost"
            className="flex-1 rounded-xl h-9 text-xs"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-[2] rounded-xl h-9 text-xs font-bold"
            onClick={() =>
              onConfirm({
                ...payload,
                user_ids: payload.owner_user_id ? [payload.owner_user_id] : [],
              })
            }
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Creating..." : "Create Sub-Account"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubAccountDialog;
