/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import { Search, ShieldCheck } from "lucide-react";

import type {
  Role,
  CreateAccountPayload,
  Account,
} from "../types/accounts.data";

import AccountsPagination from "@/features/account-management/components/AccountsPagenation";
import AccountCreationDialog from "../components/AccountCreationDialog";
import SubAccountDialog from "../components/SubAccountDialog";
import AccountDetailsDialog from "../components/AccountDetailsDialog";
import { AccountTable } from "../components/AccountTable";

import {
  useAccounts,
  useAccount,
  useAccountCreationData,
} from "@/features/account-management/services/queries";
import { useUpdateAccountStatus } from "@/features/account-management/services/mutations";
import { useCreateAccount } from "@/features/account-management/services/useCreateAccount";
import { useCreateChildAccount } from "@/features/account-management/services/useCreateChildAccount";

const ITEMS_PER_PAGE = 5;

const AccountsPage: React.FC = () => {
  const [role] = useState<Role>("manager");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [rootDialogOpen, setRootDialogOpen] = useState(false);
  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [parentAccount, setParentAccount] = useState<Account | null>(null);

  const [newAccount, setNewAccount] = useState<CreateAccountPayload>({
    account_type_id: 1,
    parent_account_id: null,
    currency: "USD",
    initial_deposit: 1000,
    user_ids: [1],
    owner_user_id: 1,
  });

  const { data, isLoading, isError } = useAccounts({
    search,
    page: currentPage,
    perPage: ITEMS_PER_PAGE,
  });
  const accounts = data?.data ?? [];
  const totalItems = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.last_page ?? 1;

  const { data: creationData, isLoading: creationLoading } =
    useAccountCreationData();
  const users = creationData?.users ?? [];
  const accountTypes = creationData?.account_types ?? [];

  const [updatingAccountId, setUpdatingAccountId] = useState<number | null>(
    null
  );
  const { mutate: updateStatus } = useUpdateAccountStatus();

  const handleChangeStatus = (accountId: number, newState: string) => {
    setUpdatingAccountId(accountId);
    updateStatus(
      { accountId, state: newState as any },
      { onSettled: () => setUpdatingAccountId(null) }
    );
  };

  const [viewAccountId, setViewAccountId] = useState<number | null>(null);
  const { data: accountDetails } = useAccount(viewAccountId ?? undefined);

  // Root account creation
  const { mutate: createRootAccount, isLoading: creatingRoot } =
    useCreateAccount();

  // Child account creation
  const { mutate: createChildAccount, isLoading: creatingChild } =
    useCreateChildAccount();

  // Unified handler for root vs child account
  const handleCreateAccount = (payload: CreateAccountPayload) => {
    if (parentAccount) {
      // Child account
      createChildAccount(
        { ...payload, parent_account_id: parentAccount.id },
        {
          onSuccess: () => {
            setSubDialogOpen(false);
            setParentAccount(null);
            setNewAccount({
              account_type_id: 1,
              parent_account_id: null,
              currency: "USD",
              initial_deposit: 1000,
              user_ids: [1],
              owner_user_id: 1,
            });
          },
        }
      );
    } else {
      // Root account
      createRootAccount(payload, {
        onSuccess: () => {
          setRootDialogOpen(false);
          setNewAccount({
            account_type_id: 1,
            parent_account_id: null,
            currency: "USD",
            initial_deposit: 1000,
            user_ids: [1],
            owner_user_id: 1,
          });
        },
      });
    }
  };

  useEffect(() => {
    if (parentAccount) {
      setNewAccount((prev) => ({
        ...prev,
        parent_account_id: parentAccount.id,
      }));
    }
  }, [parentAccount]);

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
          <Button
            size="sm"
            onClick={() => {
              setParentAccount(null);
              setRootDialogOpen(true);
            }}
          >
            New Root Account
          </Button>
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

      {/* Accounts table */}
      <Card className="p-4 ">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading Accounts...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 py-8">
            Failed to load accounts. Please try again.
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No accounts found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <AccountTable
            accounts={accounts}
            role={role}
            onAddSubAccount={(acc) => {
              setParentAccount(acc);
              setSubDialogOpen(true);
            }}
            onChangeStatus={handleChangeStatus}
            onViewDetails={setViewAccountId}
            updatingAccountId={updatingAccountId}
            fetchingAccountId={viewAccountId}
          />
        )}
      </Card>

      {/* Pagination */}
     
        <AccountsPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
        />
     

      {/* Dialogs */}
      <AccountCreationDialog
        open={rootDialogOpen}
        setOpen={setRootDialogOpen}
        parentAccount={null}
        value={newAccount}
        onChange={setNewAccount}
        onConfirm={handleCreateAccount}
        users={users}
        accountTypes={accountTypes}
        loading={creatingRoot || creationLoading}
      />

      {parentAccount && (
        <SubAccountDialog
          open={subDialogOpen}
          setOpen={setSubDialogOpen}
          parentAccount={parentAccount}
          value={newAccount}
          onChange={setNewAccount}
          onConfirm={handleCreateAccount} // Uses child account mutation
          users={users}
          accountTypes={accountTypes}
          loading={creatingChild || creationLoading}
        />
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
