import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsApiService } from "./api";
import type { AccountGroupsResponse, AccountGroupResponse } from "../types/accounts.data";

interface UseAccountsOptions {
  search?: string;
  page?: number;
  perPage?: number;
}

// Fetch all accounts with optional search
export const useAccounts = ({ search = "", page = 1, perPage = 15 }: UseAccountsOptions) => {
  return useQuery<AccountGroupsResponse, Error>({
    queryKey: ["accounts", search, page, perPage],
    queryFn: () =>
      accountsApiService.getAccountGroups({
        page,
        per_page: perPage,
        search,
      }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// Fetch single account by ID
export const useAccount = (accountGroupId: number | string | undefined) => {
  return useQuery<AccountGroupResponse, Error>({
    queryKey: ["account", accountGroupId],
    queryFn: () =>
      accountGroupId
        ? accountsApiService.getAccountGroupById(accountGroupId)
        : Promise.reject(new Error("No account group ID")),
    enabled: !!accountGroupId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// Mutation hook to update account status
export const useUpdateAccountStatus = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ accountId, state }: { accountId: number | string; state: "active" | "frozen" | "suspended" | "closed" }) =>
      accountsApiService.updateAccountStatus(accountId, state),
    {
      onSuccess: (_, variables) => {
        // Refetch accounts list to reflect the status change
        queryClient.invalidateQueries(["accounts"]);
        console.log(`Account ${variables.accountId} status updated to ${variables.state}`);
      },
      onError: (err) => {
        console.error("Failed to update account status:", err);
      },
    }
  );
};
