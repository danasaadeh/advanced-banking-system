"use client";

import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import { ChevronRight, ChevronDown, Eye, Plus } from "lucide-react";
import type {
  Account,
  Role,
  AccountStatus,
} from "@/features/account-management/types/accounts.data";
import {
  cn,
  typeColors,
  statusColors,
} from "@/features/account-management/types/typeColors";

interface AccountRowProps {
  account: Account;
  level: number;
  onAddSubAccount: (parent: Account) => void;
  onChangeStatus: (id: number, status: AccountStatus) => void;
  role: Role;
}

export const AccountRow: React.FC<AccountRowProps> = ({
  account,
  level,
  onAddSubAccount,
  onChangeStatus,
  role,
}) => {
  const [expanded, setExpanded] = useState(true);
  const isParent = Boolean(account.children?.length); 
  const canAddSub = isParent && account.current_state.state !== "closed";
  const canEditStatus =
    (role === "admin" || role === "manager") &&
    account.current_state.state !== "closed";

  return (
    <>
      <TableRow
        className={cn(
          "hidden md:table-row",
          level > 0 ? "bg-muted/20" : "bg-background"
        )}
      >
        <TableCell className="relative p-0">
          <div
            className="flex items-center py-4 pr-4"
            style={{ paddingLeft: `${level * 1.5}rem` }}
          >
            {level > 0 && (
              <div
                className="absolute left-4 top-0 bottom-0 w-px bg-border"
                style={{ left: `${level * 1.5 - 0.25}rem` }}
              />
            )}
            <div className="flex items-center gap-2">
              <div className="w-6">
                {isParent && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-muted/30 transition"
                    onClick={() => setExpanded(!expanded)}
                  >
                    {expanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">
                  {account.account_number}
                </span>
              </div>
            </div>
          </div>
        </TableCell>

        <TableCell>
          <span
            className={cn(
              "px-4 py-1 rounded-full text-xs font-semibold",
              typeColors[account.account_type.name]
            )}
          >
            {account.account_type.name}
          </span>
        </TableCell>
        <TableCell className="font-mono text-xs text-muted-foreground">
          {account.currency}
        </TableCell>
        <TableCell className="text-right font-bold">
          {account.balance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </TableCell>

        <TableCell>
          <Select
            value={account.current_state?.state || "active"}
            onValueChange={(v) =>
              onChangeStatus(account.id, v as AccountStatus)
            }
            disabled={!canEditStatus}
          >
            <SelectTrigger
              className={cn(
                "h-9 w-[120px] rounded-lg text-xs font-medium shadow-sm border focus:outline-none focus:ring-2 focus:ring-primary",
                statusColors[account.current_state?.state || "active"]
              )}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-lg shadow-lg">
              {["active", "frozen", "suspended", "closed"].map((s) => (
                <SelectItem
                  key={s}
                  value={s}
                  className={cn(
                    "rounded-lg px-6 py-1",
                    statusColors[s as AccountStatus]
                  )}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>

        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
          {account.created_at}
        </TableCell>
        <TableCell className="text-xs text-muted-foreground">
          {account.current_state?.state === "closed" ? (
            <div className="flex flex-col">
              <span className="font-semibold">
                Reason: {account.closed_reason || "-"}
              </span>
              <span className="text-[10px] text-gray-500">
                Closed at: {account.closed_at || "-"}
              </span>
            </div>
          ) : (
            "-"
          )}
        </TableCell>

        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            {canAddSub && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full px-3 py-1 hover:bg-primary/10"
                onClick={() => onAddSubAccount(account)}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Sub-account
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full hover:bg-muted/20"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {expanded &&
        account.children?.map((child) => (
          <AccountRow
            key={child.id}
            account={child}
            level={level + 1}
            onAddSubAccount={onAddSubAccount}
            onChangeStatus={onChangeStatus}
            role={role}
          />
        ))}
    </>
  );
};
