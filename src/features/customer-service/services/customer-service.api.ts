// features/customer-service/services/customer-service.api.ts
import type { Ticket, TicketResponse, TicketFormData } from "../types/customer-service.types";

// Mock data
const mockTickets: Ticket[] = [
  {
    id: 1,
    title: "Unable to login to account",
    description: "I cannot login to my account even with correct credentials. Getting authentication error.",
    status: "pending",
    user_id: 101,
    user_name: "Ahmed Mohammed",
    user_email: "ahmed@example.com",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    title: "Transaction failed but amount deducted",
    description: "Tried to transfer $500 but transaction failed. However, amount was deducted from my account.",
    status: "resolved",
    user_id: 102,
    user_name: "Fatima Ali",
    user_email: "fatima@example.com",
    created_at: "2024-01-14T14:45:00Z",
    updated_at: "2024-01-14T16:30:00Z",
  },
  {
    id: 3,
    title: "Account statement not updating",
    description: "My account statement is not showing transactions from the last 3 days.",
    status: "in-progress",
    user_id: 103,
    user_name: "Mohammed Hassan",
    user_email: "mohammed@example.com",
    created_at: "2024-01-16T09:15:00Z",
  },
  {
    id: 4,
    title: "Card blocked unexpectedly",
    description: "My debit card was blocked without any notification. Need immediate assistance.",
    status: "pending",
    user_id: 104,
    user_name: "Sarah Khalid",
    user_email: "sarah@example.com",
    created_at: "2024-01-16T11:20:00Z",
  },
  {
    id: 5,
    title: "Wrong interest calculation",
    description: "The interest calculated on my savings account seems incorrect for December.",
    status: "resolved",
    user_id: 105,
    user_name: "Omar Ahmed",
    user_email: "omar@example.com",
    created_at: "2024-01-13T16:10:00Z",
    updated_at: "2024-01-14T10:00:00Z",
  },
  {
    id: 6,
    title: "Mobile app crashing",
    description: "The banking app crashes every time I try to view my transaction history.",
    status: "in-progress",
    user_id: 106,
    user_name: "Layla Mohammed",
    user_email: "layla@example.com",
    created_at: "2024-01-17T08:45:00Z",
  },
  {
    id: 7,
    title: "Missing transaction receipt",
    description: "Did not receive receipt for a wire transfer made yesterday.",
    status: "pending",
    user_id: 107,
    user_name: "Khalid Abdullah",
    user_email: "khalid@example.com",
    created_at: "2024-01-17T13:30:00Z",
  },
  {
    id: 8,
    title: "Password reset not working",
    description: "The password reset link sent to my email is not working.",
    status: "resolved",
    user_id: 108,
    user_name: "Noura Saleh",
    user_email: "noura@example.com",
    created_at: "2024-01-12T10:00:00Z",
    updated_at: "2024-01-12T14:30:00Z",
  },
];

class CustomerServiceApiService {
  async getTickets(
    search: string = "",
    status: string = "all",
    page: number = 1,
    perPage: number = 10
  ): Promise<TicketResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredTickets = [...mockTickets];

    // Filter by search
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filteredTickets = filteredTickets.filter(ticket =>
        ticket.title.toLowerCase().includes(searchLower) ||
        ticket.description.toLowerCase().includes(searchLower) ||
        ticket.user_name.toLowerCase().includes(searchLower) ||
        ticket.user_email.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (status !== "all") {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
    }

    // Pagination
    const total = filteredTickets.length;
    const totalPages = Math.ceil(total / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, total);

    const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

    return {
      data: paginatedTickets,
      pagination: {
        current_page: page,
        last_page: totalPages,
        total,
        per_page: perPage,
      },
    };
  }

  async createTicket(ticketData: TicketFormData): Promise<{ success: boolean; message: string; data: Ticket }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newTicket: Ticket = {
      id: mockTickets.length + 1,
      title: ticketData.title,
      description: ticketData.description,
      status: ticketData.status,
      user_id: 999, // Mock user ID
      user_name: "Customer",
      user_email: ticketData.user_email,
      created_at: new Date().toISOString(),
    };

    mockTickets.unshift(newTicket);

    return {
      success: true,
      message: "Ticket created successfully",
      data: newTicket,
    };
  }

  async updateTicketStatus(ticketId: number, status: "pending" | "resolved" | "in-progress"): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) {
      throw new Error("Ticket not found");
    }

    mockTickets[ticketIndex].status = status;
    mockTickets[ticketIndex].updated_at = new Date().toISOString();

    return {
      success: true,
      message: `Ticket status updated to ${status}`,
    };
  }
}

export const customerServiceApiService = new CustomerServiceApiService();