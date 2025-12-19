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
  closed_reason?: string; 
  closed_at?: string;     
}


export const initialAccounts: Account[] = [
  {
    id: 1,
    account_number: "FAM-0001",
    type_name: "Family",
    status: "active",
    currency: "USD",
    balance: 50000,
    created_at: "2024-01-01",
    isPremium: true,
    children: [
      {
        id: 2,
        account_number: "SAV-1001",
        type_name: "Savings",
        status: "active",
        currency: "USD",
        balance: 15000,
        created_at: "2024-01-10",
        parent_account_id: 1,
      },
    ],
  },
];
