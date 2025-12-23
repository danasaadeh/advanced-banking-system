import { useQueryClient } from "@tanstack/react-query";
import queryFacade from "@/lib/query-facade";
import {
  createRecurringTransaction,
  createScheduledTransaction,
  createTransaction,
  updateTransactionStatus,
} from "./api";
import type {
  CreateRecurringTransactionPayload,
  CreateScheduledTransactionPayload,
  CreateTransactionPayload,
} from "../types";

export function useUpdateTransactionStatus() {
  const queryClient = useQueryClient(); // ✅ SAME CLIENT AS PROVIDER

  return queryFacade.useApiMutation({
    mutationFn: updateTransactionStatus,
    successMessage: "Transaction status updated successfully",

    extraOptions: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === "transactions",
        });
      },
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return queryFacade.useApiMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      createTransaction(payload),

    getSuccessMessage: (data) => data.message,

    extraOptions: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === "transactions",
        });
      },
    },
  });
}

export function useCreateScheduledTransaction() {
  const queryClient = useQueryClient();

  return queryFacade.useApiMutation({
    mutationFn: (payload: CreateScheduledTransactionPayload) =>
      createScheduledTransaction(payload),

    getSuccessMessage: (data) => data.message,

    extraOptions: {
      onSuccess: () => {
        // invalidate transactions & scheduled list if exists later
        queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === "transactions",
        });
      },
    },
  });
}

export function useCreateRecurringTransaction() {
  const queryClient = useQueryClient();

  return queryFacade.useApiMutation({
    mutationFn: (payload: CreateRecurringTransactionPayload) =>
      createRecurringTransaction(payload),

    getSuccessMessage: (data) => data.message,

    extraOptions: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === "transactions",
        });
      },
    },
  });
}
