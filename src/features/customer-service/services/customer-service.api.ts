// features/customer-service/services/customer-service.api.ts
import { httpClient } from "@/lib/axios";
import type { Ticket, TicketResponse, TicketFormData } from "../types/customer-service.types";

class CustomerServiceApiService {
  async getTickets(
    search: string = "",
    status: string = "all",
    page: number = 1,
    perPage: number = 10
  ): Promise<TicketResponse> {
    try {
      const params: Record<string, any> = {
        page,
        per_page: perPage,
      };

      if (search.trim()) {
        params.search = search;
      }

      if (status !== "all") {
        params.status = status;
      }

      const response = await httpClient.get("/tickets", { params });
      
      return {
        data: response.data.data,
        links: response.data.links,
        meta: {
          current_page: response.data.meta.current_page,
          from: response.data.meta.from,
          last_page: response.data.meta.last_page,
          links: response.data.meta.links,
          path: response.data.meta.path,
          per_page: response.data.meta.per_page,
          to: response.data.meta.to,
          total: response.data.meta.total,
        },
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch tickets");
    }
  }

  async createTicket(ticketData: TicketFormData): Promise<{ 
    success: boolean; 
    message: string; 
    data: Ticket 
  }> {
    try {
      const response = await httpClient.post("/tickets", ticketData);
      
      return {
        success: true,
        message: response.data.message || "Ticket created successfully",
        data: response.data.data,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to create ticket");
    }
  }

  async updateTicketStatus(
    ticketId: number, 
    status: "pending" | "in_progress" | "resolved"
  ): Promise<{ 
    success: boolean; 
    message: string; 
    data: Ticket 
  }> {
    try {
      const response = await httpClient.patch(`/tickets/${ticketId}/status`, { status });
      
      return {
        success: true,
        message: response.data.message || "Ticket status updated successfully",
        data: response.data.data,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to update ticket status");
    }
  }
}

export const customerServiceApiService = new CustomerServiceApiService();