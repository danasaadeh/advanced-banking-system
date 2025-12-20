/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import type {
  AccountGroupResponse,
  Account,
} from "@/features/account-management/types/accounts.data";
import { User, Layers, ShieldCheck, Fingerprint } from "lucide-react";

// StatusBadge component moved outside
const StatusBadge: React.FC<{ state: string }> = ({ state }) => (
  <Badge
    variant={state === "active" ? "default" : "destructive"}
    className={`capitalize font-bold ${
      state === "active"
        ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
        : ""
    }`}
  >
    {state}
  </Badge>
);

// UserCard component moved outside
const UserCard: React.FC<{ user: Account["users"][0] }> = ({ user }) => (
  <div className="flex items-center justify-between p-3 rounded-xl border bg-card/50">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-primary/10 rounded-full">
        <User className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-sm font-semibold leading-none">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
    </div>
    {user.is_owner && (
      <Badge
        variant="outline"
        className="text-[10px] uppercase border-primary/30 text-primary"
      >
        Owner
      </Badge>
    )}
  </div>
);

interface Props {
  account: AccountGroupResponse | undefined;
  open: boolean;
  setOpen: (val: boolean) => void;
}

const AccountDetailsDialog: React.FC<Props> = ({ account, open, setOpen }) => {
  if (!account?.data) return null;
  const acc = account.data;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
        <div className="bg-black dark:bg-zinc-800 p-6 text-white">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Fingerprint size={24} />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">
                    Account Overview
                  </DialogTitle>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    {acc.account_number}
                  </p>
                </div>
              </div>
              <StatusBadge state={acc.current_state.state} />
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[80vh]">
          <div className="p-6 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-muted/30 border">
                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
                  Balance
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold tracking-tight text-primary">
                    {acc.balance}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {acc.currency}
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border">
                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
                  Type
                </p>
                <p className="text-sm font-semibold">
                  {acc.account_type?.name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {acc.account_type?.description}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border">
                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
                  Created
                </p>
                <p className="text-sm font-semibold">
                  {new Date(acc.created_at).toLocaleDateString()}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  ID: {acc.id}
                </p>
              </div>
            </div>

            {/* Team Members */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    Access Control
                  </h3>
                </div>
                <div className="space-y-2">
                  {acc.users.map((u) => (
                    <UserCard key={u.id} user={u} />
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <Layers className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    Enabled Features
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {acc.features.length > 0 ? (
                    acc.features.map((feature: any, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="rounded-lg py-1 px-3"
                      >
                        {feature.name || feature}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      No specialized features active.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sub-Accounts */}
            {acc.children.length > 0 && (
              <div className="space-y-4 pt-2">
                <Separator />
                <div className="flex items-center gap-2 px-1">
                  <Layers className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    Hierarchy (Sub-Accounts)
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {acc.children.map((child) => (
                    <div
                      key={child.id}
                      className="group flex items-center justify-between p-4 rounded-2xl border bg-muted/10 hover:bg-muted/30 transition-all cursor-default"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-background rounded-lg border group-hover:border-primary/50 transition-colors">
                          <Layers className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">
                            {child.account_number}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {child.account_type.name}
                            </span>
                            <span className="text-xs font-semibold text-green-600">
                              {child.balance} {child.currency}
                            </span>
                          </div>
                        </div>
                      </div>
                      <StatusBadge state={child.current_state.state} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AccountDetailsDialog;
