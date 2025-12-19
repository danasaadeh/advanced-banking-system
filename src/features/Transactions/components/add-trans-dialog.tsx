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
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>

        <Tabs value={type} onValueChange={(v) => setType(v as TransactionType)}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdrawal">Withdrawal</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
          </TabsList>

          {/* Deposit */}
          <TabsContent value="deposit">
            <TransactionForm
              type="deposit"
              isRecurring={isRecurring}
              isScheduled={isScheduled}
              onRecurringChange={handleRecurringChange}
              onScheduledChange={handleScheduledChange}
            />
          </TabsContent>

          {/* Withdrawal */}
          <TabsContent value="withdrawal">
            <TransactionForm
              type="withdrawal"
              isRecurring={isRecurring}
              isScheduled={isScheduled}
              onRecurringChange={handleRecurringChange}
              onScheduledChange={handleScheduledChange}
            />
          </TabsContent>

          {/* Transfer */}
          <TabsContent value="transfer">
            <TransactionForm
              type="transfer"
              isRecurring={isRecurring}
              isScheduled={isScheduled}
              onRecurringChange={handleRecurringChange}
              onScheduledChange={handleScheduledChange}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
