// strategies/states/accountState.strategy.ts

export interface AccountStateBehavior {
  canEditStatus: boolean;
  canAddSubAccount: boolean;
  displayName: string;
}
