// features/customer-service/types/customer-service.types.ts
export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "resolved";
  status_label: string;
  status_color: string;
  user_id: number;
  created_at: string;
  updated_at?: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface TicketResponse {
  data: Ticket[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface TicketFormData {
  title: string;
  description: string;
  status?: "pending" | "in_progress" | "resolved";
}

export const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];