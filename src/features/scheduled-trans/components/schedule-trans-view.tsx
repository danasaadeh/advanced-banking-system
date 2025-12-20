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

  React.useEffect(() => {
    setPage(1);
  }, [tab, search]);

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
            onViewDetails={onViewScheduleDetails}
            onEdit={onEditSchedule}
            onCancel={onCancelSchedule}
            onRetry={onRetrySchedule}
          />
        </TabsContent>

        {/* Recurring */}
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
