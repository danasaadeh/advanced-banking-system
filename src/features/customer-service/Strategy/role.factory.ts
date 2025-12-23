// features/customer-service/Strategy/role.factory.ts

import { AdminTicketStrategy } from "./admin-strategy";
import type { TicketStrategy } from "./customer-service.types";
import { CustomerTicketStrategy } from "./customer.strategy";


export const getTicketStrategy = (role: string): TicketStrategy => {
  switch (role.toLowerCase()) {
    case "admin":
      return new AdminTicketStrategy();
    case "customer":
      return new CustomerTicketStrategy();
    default:
      return new CustomerTicketStrategy();
  }
};
