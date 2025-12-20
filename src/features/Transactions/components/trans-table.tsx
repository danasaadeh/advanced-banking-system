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
  onViewDetails: (transaction: Transaction) => void;
  onApprove: (transaction: Transaction) => void;
  onReject: (transaction: Transaction) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  onViewDetails,
  onApprove,
  onReject,
  userRole,
}) => {
  const canShowApprovalActions = (tx: Transaction) => {
    if (tx.status !== "pending") return false;

    const result = transactionApprovalChain.handle({
      transaction: tx,
      userRole,
    });

    return result.canApprove;
  };

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatAmount = (
    amount: number,
    direction: Transaction["direction"]
  ) => (
    <span
      className={
        direction === "credit"
          ? "font-medium text-green-600"
          : "font-medium text-muted-foreground"
      }
    >
      {direction === "credit" ? "+" : "-"}
      {amount.toLocaleString()}
    </span>
  );

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
            <TableHead>Approved By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Account</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-medium">
                {tx.reference_number}
              </TableCell>

              <TableCell className="capitalize">{tx.type}</TableCell>

              <TableCell>{formatAmount(tx.amount, tx.direction)}</TableCell>

              <TableCell>{tx.currency}</TableCell>

              <TableCell>{getStatusBadge(tx.status)}</TableCell>

              <TableCell>
                {tx.approved_by ?? (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>

              <TableCell>{formatDate(tx.created_at)}</TableCell>

              <TableCell>{tx.account}</TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {/* View Details */}
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
                        onClick={() => onApprove(tx)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        title="Reject"
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

          {transactions.length === 0 && (
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
