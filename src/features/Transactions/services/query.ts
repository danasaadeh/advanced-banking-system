import { useApiQuery } from "@/lib/query-facade";
import { getTransactionDetails, getTransactions } from "../services/api";
import type {
  TransactionsResponse,
  TransactionsFilters,
  TransactionDetails,
} from "../types";

export function useTransactions(filters: TransactionsFilters) {
  return useApiQuery<TransactionsResponse>({
    key: ["transactions", filters],
    fetcher: () => getTransactions(filters),
    errorMessage: "Failed to load transactions",
    enabled: true,
  });
}

export function useTransactionDetails(transactionId: number | null) {
  return useApiQuery<TransactionDetails>({
    key: ["transaction-details", transactionId],
    fetcher: () => getTransactionDetails(transactionId as number),
    enabled: !!transactionId, // 🚨 important
    errorMessage: "Failed to load transaction details",
  });
}
