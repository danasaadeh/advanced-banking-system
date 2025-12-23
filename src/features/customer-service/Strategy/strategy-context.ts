import type { TicketStrategy } from "./customer-service.types";
import type { Ticket } from "../types/customer-service.types";

export class TicketContext {
  private strategy: TicketStrategy;

  constructor(strategy: TicketStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: TicketStrategy) {
    this.strategy = strategy;
  }

  filterTickets(tickets: Ticket[], userId: number) {
    return this.strategy.filterTickets(tickets, userId);
  }

  canEditStatus(ticket: Ticket, userRole: string) {
    return this.strategy.canEditStatus(ticket, userRole);
  }
}
