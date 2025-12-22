"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import { Search, ShieldCheck } from "lucide-react";

import type {
  Role,
  CreateAccountPayload,
  Account,
  CreateAccountGroupPayload,
} from "../types/accounts.data";

import AccountsPagination from "../components/AccountsPagenation";
import AccountCreationDialog from "../components/AccountCreationDialog";
import SubAccountDialog from "../components/SubAccountDialog";
import AccountDetailsDialog from "../components/AccountDetailsDialog";
import { AccountTable } from "../components/AccountTable";
import GroupAccountDialog from "../components/AccountGroupCreationDialog";

import {
  useAccounts,
  useAccount,
  useAccountCreationData,
} from "../services/accounts.queries";
import { useUpdateAccountStatus } from "../services/accounts.mutations";
import { useAccountCreationFactory } from "../services/accounts.factory";

const ITEMS_PER_PAGE = 5;

const AccountsPage: React.FC = () => {
  /* ---------------- role and user_id ---------------- */
  const [role, setRole] = useState<Role>("customer");
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedRoles = localStorage.getItem("roles");
    if (storedRoles) {
      const parsed = JSON.parse(storedRoles) as string[];
      setRole(parsed[0].toLowerCase() as Role);
    }

    const storedId = localStorage.getItem("user_id");
    if (storedId) setUserId(Number(storedId));
  }, []);

  const isCustomer = role === "customer";

  /* ---------------- search & pagination ---------------- */
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------------- dialogs ---------------- */
  const [rootDialogOpen, setRootDialogOpen] = useState(false);
  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [parentAccount, setParentAccount] = useState<Account | null>(null);

  /* ---------------- loading states ---------------- */
  const [creatingRoot, setCreatingRoot] = useState(false);
  const [creatingSub, setCreatingSub] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);

  /* ---------------- payloads ---------------- */
  const [newAccount, setNewAccount] = useState<CreateAccountPayload>({
    account_type_id: 1,
    parent_account_id: null,
    currency: "USD",
    initial_deposit: 1000,
    user_ids: [],
    owner_user_id: 0, // placeholder
  });

  const [newGroup, setNewGroup] = useState<CreateAccountGroupPayload>({
    account_type_id: 1,
    currency: "USD",
    user_ids: [],
    owner_user_id: 0, // placeholder
  });

  /* ---------------- accounts data ---------------- */
  const {
    data,
    isLoading: isAccountsLoading,
    isError: isAccountsError,
  } = useAccounts({
    search,
    page: currentPage,
    perPage: ITEMS_PER_PAGE,
  });

  const accounts = data?.data ?? [];
  const totalItems = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.last_page ?? 1;

  /* ---------------- creation data ---------------- */
  const {
    data: creationData,
    isLoading: isCreationLoading,
    isError: isCreationError,
  } = useAccountCreationData();

  const users = creationData?.users ?? [];
  const accountTypes = creationData?.account_types ?? [];

  /* ---------------- status ---------------- */
  const [updatingAccountId, setUpdatingAccountId] = useState<number | null>(
    null
  );
  const { mutate: updateStatus } = useUpdateAccountStatus();

  const handleChangeStatus = (accountId: number, newState: string) => {
    if (isCustomer) return;

    setUpdatingAccountId(accountId);
    updateStatus(
      { accountId, state: newState as any },
      { onSettled: () => setUpdatingAccountId(null) }
    );
  };

  /* ---------------- details ---------------- */
  const [viewAccountId, setViewAccountId] = useState<number | null>(null);
  const { data: accountDetails } = useAccount(viewAccountId ?? undefined);

  /* ---------------- factory ---------------- */
  const { create: createAccount } = useAccountCreationFactory();

  /* ---------------- handlers ---------------- */
  const handleCreateAccount = (payload: CreateAccountPayload) => {
    if (isCustomer) return;

    if (parentAccount) {
      setCreatingSub(true);
      createAccount(
        "CHILD",
        { ...payload, parent_account_id: parentAccount.id },
        {
          onSuccess: () => {
            setSubDialogOpen(false);
            setParentAccount(null);
          },
          onSettled: () => setCreatingSub(false),
        }
      );
    } else {
      setCreatingRoot(true);
      createAccount("ROOT", payload, {
        onSuccess: () => setRootDialogOpen(false),
        onSettled: () => setCreatingRoot(false),
      });
    }
  };

  const handleCreateGroup = (payload: CreateAccountGroupPayload) => {
    if (isCustomer) return;

    setCreatingGroup(true);
    createAccount("GROUP", payload, {
      onSuccess: () => setGroupDialogOpen(false),
      onSettled: () => setCreatingGroup(false),
    });
  };

  /* ---------------- filter accounts for customer ---------------- */
  const filteredAccounts =
    isCustomer && userId
      ? accounts.filter((acc) => acc.users?.some((u: any) => u.id === userId))
      : accounts;

  const accountsWithOwnerFlag = filteredAccounts.map((acc: any) => ({
    ...acc,
    isOwner: acc.users?.some((u: any) => u.id === userId && u.is_owner),
  }));

  /* ---------------- GLOBAL LOADING / ERROR ---------------- */
  if (isCreationLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        Loading configuration data...
      </div>
    );
  }

  if (isCreationError) {
    return (
      <div className="flex items-center justify-center h-96 text-red-500">
        Failed to load configuration data.
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Accounts Management</h1>
          <p className="text-sm text-muted-foreground">
            Banking-grade hierarchical account management
          </p>
        </div>

        <div className="flex items-center gap-3 bg-muted/50 p-2 rounded-lg border">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="text-xs font-semibold capitalize">
            {role} portal
          </span>

          {!isCustomer && (
            <>
              <Button size="sm" onClick={() => setRootDialogOpen(true)}>
                New Root Account
              </Button>
              <Button size="sm" onClick={() => setGroupDialogOpen(true)}>
                New Root Group
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Search */}
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

      {/* Accounts Table */}
      <Card className="p-4">
        {isAccountsLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-primary" />
          </div>
        ) : isAccountsError ? (
          <div className="text-center text-red-500 py-8">
            Failed to load accounts.
          </div>
        ) : accountsWithOwnerFlag.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No accounts found
          </div>
        ) : (
          <AccountTable
            accounts={accountsWithOwnerFlag}
            role={role}
            onAddSubAccount={
              isCustomer
                ? undefined
                : (acc) => {
                    setParentAccount(acc);
                    setSubDialogOpen(true);
                  }
            }
            onChangeStatus={handleChangeStatus}
            onViewDetails={setViewAccountId}
            updatingAccountId={updatingAccountId}
            fetchingAccountId={viewAccountId}
          />
        )}
      </Card>

      <AccountsPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      {/* Dialogs (NON-CUSTOMER ONLY) */}
      {!isCustomer && (
        <>
          <AccountCreationDialog
            open={rootDialogOpen}
            setOpen={setRootDialogOpen}
            parentAccount={null}
            value={newAccount}
            onChange={setNewAccount}
            onConfirm={handleCreateAccount}
            users={users}
            accountTypes={accountTypes}
            loading={creatingRoot}
          />

          {parentAccount && (
            <SubAccountDialog
              open={subDialogOpen}
              setOpen={setSubDialogOpen}
              parentAccount={parentAccount}
              value={newAccount}
              onChange={setNewAccount}
              onConfirm={handleCreateAccount}
              users={users}
              accountTypes={accountTypes}
              loading={creatingSub}
            />
          )}

          <GroupAccountDialog
            open={groupDialogOpen}
            setOpen={setGroupDialogOpen}
            value={newGroup}
            onChange={setNewGroup}
            onConfirm={handleCreateGroup}
            users={users}
            accountTypes={accountTypes}
            loading={creatingGroup}
          />
        </>
      )}

      <AccountDetailsDialog
        account={accountDetails}
        open={!!viewAccountId}
        setOpen={() => setViewAccountId(null)}
      />
    </div>
  );
};

export default AccountsPage;
