
import { useApiMutation, queryClient } from "@/lib/query-facade";
import { userApiService } from "./user.api";
import type { UpdateUserRequest } from "../types/user.types";

export const useActivateUser = () => useApiMutation({
  mutationFn: userApiService.activateUser,
  successMessage: "User activated successfully",
  extraOptions: {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  },
});

export const useDeactivateUser = () => useApiMutation({
  mutationFn: userApiService.deactivateUser,
  successMessage: "User deactivated successfully",
  extraOptions: {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  },
});

export const useCreateUser = () => useApiMutation({
  mutationFn: userApiService.createUser,
  successMessage: "User created successfully",
  extraOptions: {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  },
});

export const useUpdateUser = () => useApiMutation({
  mutationFn: ({ userId, userData }: { userId: number; userData: UpdateUserRequest }) => 
    userApiService.updateUser(userId, userData),
  successMessage: "User updated successfully",
  extraOptions: {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
      queryClient.setQueryData(["user", variables.userId], data.data);
    },
  },
});
