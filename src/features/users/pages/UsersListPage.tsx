// features/users/pages/UsersListPage.tsx
import React from "react";
import { Users, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useUsersFilters } from "../hooks/useUsersFilters";
import { useUserActions } from "../hooks/useUserActions";
import { useUsers } from "../services/user.queries";
import { UsersTable } from "../components/UsersTable";
import { UsersFilters } from "../components/UsersFilters";
import { UserDetailsDialog } from "../components/UserDetailsDialog";
import { ConfirmActionDialog } from "../components/ConfirmActionDialog";
import { UserFormDialog } from "../components/UserFormDialog";

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
    isCreating,
    isUpdating,
  } = useUserActions();

  const { data, isLoading: isLoadingUsers, isError } = useUsers({
    search: searchQuery,
    role: selectedRole,
    page: currentPage,
    perPage: 10,
  });

  const users = data?.data || [];
  const pagination = data?.pagination;

  // دالة خاصة لمعالجة التعديل من ديالوج التفاصيل
  const handleEditFromDetails = (user: any) => {
    // إغلاق ديالوج التفاصيل أولاً
    setShowDialog(false);
    // ثم فتح ديالوج التعديل بعد تأخير بسيط
    setTimeout(() => {
      handleEditUser(user);
    }, 100);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
          <p className="text-muted-foreground">
            Manage all system users, their roles, and status
          </p>
        </div>
        <Button className="gap-2" onClick={handleCreateUser}>
          <Plus className="h-4 w-4" />
          Add New User
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6">
            <UsersFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
            />
          </div>

          {/* Users Table with Pagination */}
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
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No users found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <UsersTable
              users={users}
              currentPage={currentPage}
              totalPages={pagination?.last_page || 1}
              totalItems={pagination?.total || 0}
              itemsPerPage={10}
              onPageChange={setCurrentPage}
              onViewDetails={handleViewDetails}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
            />
          )}
        </CardContent>
      </Card>

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
        isLoading={actionType === "create" ? isCreating : isUpdating}
        mode={actionType === "create" ? "create" : "edit"}
      />

      <ConfirmActionDialog
        open={actionType === "activate" || actionType === "deactivate" && showDialog}
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