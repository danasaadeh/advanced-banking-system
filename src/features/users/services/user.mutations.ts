// features/users/services/user.mutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApiService } from "./user.api";
import { toast } from "@/shared/components/ui/sonner";
import type { CreateUserRequest, UpdateUserRequest } from "../types/user.types";

export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    Error,
    { userId: number }
  >({
    mutationFn: ({ userId }) => userApiService.activateUser(userId),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(response.message);
    },

    onError: (error) => {
      toast.error(error.message || "Failed to activate user");
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    Error,
    { userId: number }
  >({
    mutationFn: ({ userId }) => userApiService.deactivateUser(userId),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(response.message);
    },

    onError: (error) => {
      toast.error(error.message || "Failed to deactivate user");
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string; data: any },
    Error,
    CreateUserRequest
  >({
    mutationFn: (userData) => userApiService.createUser(userData),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(response.message);
    },

    onError: (error) => {
      toast.error(error.message || "Failed to create user");
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string; data: any },
    Error,
    { userId: number; userData: UpdateUserRequest }
  >({
    mutationFn: ({ userId, userData }) => userApiService.updateUser(userId, userData),

    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
      toast.success(response.message);
    },

    onError: (error) => {
      toast.error(error.message || "Failed to update user");
    },
  });
};