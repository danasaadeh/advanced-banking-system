import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/ui/tabs";
import { Input } from "@/shared/components/ui/input";
import TransactionsPagination from "./trans-pagination";
import { ScheduledTransactionsTable } from "./scheduled-trans-table";
import { RecurringTransactionsTable } from "./recurrent-trans-table";
import { Search, CalendarClock, Repeat } from "lucide-react";

import type { ScheduledTransaction, RecurringTransaction } from "../types";
import { ScheduledTransactionDetailsDialog } from "./sched-details-dialog";
import { EditScheduledTransactionDialog } from "./edit-sched-dialog";
import ConfirmDialog from "@/shared/components/ui/confirm-dialog";
import { EditRecurringTransactionDialog } from "./edit-recurrent-dialog";

export interface ScheduledRecurringTransactionsViewProps {
  scheduledTransactions: ScheduledTransaction[];
  recurringTransactions: RecurringTransaction[];

  onViewScheduleDetails: (s: ScheduledTransaction) => void;
  onEditSchedule: (s: ScheduledTransaction) => void;
  onCancelSchedule: (s: ScheduledTransaction) => void;
  onRetrySchedule: (s: ScheduledTransaction) => void;

  onToggleRecurring: (r: RecurringTransaction, active: boolean) => void;
  onEditRecurring: (r: RecurringTransaction) => void;
  onViewRecurringHistory: (r: RecurringTransaction) => void;
  onTerminateRecurring: (r: RecurringTransaction) => void;
}

const ITEMS_PER_PAGE = 10;

export const ScheduledRecurringTransactionsView: React.FC<
  ScheduledRecurringTransactionsViewProps
