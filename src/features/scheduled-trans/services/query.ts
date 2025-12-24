import { useApiQuery } from "@/lib/query-facade";
import {
  getRecurringTransactions,
  getScheduledTransactionDetails,
  getScheduledTransactions,
} from "../services/api";
import type {
  ScheduledTransactionsResponse,
  ScheduledTransactionsFilters,
  RecurringTransactionsFilters,
  RecurringTransactionsResponse,
  ScheduledTransactionDTO,
} from "../types";

/**
 * Fetch scheduled transactions list
 */
export function useScheduledTransactions(
  filters: ScheduledTransactionsFilters
) {
  return useApiQuery<ScheduledTransactionsResponse>({
    key: ["scheduled-transactions", filters],
    fetcher: () => getScheduledTransactions(filters),
    errorMessage: "Failed to load scheduled transactions",
    enabled: true,
  });
}

export function useRecurringTransactions(
  filters: RecurringTransactionsFilters
) {
  return useApiQuery<RecurringTransactionsResponse>({
    key: ["recurring-transactions", filters],
    fetcher: () => getRecurringTransactions(filters),
    errorMessage: "Failed to load recurring transactions",
    enabled: true,
  });
}

export function useScheduledTransactionDetails(id: number) {
  return useApiQuery<ScheduledTransactionDTO>({
    key: ["scheduled-transaction-details", id],
    fetcher: () => getScheduledTransactionDetails(id),
    errorMessage: "Failed to load scheduled transaction details",
    enabled: !!id, // This ensures the query runs only if `id` is provided
  });
}
