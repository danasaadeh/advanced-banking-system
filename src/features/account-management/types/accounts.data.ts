/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type Role = "customer" | "manager" | "admin";
export type AccountStatus = "active" | "frozen" | "suspended" | "closed";

/* ------------------ Core Entities ------------------ */

export interface AccountType {
  id: number;
  name: "Savings" | "Checking" | "Family" | "Investment";
  description?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  is_owner?: boolean;
}

export interface AccountState {
  state: AccountStatus;
  changed_by: number;
  changed_at: string;
}

/* ------------------ Create Payload ------------------ */

export interface CreateAccountPayload {
  account_type_id: number;
  parent_account_id?: number | null;
  currency: string;
  initial_deposit: number;
  user_ids: number[];
  owner_user_id: number;
}


/* ------------------ Account Models ------------------ */

export interface Account {
  id: number;
  account_number: string;
  balance: number;
  currency: string;
  account_type: AccountType;
  users: User[];
  current_state: AccountState;
  features: any[];
  children: Account[];
  children_count: number;
  parent_account_id?: number | null;
  created_at: string;
  updated_at?: string;
}

export interface AccountGroup extends Account {}

/* ------------------ API Responses ------------------ */

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

export interface AccountGroupsResponse {
  data: AccountGroup[];
  pagination: Pagination;
}

export interface AccountGroupResponse {
  data: AccountGroup;
}

export interface Feature {
  id: number;
  name: string;
}


export interface AccountCreationDataResponse {
  users: User[];
  account_types: AccountType[];
  features: Feature[];
  account_groups: Pick<AccountGroup, "id" | "account_number" | "currency">[];
}


export const initialAccounts: Account[] = [
  {
    id: 1,
    account_number: "G-AC-0000000001",
    balance: 0,
    currency: "USD",
    account_type: {
      id: 1,
      name: "Savings",
      description: "Personal savings account with interest calculated on balance",
    },
    users: [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        is_owner: true,
      },
      {
        id: 2,
        name: "Jane Doe",
        email: "jane.doe@example.com",
        is_owner: false,
      },
    ],
    current_state: {
      state: "active",
      changed_by: 1,
      changed_at: "2025-12-19 15:42:52",
    },
    features: [],
    children: [],
    children_count: 0,
    parent_account_id: null,
    created_at: "2025-12-19 15:42:52",
    updated_at: "2025-12-19 15:42:52",
  },
];
