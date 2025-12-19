// features/customer-service/hooks/useCustomerServiceFilters.ts
import { useState, useCallback } from "react";

export const useCustomerServiceFilters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedStatus("all");
    setCurrentPage(1);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    currentPage,
    setCurrentPage,
    resetFilters,
  };
};