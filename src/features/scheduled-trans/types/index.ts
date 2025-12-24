// ===== Scheduled Transaction =====
export type ScheduledTransactionStatus =
  | "scheduled"
  | "executed"
  | "failed"
  | "cancelled";

export type ScheduledTransactionType = "deposit" | "withdrawal" | "transfer";

export interface ScheduledTransaction {
  id: number; // Keep `id` for internal use
  reference_number: string; // This is the reference number you want to show in the table
  source_account?: string; // Not required for deposit
  target_account?: string; // Not required for withdrawal
  type: ScheduledTransactionType;
  amount: number;
  currency: string;
  scheduled_at: string;
  status: ScheduledTransactionStatus;
  created_by: string;
}

export type RecurrenceFrequency = "daily" | "weekly" | "monthly";

export interface RecurringTransaction {
  id: number; // Keep `id` for internal use
  reference_number: string; // This is the reference number you want to show in the table
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

// ===== Integration =====

// ===== Account =====
export interface AccountDTO {
  id: number;
  account_number: string;
  balance: string;
  currency: string;
}

// ===== Creator =====
export interface UserDTO {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

// ===== Scheduled Transaction DTO =====
export interface ScheduledTransactionDTO {
  id: number; // Keep `id` for internal use
  reference_number: string; // Display `reference_number` in the table

  account_id: number | null;
  target_account_id: number | null;
  type: ScheduledTransactionType;
  amount: string;
  scheduled_at: string;
  status: ScheduledTransactionStatus;
  created_at: string;
  updated_at: string;
  account: AccountDTO | null;
  target_account: AccountDTO | null;
  creator: UserDTO;
}

// ===== API Response =====
export interface ScheduledTransactionsResponse {
  data: ScheduledTransactionDTO[];
  meta: PaginationMeta;
}

// ===== Filters =====
export interface ScheduledTransactionsFilters {
  page?: number;
  search?: string; // e.g. MTX-9655202
}

// ===== Recurring Transaction =====
export interface RecurringTransaction {
  id: number; // Keep `id` for internal use
  reference_number: string; // This is the reference number you want to show in the table
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

// ===== API Response for Recurring Transactions =====
export interface RecurringTransactionDTO {
  id: number; // Keep `id` for internal use
  reference_number: string; // Display `reference_number` in the table
  account_id: number | null;
  target_account_id: number | null;
  type: "deposit" | "withdrawal" | "transfer";
  amount: string;
  scheduled_at: string;
  status: ScheduledTransactionStatus;
  frequency: RecurrenceFrequency;
  start_date: string;
  end_date?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  account: AccountDTO | null;
  target_account: AccountDTO | null;
  creator: UserDTO;
}

export interface RecurringTransactionsResponse {
  data: RecurringTransactionDTO[];
  meta: PaginationMeta;
}

// Filters for Recurring Transactions
export interface RecurringTransactionsFilters {
  search?: string;
}

// ===== Pagination =====
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  filters: any[];
}
