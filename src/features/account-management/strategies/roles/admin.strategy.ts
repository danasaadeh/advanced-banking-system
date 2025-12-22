// strategies/roles/admin.strategy.ts
import type { AccountRoleStrategy } from "./accountRole.strategy";

export const AdminStrategy: AccountRoleStrategy = {
  canAddSubAccount: (account, level, state) =>
    level === 0 && state.canAddSubAccount && account.account_number?.startsWith("G-AC-"),
  canEditStatus: (state) => state.canEditStatus,
  allowedStatuses: () => ["active", "frozen", "suspended", "closed"],
  editableStatuses: () => ["active", "frozen", "suspended", "closed"],
  canViewDetails: (account, level) => level === 0,
};


