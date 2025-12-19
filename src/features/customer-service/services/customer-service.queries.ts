// features/customer-service/services/customer-service.queries.ts
import { useQuery } from "@tanstack/react-query";
import { customerServiceApiService } from "./customer-service.api";
import type { TicketResponse } from "../types/customer-service.types";

interface UseTicketsOptions {
  search: string;
  status: string;
  page: number;
  perPage: number;
}

export const useTickets = ({
  search,
  status,
  page,
  perPage,
}: UseTicketsOptions) => {
  return useQuery<TicketResponse, Error>({
    queryKey: ["tickets", search, status, page, perPage],
    queryFn: () => customerServiceApiService.getTickets(search, status, page, perPage),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};