/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsApiService } from "./api";
import { toast } from "@/shared/components/ui/sonner";
import type { CreateAccountPayload } from "../types/accounts.data";

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (payload: CreateAccountPayload) => {
      // Validate payload before sending
      if (
        !payload.account_type_id ||
        !payload.currency ||
        !payload.owner_user_id ||
        !Array.isArray(payload.user_ids) ||
        payload.user_ids.length === 0
      ) {
        throw new Error("Invalid payload: Missing required fields");
      }

      console.log("%c[useCreateAccount] Sending payload:", "color: blue;", payload);

      try {
        const data = await accountsApiService.createAccount(payload);
        console.log("%c[useCreateAccount] Received response:", "color: green;", data);
        return data;
      } catch (err: any) {
        console.error("%c[useCreateAccount] Error sending request:", "color: red;", err);
        throw err; 
      }
    },
    {
      onSuccess: (data) => {
        console.log("%c[useCreateAccount] Account created successfully!", "color: green; font-weight: bold;", data);
        queryClient.invalidateQueries(["accounts"]);
        toast.success(data?.message || "Account created successfully!");
      },
      onError: (err: any) => {
        console.error("%c[useCreateAccount] Mutation failed:", "color: red; font-weight: bold;", err?.response?.data || err.message);
        toast.error(err?.response?.data?.message || err.message || "Failed to create account");
      },
    }
  );
};
