
import React, { useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useApiQuery } from "@/lib/query-facade";
import { userApiService } from "../services/user.api";
import { useUsersFilters } from "../hooks/useUsersFilters";
import { useUserActions } from "../hooks/useUserActions";
import { UsersTable } from "../components/UsersTable";
import { UsersFilters } from "../components/UsersFilters";
import { UserDetailsDialog } from "../components/UserDetailsDialog";
import { ConfirmActionDialog } from "../components/ConfirmActionDialog";
import { UserFormDialog } from "../components/UserFormDialog";
import { UsersPagination } from "../components/UsersPagination";

const UsersListPage: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedRole,
    setSelectedRole,
    currentPage,
    setCurrentPage,
  } = useUsersFilters();

  const {
    selectedUser,
    actionType,
    showDialog,
    setShowDialog,
    handleViewDetails,
    handleActivate,
    handleDeactivate,
    handleEditUser,
    handleCreateUser,
    handleSaveUser,
    executeAction,
    getActionText,
    getActionDescription,
    isLoading,
  } = useUserActions();
  const { 
    data, 
    isLoading: isLoadingUsers, 
    isError,
    refetch
  } = useApiQuery({
    key: ["users", searchQuery, selectedRole, currentPage, 10],
    fetcher: () => userApiService.getUsers(searchQuery, selectedRole, currentPage, 10),
  });
  useEffect(() => {
    if (!showDialog) {
      const timer = setTimeout(() => {
        refetch();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [showDialog, refetch]);

  const users = data?.data || [];
  const pagination = data?.pagination;

  const handleEditFromDetails = (user: any) => {
    setShowDialog(false);
    setTimeout(() => {
      handleEditUser(user);
    }, 100);
  };

  const ITEMS_PER_PAGE = 10;
  const totalItems = pagination?.total || 0;
  const totalPages = pagination?.last_page || 1;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ---------------- HEADER ---------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold">Users Management</h1>

        <Button
          onClick={handleCreateUser}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* ---------------- SEARCH + FILTERS ---------------- */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Search */}
        <div className="relative w-full lg:max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone, or ID..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <UsersFilters
          selectedRole={selectedRole}
          onRoleChange={(value) => {
            setSelectedRole(value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* ---------------- TABLE ---------------- */}
      {isLoadingUsers ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 py-8">
          Failed to load users. Please try again.
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No users found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <>
          <UsersTable
            users={users}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            onViewDetails={handleViewDetails}
            onActivate={handleActivate}
            onDeactivate={handleDeactivate}
          />
          
          {/* Pagination */}
          {totalItems > ITEMS_PER_PAGE && (
            <div className="mt-4">
              <UsersPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      {/* Dialogs */}
      <UserDetailsDialog
        open={actionType === "view" && showDialog}
        onOpenChange={setShowDialog}
        user={actionType === "view" ? selectedUser : null}
        onEdit={handleEditFromDetails}
      />

      <UserFormDialog
        open={(actionType === "create" || actionType === "edit") && showDialog}
        onOpenChange={setShowDialog}
        onSave={handleSaveUser}
        user={selectedUser}
        mode={actionType === "create" ? "create" : "edit"}
      />

      <ConfirmActionDialog
        open={(actionType === "activate" || actionType === "deactivate") && showDialog}
        onOpenChange={setShowDialog}
        title={`${getActionText()} User`}
        description={getActionDescription()}
        confirmText={getActionText()}
        onConfirm={executeAction}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UsersListPage;
