import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsApiService } from "./api";
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
       
        queryClient.invalidateQueries(["accounts"]);
        console.log(`Account ${variables.accountId} status updated to ${variables.state}`);
      },
      onError: (err) => {
        console.error("Failed to update account status:", err);
      },
    }
  );
};
