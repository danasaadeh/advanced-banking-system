import React from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { CheckCircle, XCircle, Eye } from "lucide-react";

import type { Transaction } from "../types";
import type { UserRole } from "../approvals/approval.types";
import { transactionApprovalChain } from "../approvals/approval-chain";

interface TransactionsTableProps {
  userRole: UserRole;
  transactions: Transaction[];
  loading?: boolean;
  actionLoading?: boolean;
  onViewDetails: (transaction: Transaction) => void;
  onApprove: (transaction: Transaction) => void;
  onReject: (transaction: Transaction) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  loading = false,
  onViewDetails,
  onApprove,
  onReject,
  userRole,
  actionLoading,
}) => {
  /* ---------------- APPROVAL VISIBILITY ---------------- */
  const canShowApprovalActions = (tx: Transaction) => {
    if (tx.status_label.toLowerCase() !== "pending") return false;

    const result = transactionApprovalChain.handle({
      transaction: tx,
      userRole,
    });

    return result.canApprove;
  };

  /* ---------------- BADGES ---------------- */
  const getStatusBadge = (status: string) => {
    const normalized = status.toLowerCase();

    switch (normalized) {
      case "approved":
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            {status}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            {status}
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            {status}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  /* ---------------- FORMATTERS ---------------- */
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatAmount = (amount: number, directionLabel: string) => {
    const isCredit = directionLabel.toLowerCase() === "credit";

    return (
      <span
        className={
          isCredit
            ? "font-medium text-green-600"
            : "font-medium text-muted-foreground"
        }
      >
        {isCredit ? "+" : "-"}
        {amount.toLocaleString()}
      </span>
    );
  };

  const resolveAccountLabel = (tx: Transaction) => {
    if (tx.type_label.toLowerCase() === "deposit") {
      return tx.target_account?.account_number ?? "—";
    }

    if (tx.type_label.toLowerCase() === "withdrawal") {
      return tx.source_account?.account_number ?? "—";
    }

    return `${tx.source_account?.account_number} → ${tx.target_account?.account_number}`;
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Initiated By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Account</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* ---------------- LOADING ---------------- */}
          {loading && (
            <TableRow>
              <TableCell colSpan={9} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                  <p className="text-muted-foreground text-sm">
                    Loading transactions...
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}

          {/* ---------------- DATA ---------------- */}
          {!loading &&
            transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-medium">
                  {tx.reference_number}
                </TableCell>

                <TableCell>{tx.type_label}</TableCell>

                <TableCell>
                  {formatAmount(tx.amount, tx.direction_label)}
                </TableCell>

                <TableCell>{tx.currency}</TableCell>

                <TableCell>{getStatusBadge(tx.status_label)}</TableCell>

                <TableCell>
                  {tx.initiated_by
                    ? `${tx.initiated_by.first_name} ${tx.initiated_by.last_name}`
                    : "—"}
                </TableCell>

                <TableCell>{formatDate(tx.created_at)}</TableCell>

                <TableCell>{resolveAccountLabel(tx)}</TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="View Details"
                      onClick={() => onViewDetails(tx)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {canShowApprovalActions(tx) && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                          title="Approve"
                          disabled={actionLoading}
                          onClick={() => onApprove(tx)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          title="Reject"
                          disabled={actionLoading}
                          onClick={() => onReject(tx)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}

          {/* ---------------- EMPTY ---------------- */}
          {!loading && transactions.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={9}
                className="py-8 text-center text-muted-foreground"
              >
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
