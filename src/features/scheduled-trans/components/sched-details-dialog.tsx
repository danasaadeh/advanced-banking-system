import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import type { ScheduledTransaction } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: ScheduledTransaction | null;
}

const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const getStatusBadge = (status: ScheduledTransaction["status"]) => {
  switch (status) {
    case "scheduled":
      return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
    case "executed":
      return <Badge className="bg-green-100 text-green-800">Executed</Badge>;
    case "failed":
      return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
    case "cancelled":
      return <Badge variant="outline">Cancelled</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const requiresApproval = (amount: number) => amount >= 10_000;

export const ScheduledTransactionDetailsDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  transaction,
}) => {
  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Scheduled Transaction Details</DialogTitle>
          <DialogDescription>Transaction #{transaction.id}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          {/* Description */}
          <div className="col-span-2">
            <p className="text-muted-foreground">Description</p>
            <p className="font-medium capitalize">
              {transaction.type} transaction
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Amount</p>
            <p className="font-medium">
              {transaction.amount.toLocaleString()} {transaction.currency}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Status</p>
            {getStatusBadge(transaction.status)}
          </div>

          <div>
            <p className="text-muted-foreground">Source Account</p>
            <p className="font-medium">{transaction.source_account ?? "—"}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Target Account</p>
            <p className="font-medium">{transaction.target_account ?? "—"}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Scheduled Date</p>
            <p className="font-medium">
              {formatDate(transaction.scheduled_at)}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Created By</p>
            <p className="font-medium">{transaction.created_by}</p>
          </div>

          {/* Approval Requirement */}
          <div className="col-span-2">
            <p className="text-muted-foreground">Approval Requirement</p>
            <p className="font-medium">
              {requiresApproval(transaction.amount)
                ? "Requires managerial approval"
                : "No approval required"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
