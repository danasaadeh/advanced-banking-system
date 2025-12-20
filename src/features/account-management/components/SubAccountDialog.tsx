"use client";

import React, { useState, useMemo } from "react";
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
import {

  PlusCircle,
  Search,
  ChevronRight,
} from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");

  const payload: CreateAccountPayload = {
    ...value,
    parent_account_id: parentAccount.id,
    currency: parentAccount.currency,
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const toggleUser = (userId: number) => {
    const currentIds = [...payload.user_ids];
    const index = currentIds.indexOf(userId);
    if (index > -1) {
      currentIds.splice(index, 1);
    } else {
      currentIds.push(userId);
    }
    onChange({ ...payload, user_ids: currentIds });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl w-full p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-background">
        {/* FIXED HEADER - Reduced padding */}
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

        {/* SCROLLABLE CONTENT - Height restricted */}
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

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">
                Team Members ({payload.user_ids.length})
              </Label>
              <div className="relative">
                <Search
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={12}
                />
                <Input
                  placeholder="Search team..."
                  className="h-8 pl-8 text-[11px] bg-muted/30 border-none rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="border border-border/40 rounded-xl overflow-hidden">
                <div className="max-h-[140px] overflow-y-auto p-1 space-y-0.5">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => toggleUser(user.id)}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                        payload.user_ids.includes(user.id)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <Checkbox
                        checked={payload.user_ids.includes(user.id)}
                        className={
                          payload.user_ids.includes(user.id)
                            ? "border-white"
                            : "h-3.5 w-3.5"
                        }
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-medium leading-none">
                          {user.name}
                        </span>
                        <span
                          className={`text-[10px] mt-0.5 ${
                            payload.user_ids.includes(user.id)
                              ? "text-white/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {user.email}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* FIXED FOOTER - Smaller height */}
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
            onClick={() => onConfirm(payload)}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Sub-Account"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubAccountDialog;
