// features/users/hooks/useUsersFilters.ts
import { useState, useCallback } from "react";

export const useUsersFilters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedRole("all");
    setCurrentPage(1);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    selectedRole,
    setSelectedRole,
    currentPage,
    setCurrentPage,
    resetFilters,
  };
};