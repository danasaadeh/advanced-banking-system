import { httpClient } from "@/lib/axios";
import type {
  AccountCreationDataResponse,
  AccountGroupResponse,
  AccountGroupsResponse,
  CreateAccountPayload,
  CreateAccountGroupPayload,
} from "../types/accounts.data";

class AccountsService {
  private baseUrl = "/accounts/groups";

  async getAccountGroups(params?: { page?: number; per_page?: number; search?: string }) {
    const response = await httpClient.get<AccountGroupsResponse>(this.baseUrl, { params });
    return response.data;
  }

  async getAccountGroupById(accountGroupId: number | string): Promise<AccountGroupResponse> {
    const response = await httpClient.get<AccountGroupResponse>(`${this.baseUrl}/${accountGroupId}`);
    return response.data;
  }

  async getAccountCreationData(): Promise<AccountCreationDataResponse> {
    const response = await httpClient.get<AccountCreationDataResponse>("/accounts/creation-data");
    return response.data;
  }

  async updateAccountStatus(accountId: number | string, state: string) {
    const response = await httpClient.patch(`/accounts/${accountId}/state`, { state });
    return response.data;
  }

  async createAccount(payload: CreateAccountPayload) {
    const response = await httpClient.post(`/accounts/leaves`, payload);
    return response.data;
  }

  //  CREATE ACCOUNT GROUP
  async createAccountGroup(payload: CreateAccountGroupPayload): Promise<AccountGroupResponse> {
    const response = await httpClient.post<AccountGroupResponse>(this.baseUrl, payload);
    return response.data;
  }
}

export const accountsApiService = new AccountsService();
