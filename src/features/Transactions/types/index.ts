export type TransactionDirection = "credit" | "debit";

export type TransactionType = "deposit" | "withdrawal" | "transfer";

export type TransactionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed";

export interface Transaction {
  id: number;
  reference_number: string;
  type: TransactionType;
  direction: TransactionDirection;
  amount: number;
  currency: string;
  status: TransactionStatus;
  approved_by?: string | null;
  account: string;
  created_at: string;
}
