import React from "react";
import { ScheduledRecurringTransactionsView } from "../components/schedule-trans-view";
import {
  useRecurringTransactions,
  useScheduledTransactions,
} from "../services/query";

import { mapScheduledTransaction } from "../utils/map-sched-trans";
import type { RecurringTransaction, RecurringTransactionDTO } from "../types";

// Function to map RecurringTransactionDTO to RecurringTransaction
const mapRecurringTransactionDTO = (
  dto: RecurringTransactionDTO
): RecurringTransaction => {
  return {
    id: dto.id,
    reference_number: dto.reference_number,
    source_account: dto.account?.account_number,
    target_account: dto.target_account?.account_number,
    type: dto.type,
    amount: parseFloat(dto.amount), // Convert the amount from string to number
    currency: dto.account?.currency ?? "USD", // Set a default if currency is missing
    frequency: dto.frequency,
    start_date: dto.start_date,
    end_date: dto.end_date,
    is_active: dto.active, // Note the difference in naming: `active` in DTO, `is_active` in RecurringTransaction
  };
};

export const ScheduledRecurringTransactionsPage: React.FC = () => {
  // Fetch scheduled transactions as before
  const { data, isLoading, isFetching } = useScheduledTransactions({
    page: 1,
    // search will be wired later from the view
  });

  const scheduledTransactions = data?.data.map(mapScheduledTransaction) ?? [];

  // Fetch recurring transactions from the API
  const {
    data: recurringData,
    isLoading: recurringLoading,
    isFetching: recurringFetching,
  } = useRecurringTransactions({
    search: "",
  });

  // Map the RecurringTransactionDTO data to RecurringTransaction
  const recurringTransactions: RecurringTransaction[] =
    recurringData?.data.map(mapRecurringTransactionDTO) ?? [];

  return (
    <ScheduledRecurringTransactionsView
      scheduledTransactions={scheduledTransactions}
      scheduledLoading={isLoading || isFetching} // Scheduled transactions loading state
      recurringTransactions={recurringTransactions} // Recurring transactions data
      recurringLoading={recurringLoading || recurringFetching} // Recurring transactions loading state
      onViewScheduleDetails={(s) => console.log("view", s)}
      onEditSchedule={(s) => console.log("edit", s)}
      onCancelSchedule={(s) => console.log("cancel", s)}
      onRetrySchedule={(s) => console.log("retry", s)}
      onToggleRecurring={(r, active) => console.log("toggle", r, active)}
      onEditRecurring={(r) => console.log("edit recurring", r)}
      onViewRecurringHistory={(r) => console.log("history", r)}
      onTerminateRecurring={(r) => console.log("terminate", r)}
    />
  );
};
