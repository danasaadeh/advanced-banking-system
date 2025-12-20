/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreateAccount } from "./useCreateAccount";
import { useCreateChildAccount } from "./useCreateChildAccount";
import { useCreateAccountGroup } from "./useCreateAccountGroup";
import type {
  CreateAccountPayload,
  CreateAccountGroupPayload,
} from "../types/accounts.data";

export type AccountCreationType =
  | "ROOT"
  | "CHILD"
  | "GROUP";

export const useAccountCreationFactory = () => {
  const rootAccount = useCreateAccount();
  const childAccount = useCreateChildAccount();
  const groupAccount = useCreateAccountGroup();

  const create = (
    type: AccountCreationType,
    payload: CreateAccountPayload | CreateAccountGroupPayload,
    options?: any
  ) => {
    switch (type) {
      case "ROOT":
        return rootAccount.mutate(payload as CreateAccountPayload, options);

      case "CHILD":
        return childAccount.mutate(payload as CreateAccountPayload, options);

      case "GROUP":
        return groupAccount.mutate(payload as CreateAccountGroupPayload, options);

      default:
        throw new Error("Unsupported account creation type");
    }
  };

  return {
    create,
    isLoading:
      rootAccount.isLoading ||
      childAccount.isLoading ||
      groupAccount.isLoading,
  };
};
