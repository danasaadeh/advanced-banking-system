"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Search, ShieldCheck } from "lucide-react";
import { Card } from "@/shared/components/ui/card";

import {
  type Account,
  type AccountStatus,
  type Role,
  initialAccounts,
} from "./accounts.data";

import { AccountTable } from "@/features/account-management/components/AccountTable";
import { AccountDialog } from "@/features/account-management/components/AccountDialog";
import AccountsPagination from "@/features/account-management/components/AccountsPagenation";

const ITEMS_PER_PAGE = 5;

const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [parentAccount, setParentAccount] = useState<Account | null>(null);
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [role] = useState<Role>("manager");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredAccounts = useMemo(() => {
    const filterTree = (list: Account[]): Account[] =>
      list
        .filter((acc) =>
          acc.account_number.toLowerCase().includes(search.toLowerCase())
        )
        .map((acc) => ({
          ...acc,
          children: acc.children ? filterTree(acc.children) : [],
        }));

    return search ? filterTree(accounts) : accounts;
  }, [search, accounts]);

  /* ---------------- PAGINATION (ROOT ACCOUNTS) ---------------- */
  const totalItems = filteredAccounts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAccounts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAccounts, currentPage]);

  /* ---------------- ADD SUB ACCOUNT ---------------- */
  const handleAddSubAccount = (parent: Account) => {
    const newSub: Account = {
      id: Date.now(),
      account_number: newAccountNumber,
      type_name: "Savings",
      status: "active",
      currency: "USD",
      balance: 0,
      created_at: new Date().toISOString().split("T")[0],
      parent_account_id: parent.id,
    };

    const updateTree = (list: Account[]): Account[] =>
      list.map((acc) =>
        acc.id === parent.id
          ? { ...acc, children: [...(acc.children || []), newSub] }
          : {
              ...acc,
              children: acc.children ? updateTree(acc.children) : acc.children,
            }
      );

    setAccounts(updateTree(accounts));
    setDialogOpen(false);
    setNewAccountNumber("");
    setParentAccount(null);
  };

  /* ---------------- STATUS CHANGE ---------------- */
  const handleChangeStatus = (
    id: number,
    status: AccountStatus,
    closed_reason?: string
  ) => {
    const updateTree = (list: Account[]): Account[] =>
      list.map((acc) =>
        acc.id === id
          ? {
              ...acc,
              status,
              closed_reason: status === "closed" ? closed_reason : undefined,
              closed_at:
                status === "closed"
                  ? new Date().toISOString().split("T")[0]
                  : undefined,
            }
          : {
              ...acc,
              children: acc.children ? updateTree(acc.children) : acc.children,
            }
      );

    setAccounts(updateTree(accounts));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ---------------- HEADER ---------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Accounts management</h1>
          <p className="text-sm text-muted-foreground">
            Banking-grade hierarchical account management
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-muted/50 p-2 rounded-lg border">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="text-xs font-semibold capitalize">
            {role} portal
          </span>
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            New Root Account
          </Button>
        </div>
      </div>

      {/* ---------------- SEARCH ---------------- */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by account number..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-9"
        />
      </div>

      {/* ---------------- TABLE ---------------- */}
      <Card className="p-4">
        <AccountTable
          accounts={paginatedAccounts}
          role={role}
          onAddSubAccount={(acc) => {
            setParentAccount(acc);
            setDialogOpen(true);
          }}
          onChangeStatus={handleChangeStatus}
        />
      </Card>

      {/* ---------------- PAGINATION ---------------- */}
      <AccountsPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      {/* ---------------- DIALOG ---------------- */}
      <AccountDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        parentAccount={parentAccount}
        accountNumber={newAccountNumber}
        setAccountNumber={setNewAccountNumber}
        onConfirm={() => parentAccount && handleAddSubAccount(parentAccount)}
      />
    </div>
  );
};

export default AccountsPage;
