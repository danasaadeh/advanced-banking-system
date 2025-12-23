import { httpClient } from "@/lib/axios";
import type {
  ScheduledTransactionsResponse,
  ScheduledTransactionsFilters,
  RecurringTransactionsResponse,
  RecurringTransactionsFilters,
  ScheduledTransactionDTO,
  RecurringTransactionDTO,
} from "../types";

/**
 * GET Scheduled Transactions
 * Endpoint: /scheduled-transactions
 */
export async function getScheduledTransactions(
  filters: ScheduledTransactionsFilters
): Promise<ScheduledTransactionsResponse> {
  const response = await httpClient.get<ScheduledTransactionsResponse>(
    "/scheduled-transactions",
    {
      params: {
        page: filters.page,
        search: filters.search,
      },
      headers: {
        Accept: "application/json",
      },
    }
  );

  return response.data;
}

/**
 * GET Recurring Transactions
 * Endpoint: /recurring-transactions
 */
export async function getRecurringTransactions(
  filters: RecurringTransactionsFilters
): Promise<RecurringTransactionsResponse> {
  const response = await httpClient.get<RecurringTransactionsResponse>(
    "/recurring-transactions", // your API endpoint
    {
      params: {
        search: filters.search,
      },
      headers: {
        Accept: "application/json",
      },
    }
  );

  return response.data;
}

export async function getScheduledTransactionDetails(
  id: number
): Promise<ScheduledTransactionDTO> {
  const response = await httpClient.get<ScheduledTransactionDTO>(
    `/scheduled-transactions/${id}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  return response.data;
}

export async function updateScheduledTransaction(
  id: number,
  payload: { amount?: number; scheduledAt?: string }
): Promise<ScheduledTransactionDTO> {
  const response = await httpClient.put<ScheduledTransactionDTO>(
    `/scheduled-transactions/${id}`,
    payload,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  return response.data;
}
export async function deleteScheduledTransaction(
  id: number
): Promise<{ message: string }> {
  const response = await httpClient.delete<{ message: string }>(
    `/scheduled-transactions/${id}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  return response.data;
}

export async function updateRecurringTransaction(
  id: number,
  payload: {
    amount?: number;
    frequency?: "daily" | "weekly" | "monthly";
    endDate?: string;
  }
): Promise<RecurringTransactionDTO> {
  const response = await httpClient.put<{
    message: string;
    data: RecurringTransactionDTO;
  }>(`/recurring-transactions/${id}`, payload, {
    headers: {
      Accept: "application/json",
    },
  });

  return response.data.data; // Return the updated transaction
}

export async function terminateRecurringTransaction(
  id: number
): Promise<{ id: number; status: string; endDate: string; message: string }> {
  const response = await httpClient.post<{
    id: number;
    status: string;
    endDate: string;
    message: string;
  }>(`/recurring-transactions/${id}/terminate`, null, {
    headers: {
      Accept: "application/json",
    },
  });

  return response.data;
}

// api.ts
export async function toggleRecurringTransaction(
  id: number,
  isActive: boolean
): Promise<{ id: number; is_active: boolean; message: string }> {
  const response = await httpClient.patch<{
    id: number;
    is_active: boolean;
    message: string;
  }>(
    `/recurring-transactions/${id}/toggle`,
    { isActive },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  return response.data;
}
