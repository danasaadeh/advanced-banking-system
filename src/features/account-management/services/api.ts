import { httpClient } from "@/lib/axios";
import type { AccountGroupResponse, AccountGroupsResponse } from "../types/accounts.data";

class AccountsService {
  private baseUrl = "/accounts/groups";

  // Fetch all account groups with optional search
// accounts.api.ts
async getAccountGroups(params?: { page?: number; per_page?: number; search?: string }) {
  const response = await httpClient.get<AccountGroupsResponse>(this.baseUrl, {
    params, 
  });
  return response.data;
}

  // Fetch a single account group by ID
  async getAccountGroupById(accountGroupId: number | string): Promise<AccountGroupResponse> {
    const response = await httpClient.get<AccountGroupResponse>(`${this.baseUrl}/${accountGroupId}`);
    return response.data;
  }
}

export const accountsApiService = new AccountsService();
