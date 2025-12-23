/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TicketStrategy } from "./customer-service.types";
import type { Ticket } from "../types/customer-service.types";

export class AdminTicketStrategy implements TicketStrategy {
  filterTickets(tickets: Ticket[]): Ticket[] {
    // Admin sees all tickets
    return tickets;
  }

  canEditStatus(ticket: Ticket, userRole: string): boolean {
    // Admin can edit status
    return true;
  }
}
