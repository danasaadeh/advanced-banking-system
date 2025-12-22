import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import RecurringFields from "./recurring-fields";
import ScheduledFields from "./scheduled-fields";
import Field from "./field-helper";

import type { TransactionType } from "../types";
import { useAccounts } from "@/features/account-management/services/accounts.queries";

/* ---------------- TYPES ---------------- */

interface TransactionFormProps {
  type: TransactionType;
  isRecurring: boolean;
  isScheduled: boolean;
  onRecurringChange: (v: boolean) => void;
  onScheduledChange: (v: boolean) => void;
}

/* ---------------- REUSABLE ACCOUNT SELECT ---------------- */

interface AccountSelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder: string;
  accounts: {
    id: number;
    account_number: string;
    currency: string;
  }[];
  isLoading?: boolean;
  disabled?: boolean;
}

const AccountSelect: React.FC<AccountSelectProps> = ({
  value,
  onChange,
  placeholder,
  accounts,
  isLoading,
  disabled,
}) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {/* Loading */}
        {isLoading && (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            Loading accounts...
          </div>
        )}

        {/* Empty */}
        {!isLoading && accounts.length === 0 && (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            No accounts available
          </div>
        )}

        {/* Data */}
        {!isLoading &&
          accounts.map((acc) => (
            <SelectItem key={acc.id} value={String(acc.id)}>
              {acc.account_number} — {acc.currency}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

/* ---------------- MAIN FORM ---------------- */

const TransactionForm: React.FC<TransactionFormProps> = ({
  type,
  isRecurring,
  isScheduled,
  onScheduledChange,
  onRecurringChange,
}) => {
  /* ---------------- ACCOUNT QUERY ---------------- */

  const { data, isLoading } = useAccounts({
    page: 1,
    perPage: 50,
  });

  const accounts =
    data?.data.map((acc) => ({
      id: acc.id,
      account_number: acc.account_number,
      currency: acc.currency,
    })) ?? [];

  /* ---------------- FORM STATE ---------------- */

  const [sourceAccountId, setSourceAccountId] = useState<string>();
  const [targetAccountId, setTargetAccountId] = useState<string>();

  /* Prevent same account in transfers */
  const destinationAccounts =
    type === "transfer"
      ? accounts.filter((acc) => String(acc.id) !== sourceAccountId)
      : accounts;

  return (
    <div className="mt-4 space-y-4">
      {/* ---------------- ACCOUNTS ---------------- */}

      {/* Source Account (Withdrawal & Transfer) */}
      {type !== "deposit" && (
        <Field label="Source Account">
          <AccountSelect
            value={sourceAccountId}
            onChange={setSourceAccountId}
            placeholder="Select source account"
            accounts={accounts}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </Field>
      )}

      {/* Target Account (Deposit) */}
      {type === "deposit" && (
        <Field label="Target Account">
          <AccountSelect
            value={targetAccountId}
            onChange={setTargetAccountId}
            placeholder="Select target account"
            accounts={accounts}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </Field>
      )}

      {/* Destination Account (Transfer) */}
      {type === "transfer" && (
        <Field label="Destination Account">
          <AccountSelect
            value={targetAccountId}
            onChange={setTargetAccountId}
            placeholder="Select destination account"
            accounts={destinationAccounts}
            isLoading={isLoading}
            disabled={isLoading || !sourceAccountId}
          />
        </Field>
      )}

      {/* ---------------- COMMON FIELDS ---------------- */}

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
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="JPY">JPY</SelectItem>
              <SelectItem value="CAD">CAD</SelectItem>
              <SelectItem value="SYR">SYP</SelectItem>
              <SelectItem value="TRY">TRY</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Description">
        <Input placeholder="Optional description" />
      </Field>

      {/* ---------------- SCHEDULED ---------------- */}

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

      {/* ---------------- RECURRING ---------------- */}

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

      {/* ---------------- ACTIONS ---------------- */}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline">Cancel</Button>
        <Button
          disabled={
            (type !== "deposit" && !sourceAccountId) ||
            (type !== "deposit" && type !== "withdrawal" && !targetAccountId)
          }
        >
          Create Transaction
        </Button>
      </div>
    </div>
  );
};

export default TransactionForm;
