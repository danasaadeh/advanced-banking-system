/* eslint-disable @typescript-eslint/no-unused-vars */
// strategies/roles/customer.strategy.ts
import type { AccountRoleStrategy } from "./accountRole.strategy";

export const CustomerStrategy: AccountRoleStrategy = {
  canAddSubAccount: () => false,
canEditStatus: (state) => state.canEditStatus && !["Closed", "Suspended"].includes(state.displayName),

  allowedStatuses: () => ["active", "frozen", "suspended", "closed"], 
  editableStatuses: () => ["active", "frozen"], 
  canViewDetails: (account, level) => level === 0, 
};
