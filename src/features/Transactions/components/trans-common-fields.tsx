import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import RecurringFields from "./recurring-fields";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import type { TransactionType } from "../types";
import Field from "./field-helper";
import ScheduledFields from "./scheduled-fields";

interface TransactionFormProps {
  type: TransactionType;
  isRecurring: boolean;
  isScheduled: boolean; // ✅ ADD THIS
  onRecurringChange: (v: boolean) => void;
  onScheduledChange: (v: boolean) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  type,
  isRecurring,
  isScheduled,
  onScheduledChange,
  onRecurringChange,
}) => {
  return (
    <div className="mt-4 space-y-4">
      {/* Type-specific accounts */}
      {type !== "deposit" && (
        <Field label="Source Account">
          <Input placeholder="Select source account" />
        </Field>
      )}

      {type === "deposit" && (
        <Field label="Target Account">
          <Input placeholder="Select target account" />
        </Field>
      )}

      {type === "transfer" && (
        <Field label="Destination Account">
          <Input placeholder="Select destination account" />
        </Field>
      )}

      {/* Common fields */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Amount">
          <Input type="number" placeholder="0.00" />
        </Field>

        <Field label="Currency">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Description">
        <Input placeholder="Optional description" />
      </Field>

      {/* Scheduled Toggle */}
      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <Label>Scheduled Transaction</Label>
          <p className="text-xs text-muted-foreground">
            Execute this transaction on a specific date
          </p>
        </div>
        <Switch checked={isScheduled} onCheckedChange={onScheduledChange} />
      </div>

      {isScheduled && <ScheduledFields />}

      {/* Recurring Toggle */}
      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <Label>Recurring Transaction</Label>
          <p className="text-xs text-muted-foreground">
            Schedule this transaction
          </p>
        </div>
        <Switch checked={isRecurring} onCheckedChange={onRecurringChange} />
      </div>

      {isRecurring && <RecurringFields />}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline">Cancel</Button>
        <Button>Create Transaction</Button>
      </div>
    </div>
  );
};

export default TransactionForm;
