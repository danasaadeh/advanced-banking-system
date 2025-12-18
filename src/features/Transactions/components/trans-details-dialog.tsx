import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/shared/components/ui/dialog"; // import your Dialog components
import { Button } from "@/shared/components/ui/button"; // optional, for trigger button

interface TransactionDetails {
  txnId: string;
  type: string;
  amount: string;
  status: string;
  approvalLevel: string;
  toAccount: string;
  description: string;
}

interface ViewTransactionDialogProps {
  transaction: TransactionDetails;
}

export const ViewTransactionDialog: React.FC<ViewTransactionDialogProps> = ({
  transaction,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>{transaction.txnId}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Type</p>
            <p>{transaction.type}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Amount</p>
            <p>{transaction.amount}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="inline-block px-2 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
              {transaction.status}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Approval Level
            </p>
            <p>{transaction.approvalLevel}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium text-muted-foreground">
              To Account
            </p>
            <p>{transaction.toAccount}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium text-muted-foreground">
              Description
            </p>
            <p>{transaction.description}</p>
          </div>
        </div>

        <DialogClose asChild>
          <Button className="mt-6 w-full">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
