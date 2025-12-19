import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import type { Transaction } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

const getStatusBadge = (status: Transaction["status"]) => {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
    case "pending":
      return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>;
    case "rejected":
      return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const formatAmount = (tx: Transaction) =>
  `${tx.direction === "credit" ? "+" : "-"}${tx.amount.toLocaleString()} ${
    tx.currency
  }`;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const TransactionDetailsDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  transaction,
}) => {
  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>{transaction.reference_number}</DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          {/* Description */}
          <div className="col-span-2">
            <p className="text-muted-foreground">Description</p>
            <p className="font-medium">
              {`${transaction.type} transaction for ${transaction.account}`}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Type</p>
            <p className="capitalize font-medium">{transaction.type}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Amount</p>
            <p className="font-medium">{formatAmount(transaction)}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Status</p>
            {getStatusBadge(transaction.status)}
          </div>

          <div>
            <p className="text-muted-foreground">Approval level</p>
            <p className="font-medium">{transaction.approved_by ?? "—"}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Account</p>
            <p className="font-medium">{transaction.account}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Date</p>
            <p className="font-medium">{formatDate(transaction.created_at)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
