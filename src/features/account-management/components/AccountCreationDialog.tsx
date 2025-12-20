"use client";

import React, { useState, useMemo } from "react";
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
  Search,
} from "lucide-react";

import type {
  CreateAccountPayload,
  Account,
  User,
  AccountType,
} from "@/features/account-management/types/accounts.data";

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
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users by search
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const toggleUser = (userId: number) => {
    const currentIds = [...value.user_ids];
    const index = currentIds.indexOf(userId);
    if (index > -1) currentIds.splice(index, 1);
    else currentIds.push(userId);
    onChange({ ...value, user_ids: currentIds });
  };

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
                <Input
                  className="rounded-lg border-none bg-muted/50 h-9 text-xs"
                  placeholder="USD"
                  value={value.currency}
                  onChange={(e) =>
                    onChange({ ...value, currency: e.target.value })
                  }
                />
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

            {/* Owner */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                <UserCircle size={12} /> Account Owner
              </Label>
              <select
                className="w-full h-9 bg-muted/50 border-none rounded-lg px-3 text-xs focus:ring-2 focus:ring-primary"
                value={value.owner_user_id}
                onChange={(e) =>
                  onChange({ ...value, owner_user_id: Number(e.target.value) })
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

            {/* Multi-Select Users */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-2">
                <Users size={12} /> Assign Users ({value.user_ids.length})
              </Label>
              <div className="relative">
                <Search
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={14}
                />
                <Input
                  placeholder="Search users..."
                  className="h-8 pl-8 text-xs bg-muted/30 border-none rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="border rounded-xl overflow-hidden bg-muted/10">
                <div className="max-h-[180px] overflow-y-auto p-1.5 space-y-1">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => toggleUser(user.id)}
                      className={`flex items-center gap-2.5 p-2 rounded-md cursor-pointer transition-colors ${
                        value.user_ids.includes(user.id)
                          ? "bg-primary/10 border-primary/20 border"
                          : "hover:bg-accent"
                      }`}
                    >
                      <Checkbox
                        checked={value.user_ids.includes(user.id)}
                        onCheckedChange={() => toggleUser(user.id)}
                        className="h-3.5 w-3.5"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-medium leading-tight">
                          {user.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="p-4 text-center text-xs text-muted-foreground">
                      No users found
                    </div>
                  )}
                </div>
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
              className="flex-[2] rounded-lg h-10 text-xs shadow-lg shadow-primary/20"
              onClick={() =>
                onConfirm({
                  ...value,
                  parent_account_id: parentAccount?.id ?? null,
                })
              }
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountCreationDialog;
