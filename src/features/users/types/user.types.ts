// features/users/types/user.types.ts
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  email: string;
  phone: string;
  national_id: string;
  date_of_birth: string;
  address: string;
  status: "active" | "inactive" | "suspended";
  roles: string[];
  created_at: string;
  updated_at?: string;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
  first_page_url: string;
  last_page_url: string;
  prev_page_url: string | null;
  next_page_url: string | null;
}

export interface UsersResponse {
  data: User[];
  pagination: Pagination;
}

export interface UserFormData {
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  phone: string;
  national_id: string;
  date_of_birth: string;
  address: string;
  roles: string[];
}

export const ROLES_OPTIONS = [
  { value: "Admin", label: "Administrator" },
  { value: "Manager", label: "Manager" },
  { value: "Teller", label: "Teller" },
  { value: "Customer", label: "Customer" },
];