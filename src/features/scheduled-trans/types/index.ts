export type ScheduledTransactionStatus =
  | "scheduled"
  | "executed"
  | "failed"
  | "cancelled";

export type ScheduledTransactionType = "deposit" | "withdrawal" | "transfer";

export interface ScheduledTransaction {
  id: number;
  source_account?: string; // not required for deposit
  target_account?: string; // not required for withdrawal
  type: ScheduledTransactionType;
  amount: number;
  currency: string;
  scheduled_at: string;
  status: ScheduledTransactionStatus;
  created_by: string;
}

export type RecurrenceFrequency = "daily" | "weekly" | "monthly";

export interface RecurringTransaction {
  id: number;
  source_account?: string;
  target_account?: string;
  type: "deposit" | "withdrawal" | "transfer";
  amount: number;
  currency: string;

  frequency: RecurrenceFrequency;
  start_date: string;
  end_date?: string;

  is_active: boolean;
}
