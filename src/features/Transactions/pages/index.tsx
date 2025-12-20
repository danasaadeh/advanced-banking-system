import React, { useState, useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Plus, Search } from "lucide-react";

import TransactionFilters from "../components/trans-filters";
import { TransactionsTable } from "../components/trans-table";
import TransactionsPagination from "../components/trans-pagination";

import type { Transaction } from "../types";
import ConfirmDialog from "@/shared/components/ui/confirm-dialog";
import { TransactionDetailsDialog } from "../components/trans-details-dialog";
import { AddTransactionDialog } from "../components/add-trans-dialog";
import { rolesStorage } from "@/features/auth/storage";
import type { UserRole } from "../approvals/approval.types";
import { resolveUserRole } from "../approvals/role-utils";

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    reference_number: "TXN-10001",
    type: "deposit",
    amount: 2500,
    currency: "USD",
    status: "approved",
    direction: "credit",
    approved_by: "Admin User",
    created_at: "2025-01-10T10:15:00Z",
    account: "Savings Account",
  },
  {
    id: 2,
    reference_number: "TXN-10002",
    type: "withdrawal",
    amount: 500,
    currency: "USD",
    status: "pending",
    direction: "debit",
    approved_by: null,
    created_at: "2025-01-12T14:30:00Z",
    account: "Checking Account",
  },
  {
    id: 3,
    reference_number: "TXN-10003",
    type: "transfer",
    amount: 1200,
    currency: "USD",
    status: "rejected",
    direction: "debit",
    approved_by: "Finance Manager",
    created_at: "2025-01-15T09:00:00Z",
    account: "Business Account",
  },
  {
    id: 4,
    reference_number: "TXN-10004",
    type: "deposit",
    amount: 800,
    currency: "EUR",
    status: "completed",
    direction: "credit",
    approved_by: "System",
    created_at: "2025-01-18T16:45:00Z",
    account: "Savings Account",
  },
  {
    id: 5,
    reference_number: "TXN-10005",
    type: "withdrawal",
    amount: 300,
    currency: "EUR",
    status: "approved",
    direction: "debit",
    approved_by: "Admin User",
    created_at: "2025-01-20T11:20:00Z",
    account: "Checking Account",
  },
  {
    id: 6,
    reference_number: "TXN-10006",
    type: "transfer",
    amount: 4500,
    currency: "USD",
    status: "pending",
    direction: "credit",
    approved_by: null,
    created_at: "2025-01-22T08:10:00Z",
    account: "Corporate Account",
  },
  {
    id: 7,
    reference_number: "TXN-10007",
    type: "deposit",
    amount: 1500,
    currency: "USD",
    status: "completed",
    direction: "credit",
    approved_by: "System",
    created_at: "2025-01-25T13:55:00Z",
    account: "Savings Account",
  },
  {
    id: 8,
    reference_number: "TXN-10008",
    type: "withdrawal",
    amount: 950,
    currency: "USD",
    status: "rejected",
    direction: "debit",
    approved_by: "Risk Officer",
    created_at: "2025-01-27T17:40:00Z",
    account: "Checking Account",
  },
  {
    id: 9,
    reference_number: "TXN-10009",
    type: "transfer",
    amount: 2200,
    currency: "EUR",
    status: "approved",
    direction: "credit",
    approved_by: "Admin User",
    created_at: "2025-01-28T10:05:00Z",
    account: "Business Account",
  },
  {
    id: 10,
    reference_number: "TXN-10010",
    type: "deposit",
    amount: 5000,
    currency: "USD",
    status: "pending",
    direction: "credit",
    approved_by: null,
    created_at: "2025-01-30T09:30:00Z",
    account: "Corporate Account",
  },
];

const ITEMS_PER_PAGE = 5;

const TransactionsPage: React.FC = () => {
  /* ---------------- SEARCH ---------------- */
  const [search, setSearch] = useState("");

  /* ---------------- FILTER STATES ---------------- */
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [direction, setDirection] = useState("all");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- DETAILS DIALOG ---------------- */
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTransaction, setDetailsTransaction] =
    useState<Transaction | null>(null);

  /* ---------------- ADD TRANSACTION DIALOG ---------------- */
  const [addOpen, setAddOpen] = useState(false);

  /* ---------------- PAGINATION ---------------- */
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------------- FILTERING LOGIC ---------------- */
  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((tx) => {
      if (
        search &&
        !tx.reference_number.toLowerCase().includes(search.toLowerCase())
      )
        return false;

      if (type !== "all" && tx.type !== type) return false;
      if (status !== "all" && tx.status !== status) return false;
      if (direction !== "all" && tx.direction !== direction) return false;

      if (dateFrom && new Date(tx.created_at) < new Date(dateFrom))
        return false;
      if (dateTo && new Date(tx.created_at) > new Date(dateTo)) return false;

      return true;
    });
  }, [search, type, status, direction, dateFrom, dateTo]);

  const rawRoles = rolesStorage.get() as UserRole[] | null;

  const userRole: UserRole = resolveUserRole(rawRoles);

  /* ---------------- PAGINATED DATA ---------------- */
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  /* ---------------- ACTION HANDLERS ---------------- */
  const handleApprove = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setConfirmAction("approve");
    setConfirmOpen(true);
  };

  const handleReject = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setConfirmAction("reject");
    setConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedTransaction || !confirmAction) return;

    try {
      setLoading(true);

      if (confirmAction === "approve") {
        console.log("Approving transaction", selectedTransaction);
        // await approveTransaction(selectedTransaction.id);
      } else {
        console.log("Rejecting transaction", selectedTransaction);
        // await rejectTransaction(selectedTransaction.id);
      }

      setConfirmOpen(false);
      setSelectedTransaction(null);
      setConfirmAction(null);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (tx: Transaction) => {
    setDetailsTransaction(tx);
    setDetailsOpen(true);
  };

  const handleAddTransaction = () => {
    setAddOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ---------------- HEADER ---------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold">Transactions</h1>

        <Button
          onClick={handleAddTransaction}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {/* ---------------- SEARCH + FILTERS ---------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Search */}
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

        {/* Filters */}
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
        transactions={paginatedTransactions}
        onApprove={handleApprove}
        onReject={handleReject}
        onViewDetails={handleViewDetails}
      />

      {/* ---------------- PAGINATION ---------------- */}
      <TransactionsPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
      />
      {/* ---------------- DETAILS DIALOG ---------------- */}
      <TransactionDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        transaction={detailsTransaction}
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
          loading={loading}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
