import { httpClient } from "@/lib/axios";
import type { AccountCreationDataResponse, AccountGroupResponse, AccountGroupsResponse } from "../types/accounts.data";

class AccountsService {
  private baseUrl = "/accounts/groups";

  // Fetch all account groups
  async getAccountGroups(params?: { page?: number; per_page?: number; search?: string }) {
    const response = await httpClient.get<AccountGroupsResponse>(this.baseUrl, { params });
    return response.data;
  }

  // Fetch a single account group by ID
  async getAccountGroupById(accountGroupId: number | string): Promise<AccountGroupResponse> {
    const response = await httpClient.get<AccountGroupResponse>(`${this.baseUrl}/${accountGroupId}`);
    return response.data;
  }

// Fetch account creation data
   async getAccountCreationData(): Promise<AccountCreationDataResponse> {
    const response = await httpClient.get<AccountCreationDataResponse>(
      "/accounts/creation-data"
    );
    return response.data;
  }

  
  // Change account status
async updateAccountStatus(accountId: number | string, state: string) {
  const response = await httpClient.patch(`/accounts/${accountId}/state`, { state });
  return response.data;
}

}

export const accountsApiService = new AccountsService();
