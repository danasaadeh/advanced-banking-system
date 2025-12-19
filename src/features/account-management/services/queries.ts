import { useQuery } from "@tanstack/react-query";
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

