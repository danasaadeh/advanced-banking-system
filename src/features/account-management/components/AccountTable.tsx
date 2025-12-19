"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
} from "@/shared/components/ui/table";
import { AccountRow } from "./AccountRow";
import type{ Account, Role, AccountStatus } from "@/features/account-management/types/accounts.data";

interface AccountTableProps {
  accounts: Account[];
  onAddSubAccount: (account: Account) => void;
  onChangeStatus: (id: number, status: AccountStatus) => void;
  role: Role;
}

export const AccountTable: React.FC<AccountTableProps> = ({
  accounts,
  onAddSubAccount,
  onChangeStatus,
  role,
}) => (
  <Table className="min-w-[700px] sticky-header">
    <TableHeader className="hidden md:table-header-group  sticky top-0 z-10">
      <TableRow>
        <TableHead>Account</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Currency </TableHead>
        <TableHead className="text-right">Balance</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="hidden md:table-cell">Opened</TableHead>
        <TableHead>Closed Info</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {accounts.map((acc) => (
        <AccountRow
          key={acc.id}
          account={acc}
          level={0}
          onAddSubAccount={onAddSubAccount}
          onChangeStatus={onChangeStatus}
          role={role}
        />
      ))}
    </TableBody>
  </Table>
);
