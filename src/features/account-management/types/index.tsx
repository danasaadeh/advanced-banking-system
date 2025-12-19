export type Role = "customer" | "manager" | "admin";
export type AccountStatus = "active" | "inactive" | "closed";
export type AccountType = "Savings" | "Checking" | "Family" | "Investment";

export interface Account {
  id: number;
  account_number: string;
  type_name: AccountType;
  status: AccountStatus;
  currency: string;
  balance: number;
  created_at: string;
  parent_account_id?: number | null;
  children?: Account[];
  isPremium?: boolean;
}
