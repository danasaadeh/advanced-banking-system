// features/customer-service/Strategy/customer-service.types.ts
import type { Ticket } from "../types/customer-service.types";

export interface TicketStrategy {
  filterTickets(tickets: Ticket[], userId: number): Ticket[];
  canEditStatus(ticket: Ticket, userRole: string): boolean;
}
