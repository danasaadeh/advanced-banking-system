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

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import RecurringFields from "./recurring-fields";
import ScheduledFields from "./scheduled-fields";
import Field from "./field-helper";

import type { TransactionType } from "../types";

import { useAccounts } from "@/features/account-management/services/accounts.queries";
import { type AddTransactionFormValues, addTransactionSchema } from "./config";

/* ---------------- TYPES ---------------- */

interface TransactionFormProps {
  type: TransactionType;
  isRecurring: boolean;
  isScheduled: boolean;
  onRecurringChange: (v: boolean) => void;
  onScheduledChange: (v: boolean) => void;
  isSubmitting: boolean;
  onCancel: () => void;

  onSubmit: (values: AddTransactionFormValues) => void;
}

/* ---------------- COMPONENT ---------------- */

const TransactionForm: React.FC<TransactionFormProps> = ({
  type,
  isRecurring,
  isScheduled,
  onRecurringChange,
  onScheduledChange,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  /* ---------------- ACCOUNTS ---------------- */

  const { data, isLoading } = useAccounts({ page: 1, perPage: 50 });

  const accounts =
    data?.data.map((acc) => ({
      id: acc.id,
      label: `${acc.account_number} — ${acc.currency}`,
    })) ?? [];

  /* ---------------- FORM ---------------- */
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddTransactionFormValues>({
    resolver: yupResolver(addTransactionSchema, {
      context: { isScheduled, isRecurring },
    }),
    mode: "onTouched",
    defaultValues: {
      type,
      currency: "USD",
    },
  });

  /* ---------------- UI ---------------- */

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
      {/* Source Account */}
      {type !== "deposit" && (
        <Field label="Source Account" error={errors.sourceAccountId?.message}>
          <Controller
            name="sourceAccountId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={String(acc.id)}>
                      {acc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      )}

      {/* Target Account */}
      {type !== "withdrawal" && (
        <Field label="Target Account" error={errors.targetAccountId?.message}>
          <Controller
            name="targetAccountId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={String(acc.id)}>
                      {acc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      )}

      {/* Amount & Currency */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Amount" error={errors.amount?.message}>
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <Input type="number" placeholder="0.00" {...field} />
            )}
          />
        </Field>

        <Field label="Currency" error={errors.currency?.message}>
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {["USD", "EUR", "GBP", "JPY", "CAD", "TRY", "SYP"].map(
                    (c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      {/* Description */}
      <Field label="Description" error={errors.description?.message}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Input placeholder="Optional description" {...field} />
          )}
        />
      </Field>

      {/* Scheduled */}
      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <Label>Scheduled Transaction</Label>
        </div>
        <Switch checked={isScheduled} onCheckedChange={onScheduledChange} />
      </div>

      {isScheduled && <ScheduledFields control={control} errors={errors} />}

      {/* Recurring */}
      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <Label>Recurring Transaction</Label>
        </div>
        <Switch checked={isRecurring} onCheckedChange={onRecurringChange} />
      </div>

      {isRecurring && <RecurringFields control={control} errors={errors} />}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-40"
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting} className="w-40">
          {isSubmitting ? "Creating..." : "Create Transaction"}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
