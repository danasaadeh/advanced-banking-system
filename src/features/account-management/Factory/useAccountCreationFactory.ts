/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCreateAccount } from "../services/useCreateAccount";
import { useCreateAccountGroup } from "../services/useCreateAccountGroup";
import { useCreateChildAccount } from "../services/useCreateChildAccount";
import type {
  AccountCreationType,
  MutationMap,
} from "./accountCreation.types";

export const useAccountCreationFactory = () => {
  const root = useCreateAccount();
  const child = useCreateChildAccount();
  const group = useCreateAccountGroup();

  const mutationMap: MutationMap = {
    ROOT: root,
    CHILD: child,
    GROUP: group,
  };

  function create(
    type: "ROOT",
    payload: Parameters<typeof root.mutate>[0],
    options?: Parameters<typeof root.mutate>[1]
  ): ReturnType<typeof root.mutate>;
  function create(
    type: "CHILD",
    payload: Parameters<typeof child.mutate>[0],
    options?: Parameters<typeof child.mutate>[1]
  ): ReturnType<typeof child.mutate>;
  function create(
    type: "GROUP",
    payload: Parameters<typeof group.mutate>[0],
    options?: Parameters<typeof group.mutate>[1]
  ): ReturnType<typeof group.mutate>;
  function create(type: AccountCreationType, payload: any, options?: any) {
    return mutationMap[type].mutate(payload, options);
  }

  const isLoading = Object.values(mutationMap).some(
    (mutation) => mutation.isLoading
  );

  return {
    create,
    isLoading,
  };
};