
import { useState } from "react";
import { useActivateUser, useDeactivateUser, useCreateUser, useUpdateUser } from "../services/user.mutations";
import type { User, UserFormData } from "../types/user.types";
import { queryClient } from "@/lib/query-facade";

export const useUserActions = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<"activate" | "deactivate" | "view" | "edit" | "create" | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const activateUser = useActivateUser();
  const deactivateUser = useDeactivateUser();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setActionType("view");
    setShowDialog(true);
  };

  const handleActivate = (user: User) => {
    setSelectedUser(user);
    setActionType("activate");
    setShowDialog(true);
  };

  const handleDeactivate = (user: User) => {
    setSelectedUser(user);
    setActionType("deactivate");
    setShowDialog(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setActionType("edit");
    setShowDialog(true);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setActionType("create");
    setShowDialog(true);
  };

  const executeAction = async () => {
    if (!selectedUser || !actionType) return;

    try {
      switch (actionType) {
        case "activate":
          await activateUser.mutateAsync(selectedUser.id); 
          break;
        case "deactivate":
          await deactivateUser.mutateAsync(selectedUser.id); 
          break;
      }

      setShowDialog(false);
      setSelectedUser(null);
      setActionType(null);
      

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }, 300);
      
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const handleSaveUser = async (userData: UserFormData, userId?: number) => {
    try {
      let result;
      if (userId) {
        result = await updateUser.mutateAsync({ userId, userData });
      } else {
        result = await createUser.mutateAsync(userData);
      }
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }, 300);
      
      return result;
    } finally {
      setShowDialog(false);
      setSelectedUser(null);
      setActionType(null);
    }
  };

  const getActionText = () => {
    switch (actionType) {
      case "activate":
        return "Activate";
      case "deactivate":
        return "Deactivate";
      case "edit":
        return "Save Changes";
      case "create":
        return "Create User";
      default:
        return "";
    }
  };

  const getActionDescription = () => {
    if (!selectedUser && actionType !== "create") return "";
    
    if (actionType === "create") {
      return "Fill in the details to create a new user account.";
    }
    
    const userName = `${selectedUser?.first_name} ${selectedUser?.last_name}`;
    
    switch (actionType) {
      case "activate":
        return `Are you sure you want to activate ${userName}? This will allow them to access the system.`;
      case "deactivate":
        return `Are you sure you want to deactivate ${userName}? They will not be able to access the system.`;
      case "edit":
        return `You are editing ${userName}'s profile information.`;
      default:
        return "";
    }
  };

  return {
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
    isLoading: activateUser.isLoading || deactivateUser.isLoading,
  };
};