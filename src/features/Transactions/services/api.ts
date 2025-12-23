import { httpClient } from "@/lib/axios";
import type {
  TransactionsResponse,
  TransactionsFilters,
  TransactionDetails,
  UpdateTransactionStatusPayload,
  UpdateTransactionStatusResponse,
  CreateTransactionPayload,
  CreateTransactionSuccessResponse,
  CreateScheduledTransactionPayload,
  CreateScheduledTransactionResponse,
  CreateRecurringTransactionPayload,
  CreateRecurringTransactionResponse,
} from "../types";

export async function getTransactions(
  filters: TransactionsFilters
): Promise<TransactionsResponse> {
  const response = await httpClient.get<TransactionsResponse>("/transactions", {
    params: {
      page: filters.page,
      trans_type: filters.trans_type,
      status: filters.status,
      direction: filters.direction,
      from_date: filters.from_date,
      to_date: filters.to_date,
      search: filters.search,
    },
  });

  return response.data;
}

export async function getTransactionDetails(
  transactionId: number
): Promise<TransactionDetails> {
  const response = await httpClient.get<TransactionDetails>(
    `/transactions/${transactionId}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  return response.data;
}

export async function updateTransactionStatus(
  payload: UpdateTransactionStatusPayload
): Promise<UpdateTransactionStatusResponse> {
  const { transactionId, status } = payload;

  const response = await httpClient.patch<UpdateTransactionStatusResponse>(
    `/transactions/${transactionId}/status`,
    { status },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  return response.data;
}

export async function createTransaction(
  payload: CreateTransactionPayload
): Promise<CreateTransactionSuccessResponse> {
  const response = await httpClient.post<CreateTransactionSuccessResponse>(
    "/transactions",
    payload,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  return response.data;
}

export async function createScheduledTransaction(
  payload: CreateScheduledTransactionPayload
): Promise<CreateScheduledTransactionResponse> {
  const response = await httpClient.post<CreateScheduledTransactionResponse>(
    "/transactions/schedule",
    payload,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  return response.data;
}

export async function createRecurringTransaction(
  payload: CreateRecurringTransactionPayload
): Promise<CreateRecurringTransactionResponse> {
  const response = await httpClient.post<CreateRecurringTransactionResponse>(
    "/transactions/recurring",
    payload,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  return response.data;
}
