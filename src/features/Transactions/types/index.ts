export type TransactionDirection = "credit" | "debit";

export type TransactionType = "deposit" | "withdrawal" | "transfer";

export type TransactionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed";

export interface TransactionAccount {
  id: number;
  account_number: string;
  currency: string;
  account_type: string;
}

export interface TransactionInitiator {
  first_name: string;
  last_name: string;
}

export interface Transaction {
  id: number;
  reference_number: string;
  description: string;

  type_label: string;
  status_label: string;
  direction_label: string;

  amount: number;
  currency: string;

  initiated_by: TransactionInitiator;

  created_at: string;
  approved_at: string | null;

  source_account: TransactionAccount;
  target_account: TransactionAccount;
}
export interface TransactionsMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  applied_filters: string[];
  filter_count: number;
}
export interface TransactionsResponse {
  success: boolean;
  data: Transaction[];
  meta: TransactionsMeta;
}
export interface TransactionsFilters {
  page?: number;
  trans_type?: string;
  status?: string;
  direction?: string;
  from_date?: string;
  to_date?: string;
  search?: string;
}

// features/transactions/types/transaction-details.ts

export interface TransactionAuditTrail {
  timestamp: string;
  action: string;
  user: string;
}

export interface TransactionBasicInfo {
  type: "deposit" | "withdrawal" | "transfer";
  amount: number;
  currency: string;
  direction: "credit" | "debit";
  status: "pending" | "approved" | "rejected" | "completed";
  date: string;
  description: string;
}

export interface TransactionAccountDetails {
  sourceAccount: string | null;
  targetAccount: string | null;
}

export interface TransactionExecutionLogic {
  feeStrategyUsed: string;
  interestApplied: number;
}

export interface TransactionApprovalWorkflow {
  approvedBy: string | null;
  approvalDate: string | null;
  workflowPath: string;
  comments: string | null;
}

export interface TransactionDetails {
  id: number;
  referenceNumber: string;
  basicInfo: TransactionBasicInfo;
  accountDetails: TransactionAccountDetails;
  executionLogic: TransactionExecutionLogic;
  approvalWorkflow: TransactionApprovalWorkflow;
  auditTrail: TransactionAuditTrail[];
}

export type UpdateTransactionStatusPayload = {
  transactionId: number;
  status: "approved" | "rejected";
};

export type UpdateTransactionStatusResponse = {
  message: string;
  transaction: {
    id: number;
    status: string;
    updated_at: string;
  };
};

export interface CreateTransactionPayload {
  type: TransactionType;
  amount: number;
  currency: string;
  description?: string;

  sourceAccountId?: number;
  targetAccountId?: number;
}

export interface CreateTransactionSuccessResponse {
  message: string;
  transaction: {
    id: number;
    reference_number: string;
    status: string;
    created_at: string;
  };
}

export interface CreateTransactionRequiresApprovalResponse {
  message: string;
  requires_approval: true;
  allowed_roles: string[];
  transaction_id: number;
}

export interface CreateScheduledTransactionPayload {
  type: TransactionType;
  amount: number;
  scheduled_at: string; // ISO string
  description?: string;

  account_id?: number; // source
  target_account_id?: number; // target
}

export interface ScheduledTransaction {
  id: number;
  type: TransactionType;
  amount: string;
  scheduled_at: string;
  status: "scheduled";
  created_at: string;
  updated_at: string;
  created_by: number;
  account_id?: number;
  target_account_id?: number;
}

export interface CreateScheduledTransactionResponse {
  message: string;
  data: ScheduledTransaction;
}

export type RecurringFrequency = "daily" | "weekly" | "monthly";

export interface CreateRecurringTransactionPayload {
  type: TransactionType;
  amount: number;
  frequency: RecurringFrequency;
  start_date: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  description?: string;

  account_id?: number; // source
  target_account_id?: number; // target
}

export interface RecurringTransaction {
  id: number;
  type: TransactionType;
  amount: string;
  frequency: RecurringFrequency;
  start_date: string;
  end_date: string | null;
  active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;

  account_id?: number;
  target_account_id?: number;
}

export interface CreateRecurringTransactionResponse {
  message: string;
  data: RecurringTransaction;
}

export type Frequency = "daily" | "weekly" | "monthly";

export interface TransactionFormState {
  type: TransactionType;

  sourceAccountId?: string;
  targetAccountId?: string;

  amount: string;
  currency: string;
  description?: string;

  // scheduled
  scheduled_at?: string;

  // recurring
  frequency?: Frequency;
  start_date?: string;
  end_date?: string;
}
// export interface Transaction {
//   id: number;
//   reference_number: string;
//   type: TransactionType;
//   direction: TransactionDirection;
//   amount: number;
//   currency: string;
//   status: TransactionStatus;
//   approved_by?: string | null;
//   account: string;
//   created_at: string;
// }
