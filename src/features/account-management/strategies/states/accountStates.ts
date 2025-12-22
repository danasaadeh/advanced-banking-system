// strategies/states/accountStates.ts
import type { AccountStateBehavior } from "./accountState.strategy";

export const ActiveState: AccountStateBehavior = {
  canEditStatus: true,
  canAddSubAccount: true,
  displayName: "Active",
};

export const FrozenState: AccountStateBehavior = {
  canEditStatus: true,
  canAddSubAccount: false,
  displayName: "Frozen",
};

export const SuspendedState: AccountStateBehavior = {
  canEditStatus: false,
  canAddSubAccount: false,
  displayName: "Suspended",
};

export const ClosedState: AccountStateBehavior = {
  canEditStatus: false,
  canAddSubAccount: false,
  displayName: "Closed",
};
