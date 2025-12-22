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
