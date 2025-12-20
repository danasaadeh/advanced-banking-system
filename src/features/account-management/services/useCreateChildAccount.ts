/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsApiService } from "./api";
import { toast } from "@/shared/components/ui/sonner";
import type { CreateAccountPayload } from "../types/accounts.data";

export const useCreateChildAccount = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (payload: CreateAccountPayload) => {
      console.log("[useCreateChildAccount] Sending payload:", payload);
      try {
        const data = await accountsApiService.createAccount(payload);
        console.log("[useCreateChildAccount] Received response:", data);
        return data;
      } catch (err: any) {
        console.error("[useCreateChildAccount] Error sending request:", err);
        throw err;
      }
    },
    {
      onSuccess: (data) => {
        console.log("[useCreateChildAccount] Child account created successfully!", data);
        queryClient.invalidateQueries(["accounts"]); // Refresh accounts list
        toast.success(data?.message || "Child account created successfully!");
      },
      onError: (err: any) => {
        console.error("[useCreateChildAccount] Mutation failed:", err);
        toast.error(err.message || "Failed to create child account");
      },
    }
  );
};
