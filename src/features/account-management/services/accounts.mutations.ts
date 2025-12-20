/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsApiService } from "./accounts.api";
import { toast } from "@/shared/components/ui/sonner";
import type { AccountStatus } from "../types/accounts.data";

interface UpdateAccountStatusPayload {
  accountId: number | string;
  state: AccountStatus;
}

export const useUpdateAccountStatus = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ accountId, state }: UpdateAccountStatusPayload) =>
      accountsApiService.updateAccountStatus(accountId, state),
    {
      onSuccess: (_, variables) => {
        // Refetch all accounts
        queryClient.invalidateQueries({ queryKey: ["accounts"] });

        toast.success(
          `Account ${variables.accountId} status updated to ${variables.state}`
        );
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || err.message || "Failed to update account status");
      },
    }
  );
};
