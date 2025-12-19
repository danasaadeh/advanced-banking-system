"use client";

import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Search, ShieldCheck } from "lucide-react";
import { Card } from "@/shared/components/ui/card";

import type { Role, CreateAccountPayload } from "../types/accounts.data";
import AccountsPagination from "@/features/account-management/components/AccountsPagenation";
import AccountDialog from "../components/AccountDialog";

import { useAccounts } from "@/features/account-management/services/queries";
import { AccountTable } from "../components/AccountTable";
import { useUpdateAccountStatus } from "@/features/account-management/services/mutations";


const ITEMS_PER_PAGE = 5;

const AccountsPage: React.FC = () => {
  const [role] = useState<Role>("manager");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [parentAccountId, setParentAccountId] = useState<number | null>(null);

  const [newAccount, setNewAccount] = useState<CreateAccountPayload>({
    account_type_id: 1,
    currency: "USD",
    user_ids: [],
    owner_user_id: 1,
  });

  const { data, isLoading, isError } = useAccounts({
    search,
    page: currentPage,
    perPage: ITEMS_PER_PAGE,
  });

  const accounts = data?.data || [];
  const totalItems = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.last_page || 1;

  const handleAddAccount = (parentId: number | null) => {
    console.log("CREATE ACCOUNT PAYLOAD:", newAccount, "Parent ID:", parentId);
    setDialogOpen(false);
    setParentAccountId(null);
  };
  const { mutate: updateStatus } = useUpdateAccountStatus();


  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Accounts Management</h1>
          <p className="text-sm text-muted-foreground">
            Banking-grade hierarchical account management
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-muted/50 p-2 rounded-lg border">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="text-xs font-semibold capitalize">
            {role} portal
          </span>
          <Button
            size="sm"
            onClick={() => {
              setParentAccountId(null);
              setDialogOpen(true);
            }}
          >
            New Root Account
          </Button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by account number..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page when search changes
          }}
          className="pl-9"
        />
      </div>

      {/* CARD WITH LOADING / ERROR / EMPTY / DATA */}
      <Card className="p-4 min-h-[200px] flex items-center justify-center">
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading accounts...</p>
          </div>
        ) : isError ? (
          <div className="text-center text-red-500">
            Failed to load accounts. Please try again.
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No accounts found.
            <div className="text-sm mt-1">
              Try adjusting your search or filters
            </div>
          </div>
        ) : (
          <AccountTable
            accounts={accounts}
            role={role}
            onAddSubAccount={(acc) => {
              setParentAccountId(acc.id);
              setDialogOpen(true);
            }}
            onChangeStatus={(accountId, newState) => {
              updateStatus({ accountId, state: newState }); 
            }}
          />
        )}
      </Card>

      {/* PAGINATION */}
      {totalItems > ITEMS_PER_PAGE && (
        <AccountsPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}

      {/* DIALOG */}
      <AccountDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        parentAccount={parentAccountId ? { id: parentAccountId } : null}
        value={newAccount}
        onChange={setNewAccount}
        onConfirm={() => handleAddAccount(parentAccountId)}
      />
    </div>
  );
};

export default AccountsPage;
