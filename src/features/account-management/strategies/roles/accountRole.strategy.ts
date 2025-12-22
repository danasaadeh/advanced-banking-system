// strategies/roles/accountRole.strategy.ts
import type{ Account, AccountStatus } from "@/features/account-management/types/accounts.data";
import type{ AccountStateBehavior } from "../states/accountState.strategy";

export interface AccountRoleStrategy {
  canAddSubAccount(account: Account, level: number, state: AccountStateBehavior): boolean;
  canEditStatus(state: AccountStateBehavior): boolean;
  allowedStatuses(): AccountStatus[];     
  editableStatuses(): AccountStatus[];   
  canViewDetails(account: Account, level: number): boolean;
}
