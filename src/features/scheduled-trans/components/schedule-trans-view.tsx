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

import type { ScheduledTransaction, RecurringTransaction } from "../types";

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
  const filteredRecurring = filterById(recurringTransactions);

  /* ------------------ Pagination ------------------ */
  const paginate = <T,>(items: T[]) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  };

  const scheduledPage = paginate(filteredScheduled);
  const recurringPage = paginate(filteredRecurring);

  const totalItems =
    tab === "scheduled" ? filteredScheduled.length : filteredRecurring.length;

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  /* Reset page on tab or search change */
  React.useEffect(() => {
    setPage(1);
  }, [tab, search]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">
          Scheduled & Recurring Transactions
        </h1>

        {/* Search */}
        <Input
          placeholder="Search by Transaction ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-64"
        />
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="recurring">Recurring</TabsTrigger>
        </TabsList>

        {/* ---------------- Scheduled ---------------- */}
        <TabsContent value="scheduled" className="space-y-4">
          <ScheduledTransactionsTable
            schedules={scheduledPage}
            onViewDetails={onViewScheduleDetails}
            onEdit={onEditSchedule}
            onCancel={onCancelSchedule}
            onRetry={onRetrySchedule}
          />
        </TabsContent>

        {/* ---------------- Recurring ---------------- */}
        <TabsContent value="recurring" className="space-y-4">
          <RecurringTransactionsTable
            recurrences={recurringPage}
            onToggleActive={onToggleRecurring}
            onEdit={onEditRecurring}
            onViewHistory={onViewRecurringHistory}
            onTerminate={onTerminateRecurring}
          />
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      <TransactionsPagination
        currentPage={page}
        setCurrentPage={setPage}
        totalPages={totalPages || 1}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </div>
  );
};
