// accountStates.ts
import type { AccountStatus } from "@/features/account-management/types/accounts.data";

export interface AccountStateBehavior {
  canEditStatus: boolean;
  canAddSubAccount: boolean;
  displayStatusName: () => string;
}

export const ActiveState: AccountStateBehavior = {
  canEditStatus: true,
  canAddSubAccount: true,
  displayStatusName: () => "Active",
};

export const FrozenState: AccountStateBehavior = {
  canEditStatus: true,
  canAddSubAccount: false,
  displayStatusName: () => "Frozen",
};

export const SuspendedState: AccountStateBehavior = {
  canEditStatus: false,
  canAddSubAccount: false,
  displayStatusName: () => "Suspended",
};

export const ClosedState: AccountStateBehavior = {
  canEditStatus: false,
  canAddSubAccount: false,
  displayStatusName: () => "Closed",
};

export const getStateBehavior = (state: AccountStatus): AccountStateBehavior => {
  switch (state) {
    case "active":
      return ActiveState;
    case "frozen":
      return FrozenState;
    case "suspended":
      return SuspendedState;
    case "closed":
      return ClosedState;
    default:
      return ActiveState;
  }
};
