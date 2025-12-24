import React, { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Plus, Search } from "lucide-react";

import TransactionFilters from "../components/trans-filters";
import { TransactionsTable } from "../components/trans-table";
import TransactionsPagination from "../components/trans-pagination";

import ConfirmDialog from "@/shared/components/ui/confirm-dialog";
import { TransactionDetailsDialog } from "../components/trans-details-dialog";
import { AddTransactionDialog } from "../components/add-trans-dialog";

import { rolesStorage } from "@/features/auth/storage";
import type { UserRole } from "../approvals/approval.types";
import { resolveUserRole } from "../approvals/role-utils";
import { useUpdateTransactionStatus } from "../services/mutation";

import { useTransactions } from "../services/query";
import type {
  TransactionType,
  TransactionStatus,
  TransactionDirection,
} from "../types";
import { RejectTransactionCommand } from "../commands/reject-transaction-command";
import { ApproveTransactionCommand } from "../commands/approve-transaction-command";
import { useSearchParams } from "react-router-dom";

const TransactionsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  /* ---------------- SEARCH ---------------- */
  const [search, setSearch] = useState("");

  /* ---------------- FILTER STATES ---------------- */
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [type, setType] = useState<"all" | TransactionType>("all");
  const [status, setStatus] = useState<"all" | TransactionStatus>("all");
  const [direction, setDirection] = useState<"all" | TransactionDirection>(
    "all"
  );

  /* ---------------- PAGINATION ---------------- */
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------------- Sync URL params ---------------- */
  useEffect(() => {
    const searchParam = searchParams.get("search");
    const statusParam = searchParams.get("status");

    if (searchParam) setSearch(searchParam);
    if (statusParam) setStatus(statusParam as TransactionStatus);
    setCurrentPage(1); // reset page
  }, [searchParams]);
  /* ---------------- DIALOG STATES ---------------- */
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTransaction, setDetailsTransaction] = useState<any>(null);
  const [addOpen, setAddOpen] = useState(false);

  const [detailsTransactionId, setDetailsTransactionId] = useState<
    number | null
  >(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  /* ---------------- USER ROLE ---------------- */
  const rawRoles = rolesStorage.get() as UserRole[] | null;
  const userRole: UserRole = resolveUserRole(rawRoles);

  const { mutateAsync: updateTransactionStatus, isLoading: isUpdatingStatus } =
    useUpdateTransactionStatus();
  /* ---------------- API QUERY ---------------- */
  const { data, isLoading } = useTransactions({
    page: currentPage,
    search: search || undefined,
    trans_type: type !== "all" ? type : undefined,
    status: status !== "all" ? status : undefined,
    direction: direction !== "all" ? direction : undefined,
    from_date: dateFrom || undefined,
    to_date: dateTo || undefined,
  });

  const transactions = data?.data ?? [];
  const meta = data?.meta;

  /* ---------------- ACTION HANDLERS ---------------- */
  const handleApprove = (tx: any) => {
    setSelectedTransaction(tx);
    setConfirmAction("approve");
    setConfirmOpen(true);
  };

  const handleReject = (tx: any) => {
    setSelectedTransaction(tx);
    setConfirmAction("reject");
    setConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedTransaction || !confirmAction) return;

    try {
      if (confirmAction === "approve") {
        const command = new ApproveTransactionCommand(
          selectedTransaction,
          userRole,
          { updateTransactionStatus }
        );

        await command.execute();
      }

      if (confirmAction === "reject") {
        const command = new RejectTransactionCommand(selectedTransaction, {
          updateTransactionStatus,
        });

        await command.execute();
      }

      setConfirmOpen(false);
      setSelectedTransaction(null);
      setConfirmAction(null);
    } catch (error: any) {
      // Optional: toast error
      console.error(error.message);
    }
  };

  const handleViewDetails = (tx: any) => {
    setDetailsTransactionId(tx.id);
    setDetailsOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ---------------- HEADER ---------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold">Transactions</h1>

        <Button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>
      {/* ---------------- SEARCH + FILTERS ---------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="relative w-full lg:max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by reference..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>

        <TransactionFilters
          dateFrom={dateFrom}
          dateTo={dateTo}
          type={type}
          status={status}
          direction={direction}
          onDateFromChange={(v) => {
            setDateFrom(v);
            setCurrentPage(1);
          }}
          onDateToChange={(v) => {
            setDateTo(v);
            setCurrentPage(1);
          }}
          onTypeChange={(v) => {
            setType(v);
            setCurrentPage(1);
          }}
          onStatusChange={(v) => {
            setStatus(v);
            setCurrentPage(1);
          }}
          onDirectionChange={(v) => {
            setDirection(v);
            setCurrentPage(1);
          }}
        />
      </div>
      {/* ---------------- TABLE ---------------- */}
      <TransactionsTable
        userRole={userRole}
        transactions={transactions}
        loading={isLoading}
        actionLoading={isUpdatingStatus}
        onApprove={handleApprove}
        onReject={handleReject}
        onViewDetails={handleViewDetails}
      />
      {/* ---------------- PAGINATION ---------------- */}
      {meta && (
        <TransactionsPagination
          currentPage={meta.current_page}
          totalPages={meta.last_page}
          totalItems={meta.total}
          itemsPerPage={meta.per_page}
          setCurrentPage={setCurrentPage}
        />
      )}
      {/* ---------------- DETAILS DIALOG ---------------- */}
      <TransactionDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        transactionId={detailsTransactionId}
      />
      {/* ---------------- ADD TRANSACTION DIALOG ---------------- */}
      <AddTransactionDialog open={addOpen} onOpenChange={setAddOpen} />
      {selectedTransaction && confirmAction && (
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title={
            confirmAction === "approve"
              ? "Approve Transaction"
              : "Reject Transaction"
          }
          description={`Are you sure you want to ${
            confirmAction === "approve" ? "approve" : "reject"
          } this transaction?

Amount: ${selectedTransaction.amount.toLocaleString()} ${
            selectedTransaction.currency
          }`}
          confirmLabel={confirmAction === "approve" ? "Approve" : "Reject"}
          onConfirm={handleConfirmAction}
          loading={isUpdatingStatus}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
