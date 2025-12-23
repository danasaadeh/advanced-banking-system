import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectItem } from "@/shared/components/ui/select";
import TransactionForm from "./trans-common-fields";
import {
  useCreateRecurringTransaction,
  useCreateScheduledTransaction,
  useCreateTransaction,
} from "../services/mutation";
import type { AddTransactionFormValues } from "./config";

type TransactionType = "deposit" | "withdrawal" | "transfer";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddTransactionDialog: React.FC<Props> = ({
  open,
  onOpenChange,
}) => {
  const [type, setType] = React.useState<TransactionType>("deposit");
  const [isRecurring, setIsRecurring] = React.useState(false);
  const [isScheduled, setIsScheduled] = React.useState(false);

  const createTx = useCreateTransaction();
  const createScheduledTx = useCreateScheduledTransaction();
  const createRecurringTx = useCreateRecurringTransaction();
  const isSubmitting =
    createTx.isPending ||
    createScheduledTx.isPending ||
    createRecurringTx.isPending;

  const handleCreate = (values: AddTransactionFormValues) => {
    if (isRecurring) {
      createRecurringTx.mutate({
        type: values.type,
        amount: values.amount,
        frequency: values.frequency!,
        start_date: values.start_date!,
        end_date: values.end_date,
        description: values.description,
        account_id: values.sourceAccountId
          ? Number(values.sourceAccountId)
          : undefined,
        target_account_id: values.targetAccountId
          ? Number(values.targetAccountId)
          : undefined,
      });
      return;
    }

    if (isScheduled) {
      createScheduledTx.mutate({
        type: values.type,
        amount: values.amount,
        scheduled_at: values.scheduled_at!,
        description: values.description,
        account_id: values.sourceAccountId
          ? Number(values.sourceAccountId)
          : undefined,
        target_account_id: values.targetAccountId
          ? Number(values.targetAccountId)
          : undefined,
      });
      return;
    }

    createTx.mutate({
      type: values.type,
      amount: values.amount,
      currency: values.currency,
      description: values.description,
      sourceAccountId: values.sourceAccountId
        ? Number(values.sourceAccountId)
        : undefined,
      targetAccountId: values.targetAccountId
        ? Number(values.targetAccountId)
        : undefined,
    });
  };

  const handleRecurringChange = (v: boolean) => {
    setIsRecurring(v);
    if (v) setIsScheduled(false);
  };

  const handleScheduledChange = (v: boolean) => {
    setIsScheduled(v);
    if (v) setIsRecurring(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* ✅ SCROLLABLE CONTENT */}
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Add Transaction</DialogTitle>
        </DialogHeader>

        <Tabs value={type} onValueChange={(v) => setType(v as TransactionType)}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdrawal">Withdrawal</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
          </TabsList>

          <TabsContent value="deposit">
            <TransactionForm
              isSubmitting={isSubmitting}
              onCancel={() => onOpenChange(false)}
              type="deposit"
              isRecurring={isRecurring}
              isScheduled={isScheduled}
              onRecurringChange={handleRecurringChange}
              onScheduledChange={handleScheduledChange}
              onSubmit={handleCreate}
            />
          </TabsContent>

          <TabsContent value="withdrawal">
            <TransactionForm
              isSubmitting={isSubmitting}
              onCancel={() => onOpenChange(false)}
              type="withdrawal"
              isRecurring={isRecurring}
              isScheduled={isScheduled}
              onRecurringChange={handleRecurringChange}
              onScheduledChange={handleScheduledChange}
              onSubmit={handleCreate}
            />
          </TabsContent>

          <TabsContent value="transfer">
            <TransactionForm
              isSubmitting={isSubmitting}
              onCancel={() => onOpenChange(false)}
              type="transfer"
              isRecurring={isRecurring}
              isScheduled={isScheduled}
              onRecurringChange={handleRecurringChange}
              onScheduledChange={handleScheduledChange}
              onSubmit={handleCreate}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
