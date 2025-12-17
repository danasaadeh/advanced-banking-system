import { useMutation, useQuery } from "@tanstack/react-query";
import AuthServices from "./api";

export const useUserProfile = () =>
  useQuery({
    queryKey: ["auth", "profile"],
    queryFn: () => AuthServices.getMe(),
    retry: false, // important for auth
  });
