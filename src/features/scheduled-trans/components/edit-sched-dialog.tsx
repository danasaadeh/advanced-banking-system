import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import type { ScheduledTransaction } from "../types";
import { Spinner } from "@/shared/components/ui/spinner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: ScheduledTransaction | null;
  onSubmit: (payload: {
    id: number;
    amount?: number;
    scheduled_at?: string;
  }) => void;
  isLoading: boolean; // Add isLoading prop
}

export const EditScheduledTransactionDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  transaction,
  onSubmit,
  isLoading,
}) => {
  const [amount, setAmount] = React.useState<string>("");
  const [date, setDate] = React.useState<string>("");

  React.useEffect(() => {
    if (transaction) {
      setAmount("");
      setDate("");
    }
  }, [transaction]);

  if (!transaction) return null;

  const handleSubmit = () => {
    const payload: { id: number; amount?: number; scheduled_at?: string } = {
      id: transaction.id,
    };

    if (amount.trim() !== "") {
      payload.amount = Number(amount);
    }

    if (date) {
      payload.scheduled_at = date;
    }

    // Pass the payload to the handleEditSubmit function, which will format it correctly
    onSubmit({
      id: payload.id,
      amount: payload.amount,
      scheduled_at: payload.scheduled_at,
    });

    onOpenChange(false); // Close the dialog after submission
  };

  const isDisabled = amount.trim() === "" && !date;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Scheduled Transaction</DialogTitle>
          <DialogDescription>
            You can update the amount, the scheduled date, or both.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Amount */}
          <div>
            <label className="text-sm text-muted-foreground">
              Amount (optional)
            </label>
            <Input
              type="number"
              min="0"
              placeholder={transaction.amount.toString()}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Scheduled Date */}
          <div>
            <label className="text-sm text-muted-foreground">
              Scheduled Date (optional)
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isDisabled || isLoading}>
            {isLoading ? <Spinner /> : "Save Changes"}{" "}
            {/* Show spinner when loading */}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
