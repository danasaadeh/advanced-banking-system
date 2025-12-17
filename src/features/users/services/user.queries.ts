// features/users/services/user.queries.ts
import { useQuery } from "@tanstack/react-query";
import { userApiService } from "./user.api";
import type { User, UsersResponse } from "../types/user.types";

interface UseUsersOptions {
  search: string;
  role: string;
  page: number;
  perPage: number;
}

export const useUsers = ({
  search,
  role,
  page,
  perPage,
}: UseUsersOptions) => {
  return useQuery<UsersResponse, Error>({
    queryKey: ["users", search, role, page, perPage],
    queryFn: () => userApiService.getUsers(search, role, page, perPage),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useUser = (userId: number | undefined) => {
  return useQuery<User, Error>({
    queryKey: ["user", userId],
    queryFn: () => userId ? userApiService.getUserById(userId) : Promise.reject(new Error("No user ID")),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};