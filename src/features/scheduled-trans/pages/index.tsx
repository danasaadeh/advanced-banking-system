import React from "react";
import { ScheduledRecurringTransactionsView } from "../components/schedule-trans-view";
import type { ScheduledTransaction, RecurringTransaction } from "../types";

export const ScheduledRecurringTransactionsPage: React.FC = () => {
  // 🔹 Replace later with API / Redux / React Query
  const scheduledTransactions: ScheduledTransaction[] = [
    {
      id: 1,
      type: "transfer",
      amount: 1250.0,
      currency: "USD",
      scheduled_at: "2023-12-25T10:00:00Z",
      status: "scheduled",
      source_account: "Personal Checking (...4521)",
      target_account: "Savings Account (...8892)",
      created_by: "Dana (Customer)",
    },
    {
      id: 2,
      type: "withdrawal",
      amount: 50.0,
      currency: "USD",
      scheduled_at: "2023-12-20T15:30:00Z",
      status: "failed", // This triggers the "Retry" action in the UI
      source_account: "Personal Checking (...4521)",
      created_by: "System (Auto-Pay)",
    },
    {
      id: 3,
      type: "deposit",
      amount: 3000.0,
      currency: "USD",
      scheduled_at: "2024-01-05T09:00:00Z",
      status: "scheduled",
      target_account: "Investment Portfolio (...1102)",
      created_by: "Admin_User_01",
    },
    {
      id: 4,
      type: "transfer",
      amount: 450.0,
      currency: "USD",
      scheduled_at: "2023-12-18T12:00:00Z",
      status: "cancelled",
      source_account: "Personal Checking (...4521)",
      target_account: "External Account",
      created_by: "Dana (Customer)",
    },
  ];

  // 🔹 Mock Data for Recurring Templates (Matching your exact Interface)
  const recurringTransactions: RecurringTransaction[] = [
    {
      id: 101,
      type: "transfer",
      amount: 200.0,
      currency: "USD",
      frequency: "monthly",
      start_date: "2023-11-01",
      end_date: "2024-11-01",
      is_active: true, // Show as Active/Green in UI
      source_account: "Salary Account (...9901)",
      target_account: "Emergency Fund (...0012)",
    },
    {
      id: 102,
      type: "withdrawal",
      amount: 14.99,
      currency: "USD",
      frequency: "weekly",
      start_date: "2023-12-01",
      // end_date is optional based on your interface
      is_active: false, // Show as Paused/Gray in UI
      source_account: "Personal Checking (...4521)",
    },
    {
      id: 103,
      type: "deposit",
      amount: 500.0,
      currency: "USD",
      frequency: "daily",
      start_date: "2023-12-15",
      end_date: "2023-12-30",
      is_active: true,
      target_account: "Business Account (...7721)",
    },
  ];

  return (
    <ScheduledRecurringTransactionsView
      scheduledTransactions={scheduledTransactions}
      recurringTransactions={recurringTransactions}
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
