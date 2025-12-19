// features/customer-service/types/customer-service.types.ts
export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: "pending" | "resolved" | "in-progress";
  user_id: number;
  user_name: string;
  user_email: string;
  created_at: string;
  updated_at?: string;
}

export interface TicketResponse {
  data: Ticket[];
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

export interface TicketFormData {
  title: string;
  description: string;
  status: "pending" | "resolved" | "in-progress";
  user_email: string;
}

export const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];