/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TicketStrategy } from "./customer-service.types";
import type { Ticket } from "../types/customer-service.types";

export class CustomerTicketStrategy implements TicketStrategy {
  filterTickets(tickets: Ticket[], userId: number): Ticket[] {
    // Customer sees only their tickets
    return tickets.filter(ticket => ticket.user_id === userId);
  }

  canEditStatus(ticket: Ticket, userRole: string): boolean {
    // Customer cannot edit status
    return false;
  }
}
