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
import {
  useDeleteScheduledTransaction,
  useScheduledTransactionDetails,
  useTerminateRecurringTransaction,
  useToggleRecurringTransaction,
  useUpdateRecurringTransaction,
  useUpdateScheduledTransaction,
} from "../services/mutation";
import { useNavigate } from "react-router-dom";
import { useCreateScheduledTransaction } from "@/features/transactions/services/mutation";
import type {
  CreateScheduledTransactionPayload,
  TransactionType,
} from "@/features/transactions/types";
import { CancelScheduledTransactionCommand } from "@/features/transactions/commands/cancel-scheduled-transaction-command";
import { RetryScheduledTransactionCommand } from "@/features/transactions/commands/retry-scheduled-transaction-command";
import { TerminateRecurringTransactionCommand } from "@/features/transactions/commands/terminate-recurring-transaction-command";
import { ToggleRecurringTransactionCommand } from "@/features/transactions/commands/toggle-recurring-transaction-command";

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

  scheduledLoading?: boolean; // 👈 NEW
  recurringLoading?: boolean; // NEW for recurring transactions
}

const ITEMS_PER_PAGE = 10;

export const ScheduledRecurringTransactionsView: React.FC<
  ScheduledRecurringTransactionsViewProps
> = ({
  scheduledTransactions,
  recurringTransactions,
  scheduledLoading,
  onViewScheduleDetails,
  onEditSchedule,
  onCancelSchedule,
  onRetrySchedule,

  onToggleRecurring,
  onEditRecurring,

  onTerminateRecurring,
  recurringLoading,
}) => {
  const [tab, setTab] = React.useState<"scheduled" | "recurring">("scheduled");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);

  /* ------------------ Filtering ------------------ */
  const filterByReferenceNumber = <T extends { reference_number: string }>(
    items: T[]
  ) => {
    return items.filter((item) =>
      search
        ? item.reference_number
            .toLowerCase()
            .includes(search.trim().toLowerCase())
        : true
    );
  };

  const filteredScheduled = filterByReferenceNumber(scheduledTransactions);
  const filteredRecurring = filterByReferenceNumber(recurringTransactions);

  /* ------------------ Pagination ------------------ */
  const paginate = <T,>(items: T[]) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  };

  React.useEffect(() => {
    setPage(1);
  }, [tab, search]);

  const [recurringData, setRecurringData] = React.useState(
    recurringTransactions
  );

  React.useEffect(() => {
    setRecurringData(recurringTransactions);
  }, [recurringTransactions]);

  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<ScheduledTransaction | null>(
    null
  );

  const scheduledPage = paginate(filteredScheduled);
  const recurringPage = paginate(filteredRecurring);

  const totalItems =
    tab === "scheduled" ? filteredScheduled.length : filteredRecurring.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] =
    React.useState<ScheduledTransaction | null>(null);

  const [retryOpen, setRetryOpen] = React.useState(false);

  const [terminateOpen, setTerminateOpen] = React.useState(false);
  const [terminateTarget, setTerminateTarget] =
    React.useState<RecurringTransaction | null>(null);

  const [editRecurringOpen, setEditRecurringOpen] = React.useState(false);
  const [editRecurringTarget, setEditRecurringTarget] =
    React.useState<RecurringTransaction | null>(null);

  const { mutate: updateRecurring, isLoading: isUpdatingRecurring } =
    useUpdateRecurringTransaction();

  const handleEditRecurring = (r: RecurringTransaction) => {
    setEditRecurringTarget(r);
    setEditRecurringOpen(true);
  };

  const handleDeleteClick = (tx: ScheduledTransaction) => {
    setDeleteTarget(tx);
    setDeleteOpen(true);
  };
  const { mutate: deleteTransaction, isLoading: isDeleting } =
    useDeleteScheduledTransaction();

  // Wrap the mutate function to return a Promise
  const deleteScheduledTransaction = async (
    id: number
  ): Promise<{ message: string }> => {
    return new Promise((resolve, reject) => {
      deleteTransaction(id, {
        onSuccess: (data) => resolve(data), // Resolve with the expected data
        onError: (error) => reject(error), // Reject with error
      });
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const command = new CancelScheduledTransactionCommand(deleteTarget, {
      deleteScheduledTransaction, // Pass the wrapped function here
    });

    await command.execute();

    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  const handleViewDetails = (tx: ScheduledTransaction) => {
    setSelected(tx); // Set the selected transaction
    setOpen(true); // Open the dialog
  };
  const handleEdit = (tx: ScheduledTransaction) => {
    setSelected(tx);
    setEditOpen(true);
  };
  // Use the mutation hook
  const { mutate: updateTransaction, isLoading } =
    useUpdateScheduledTransaction();
  const handleEditSubmit = (payload: {
    id: number;
    amount?: number;
    scheduled_at?: string;
  }) => {
    const formattedPayload = {
      id: payload.id,
      payload: {
        amount: payload.amount,
        scheduledAt: payload.scheduled_at, // Note: 'scheduledAt' (camelCase) instead of 'scheduled_at' (snake_case)
      },
    };

    updateTransaction(formattedPayload); // Call the mutation with the corrected payload
    setEditOpen(false); // Close the edit dialog after submission
  };

  const [retryTarget, setRetryTarget] =
    React.useState<ScheduledTransaction | null>(null);

  // const { data: retryDetails, isLoading: isRetryLoading } =
  //   useScheduledTransactionDetails(retryTarget?.id ?? null);

  const { mutate: createScheduled, isLoading: isRetrying } =
    useCreateScheduledTransaction();

  function mapScheduledToCreatePayload(
    dto: any
  ): CreateScheduledTransactionPayload {
    return {
      // ✅ THIS is the real type from the backend
      type: dto.type as TransactionType, // "deposit" | "withdrawal" | "transfer"

      amount: Number(dto.amount),
      scheduled_at: dto.scheduled_at,

      // backend expects account_id
      account_id: dto.account_id,

      // only for transfers
      ...(dto.type === "transfer"
        ? { target_account_id: dto.target_account_id }
        : {}),
    };
  }
  const handleConfirmRetry = async () => {
    if (!retryTarget) return;

    const command = new RetryScheduledTransactionCommand(retryTarget, {
      fetchScheduledDetails: (id) =>
        useScheduledTransactionDetails(id)
          .refetch()
          .then((r) => r.data),
      createScheduledTransaction: (payload) =>
        new Promise((resolve, reject) =>
          createScheduled(payload, { onSuccess: resolve, onError: reject })
        ),
    });

    await command.execute();

    setRetryOpen(false);
    setRetryTarget(null);
  };

  const handleRetryClick = (tx: ScheduledTransaction) => {
    setRetryTarget(tx);
    setRetryOpen(true);
  };

  const { mutate: terminateRecurring, isLoading: isTerminating } =
    useTerminateRecurringTransaction();

  const handleConfirmTerminate = async () => {
    if (!terminateTarget) return;

    const command = new TerminateRecurringTransactionCommand(terminateTarget, {
      terminateRecurring: (id) =>
        new Promise((resolve, reject) =>
          terminateRecurring(id, { onSuccess: resolve, onError: reject })
        ),
    });

    await command.execute();

    setTerminateOpen(false);
    setTerminateTarget(null);
  };

  const navigate = useNavigate();
  const onViewRecurringHistory = (recurrence: RecurringTransaction) => {
    navigate(
      `/dashboard/transactions?search=${recurrence.reference_number}&status=completed`,
      { replace: true } // ✅ This replaces the current URL
    );
  };

  const handleTerminateClick = (r: RecurringTransaction) => {
    setTerminateTarget(r);
    setTerminateOpen(true);
  };

  const { mutate: toggleRecurring, isLoading: isToggling } =
    useToggleRecurringTransaction();

  const handleToggleRecurringActive = async (
    recurrence: RecurringTransaction,
    active: boolean
  ) => {
    const command = new ToggleRecurringTransactionCommand(recurrence, active, {
      toggleRecurring: ({ id, isActive }) =>
        new Promise((resolve, reject) =>
          toggleRecurring(
            { id, isActive },
            {
              onSuccess: resolve,
              onError: reject,
            }
          )
        ),
    });

    await command.execute();

    // optimistic UI update
    setRecurringData((prev) =>
      prev.map((r) =>
        r.id === recurrence.id ? { ...r, is_active: active } : r
      )
    );
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
              placeholder="Search by Transaction Reference Number"
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
            loading={scheduledLoading} // 👈 HERE
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
            loading={scheduledLoading} // 👈 Pass scheduled loading state
            recurrences={recurringPage}
            onToggleActive={handleToggleRecurringActive}
            onEdit={handleEditRecurring}
            onViewHistory={onViewRecurringHistory}
            onTerminate={handleTerminateClick} // 👈 HERE
            isToggling={isToggling}
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
        isLoading={isLoading}
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
        loading={isDeleting} // ✅ Use `loading` instead of `disabled`
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
        loading={isTerminating}
      />
      <EditRecurringTransactionDialog
        open={editRecurringOpen}
        onOpenChange={setEditRecurringOpen}
        recurrence={editRecurringTarget}
        onSubmit={(payload: {
          id: number;
          amount?: number;
          frequency?: "daily" | "weekly" | "monthly";
          endDate?: string;
        }) => {
          if (!editRecurringTarget) return;

          // Call the mutation
          updateRecurring(
            {
              id: editRecurringTarget.id,
              payload,
            },
            {
              onSuccess: () => {
                setEditRecurringOpen(false); // Close dialog on success
              },
            }
          );
        }}
        isLoading={isUpdatingRecurring} // Pass loading state to dialog
      />
    </div>
  );
};
