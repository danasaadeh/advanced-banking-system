/* eslint-disable @typescript-eslint/no-explicit-any */
// strategies/states/state.factory.ts
import type{ AccountStatus } from "@/features/account-management/types/accounts.data";
import {
  ActiveState,
  FrozenState,
  SuspendedState,
  ClosedState,
} from "./accountStates";

export const stateBehaviorMap = {
  active: ActiveState,
  frozen: FrozenState,
  suspended: SuspendedState,
  closed: ClosedState,
} satisfies Record<AccountStatus, any>;

export const getStateBehavior = (state: AccountStatus) =>
  stateBehaviorMap[state];
