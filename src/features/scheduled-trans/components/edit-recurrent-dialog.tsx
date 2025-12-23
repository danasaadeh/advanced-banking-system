import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { RecurringTransaction } from "../types";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  isLoading: boolean; // Add isLoading prop
  onOpenChange: (open: boolean) => void;
  recurrence: RecurringTransaction | null;
  onSubmit: (payload: {
    id: number;
    amount?: number;
    frequency?: "daily" | "weekly" | "monthly";
    end_date?: string;
  }) => void;
}

export const EditRecurringTransactionDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  recurrence,
  onSubmit,
  isLoading,
}) => {
  const [amount, setAmount] = React.useState<string>("");
  const [frequency, setFrequency] = React.useState<
    "daily" | "weekly" | "monthly" | ""
  >("");
  const [endDate, setEndDate] = React.useState("");

  React.useEffect(() => {
    if (!recurrence) return;

    // Reset on open
    setAmount("");
    setFrequency("");
    setEndDate("");
  }, [recurrence, open]);

  if (!recurrence) return null;

  const handleSubmit = () => {
    onSubmit({
      id: recurrence.id,
      amount: amount ? Number(amount) : undefined,
      frequency: frequency || undefined,
      end_date: endDate || undefined,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Recurring Transaction</DialogTitle>
          <DialogDescription>
            Transaction #{recurrence.id}. You may update one or more fields.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Amount */}
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Amount</label>
            <Input
              type="number"
              placeholder={`Current: ${recurrence.amount}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Frequency */}
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Frequency</label>
            <Select
              value={frequency}
              onValueChange={(v) =>
                setFrequency(v as "daily" | "weekly" | "monthly")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={`Current: ${recurrence.frequency}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* End Date */}
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">
              Extend End Date
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={recurrence.end_date?.split("T")[0]}
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}Save
            Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
