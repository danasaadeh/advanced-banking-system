import type{ Account } from "@/features/account-management/types";

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
      {
        id: 3,
        account_number: "CHK-2001",
        type_name: "Checking",
        status: "inactive",
        currency: "EUR",
        balance: 500,
        created_at: "2024-02-05",
        parent_account_id: 1,
      },
      {
        id: 4,
        account_number: "INV-3001",
        type_name: "Investment",
        status: "closed",
        currency: "USD",
        balance: 20000,
        created_at: "2024-03-01",
        parent_account_id: 1,
      },
    ],
  },
  {
    id: 5,
    account_number: "SAV-0002",
    type_name: "Savings",
    status: "active",
    currency: "GBP",
    balance: 1000,
    created_at: "2024-01-20",
    isPremium: false,
  },
  // ... other accounts
];