> = ({
  scheduledTransactions,
  recurringTransactions,

  onViewScheduleDetails,
  onEditSchedule,
  onCancelSchedule,
  onRetrySchedule,

  onToggleRecurring,
  onEditRecurring,
  onViewRecurringHistory,
  onTerminateRecurring,
}) => {
  const [tab, setTab] = React.useState<"scheduled" | "recurring">("scheduled");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);

  /* ------------------ Filtering ------------------ */
  const filterById = <T extends { id: number }>(items: T[]) =>
    items.filter((i) =>
      search ? i.id.toString().includes(search.trim()) : true
    );

  const filteredScheduled = filterById(scheduledTransactions);

  /* ------------------ Pagination ------------------ */
  const paginate = <T,>(items: T[]) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  };

  const scheduledPage = paginate(filteredScheduled);

  React.useEffect(() => {
    setPage(1);
  }, [tab, search]);

  const [recurringData, setRecurringData] = React.useState(
    recurringTransactions
  );

  const filteredRecurring = filterById(recurringData);
  React.useEffect(() => {
    setRecurringData(recurringTransactions);
  }, [recurringTransactions]);

  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<ScheduledTransaction | null>(
    null
  );
  const recurringPage = paginate(filteredRecurring);

  const totalItems =
    tab === "scheduled" ? filteredScheduled.length : filteredRecurring.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] =
    React.useState<ScheduledTransaction | null>(null);

  const [retryOpen, setRetryOpen] = React.useState(false);
  const [retryTarget, setRetryTarget] =
    React.useState<ScheduledTransaction | null>(null);

  const [terminateOpen, setTerminateOpen] = React.useState(false);
  const [terminateTarget, setTerminateTarget] =
    React.useState<RecurringTransaction | null>(null);

  const [editRecurringOpen, setEditRecurringOpen] = React.useState(false);
  const [editRecurringTarget, setEditRecurringTarget] =
    React.useState<RecurringTransaction | null>(null);

  const handleEditRecurring = (r: RecurringTransaction) => {
    setEditRecurringTarget(r);
    setEditRecurringOpen(true);
  };

  const handleDeleteClick = (tx: ScheduledTransaction) => {
    setDeleteTarget(tx);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log("scheduled delted");
  };

  const handleViewDetails = (tx: ScheduledTransaction) => {
    setSelected(tx);
    setOpen(true);
  };
  const handleEdit = (tx: ScheduledTransaction) => {
    setSelected(tx);
    setEditOpen(true);
  };

  const handleEditSubmit = (payload: {
    id: number;
    amount?: number;
    scheduled_at?: string;
  }) => {
    console.log("Edit scheduled tx:", payload);
    // 🔗 react-query mutation here
  };
  const handleConfirmRetry = () => {
    if (!retryTarget) return;

    console.log("Retry scheduled transaction:", retryTarget.id);

    // UI-only for now
    setRetryOpen(false);
    setRetryTarget(null);
  };

  const handleRetryClick = (tx: ScheduledTransaction) => {
    setRetryTarget(tx);
    setRetryOpen(true);
  };
  const handleConfirmTerminate = () => {
    if (!terminateTarget) return;

    console.log("Terminate recurring transaction:", terminateTarget.id);

    // UI-only
    setTerminateOpen(false);
    setTerminateTarget(null);
  };

  const handleTerminateClick = (r: RecurringTransaction) => {
    setTerminateTarget(r);
    setTerminateOpen(true);
  };

  const handleToggleRecurringActive = (
    recurrence: RecurringTransaction,
    active: boolean
  ) => {
    setRecurringData((prev) =>
      prev.map((r) =>
        r.id === recurrence.id ? { ...r, is_active: active } : r
      )
    );

    console.log("Toggle recurring active:", recurrence.id, active);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">
        Scheduled & Recurring Transactions
      </h1>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        {/* Search LEFT / Tabs RIGHT */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search */}
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Transaction ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Tabs */}
          <TabsList className="w-fit">
            <TabsTrigger
              value="scheduled"
              className="
                flex items-center gap-2
                data-[state=active]:bg-foreground
                data-[state=active]:text-background
              "
            >
              <CalendarClock className="h-4 w-4" />
              Scheduled
            </TabsTrigger>

            <TabsTrigger
              value="recurring"
              className="
                flex items-center gap-2
                data-[state=active]:bg-foreground
                data-[state=active]:text-background
              "
            >
              <Repeat className="h-4 w-4" />
              Recurring
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Scheduled */}
        <TabsContent value="scheduled" className="space-y-4">
          <ScheduledTransactionsTable
            schedules={scheduledPage}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onCancel={handleDeleteClick} // 👈 IMPORTANT
            onRetry={handleRetryClick} // 👈 HERE
          />
        </TabsContent>

        {/* Recurring */}
        <TabsContent value="recurring" className="space-y-4">
          <RecurringTransactionsTable
            recurrences={recurringPage}
            onToggleActive={handleToggleRecurringActive}
            onEdit={handleEditRecurring}
            onViewHistory={onViewRecurringHistory}
            onTerminate={handleTerminateClick} // 👈 HERE
          />
        </TabsContent>
      </Tabs>

      <TransactionsPagination
        currentPage={page}
        setCurrentPage={setPage}
        totalPages={totalPages || 1}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
      />
      <ScheduledTransactionDetailsDialog
        open={open}
        onOpenChange={setOpen}
        transaction={selected}
      />
      <EditScheduledTransactionDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        transaction={selected}
        onSubmit={handleEditSubmit}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Cancel Scheduled Transaction"
        description={
          deleteTarget
            ? `Are you sure you want to cancel scheduled transaction #${deleteTarget.id}? This action cannot be undone.`
            : ""
        }
        confirmLabel="Cancel Transaction"
        cancelLabel="Keep Transaction"
        onConfirm={handleConfirmDelete}
      />
      <ConfirmDialog
        open={retryOpen}
        onOpenChange={setRetryOpen}
        title="Retry Scheduled Transaction"
        description={
          retryTarget
            ? `This will retry the failed scheduled transaction #${retryTarget.id}. Do you want to continue?`
            : ""
        }
        confirmLabel="Retry Transaction"
        cancelLabel="Cancel"
        onConfirm={handleConfirmRetry}
      />
      <ConfirmDialog
        open={terminateOpen}
        onOpenChange={setTerminateOpen}
        title="Terminate Recurring Transaction"
        description={
          terminateTarget
            ? `Are you sure you want to terminate recurring transaction #${terminateTarget.id}? Future executions will be permanently stopped.`
            : ""
        }
        confirmLabel="Terminate"
        cancelLabel="Cancel"
        onConfirm={handleConfirmTerminate}
      />
      <EditRecurringTransactionDialog
        open={editRecurringOpen}
        onOpenChange={setEditRecurringOpen}
        recurrence={editRecurringTarget}
        onSubmit={(payload) => {
          console.log("Edit recurrence payload:", payload);
        }}
      />
    </div>
  );
};
