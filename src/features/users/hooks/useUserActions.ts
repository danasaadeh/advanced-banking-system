// features/users/hooks/useUserActions.ts
import { useState } from "react";
import { useActivateUser, useDeactivateUser, useSuspendUser } from "../services/user.mutations";

export const useUserActions = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionType, setActionType] = useState<"activate" | "deactivate" | "suspend" | "view" | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const activateUser = useActivateUser();
  const deactivateUser = useDeactivateUser();
  const suspendUser = useSuspendUser();

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setActionType("view");
    setShowDialog(true);
  };

  const handleActivate = (user: any) => {
    setSelectedUser(user);
    setActionType("activate");
    setShowDialog(true);
  };

  const handleDeactivate = (user: any) => {
    setSelectedUser(user);
    setActionType("deactivate");
    setShowDialog(true);
  };

  const handleSuspend = (user: any) => {
    setSelectedUser(user);
    setActionType("suspend");
    setShowDialog(true);
  };

  const executeAction = () => {
    if (!selectedUser || !actionType) return;

    switch (actionType) {
      case "activate":
        activateUser.mutate({ userId: selectedUser.id });
        break;
      case "deactivate":
        deactivateUser.mutate({ userId: selectedUser.id });
        break;
      case "suspend":
        suspendUser.mutate({ userId: selectedUser.id });
        break;
    }

    setShowDialog(false);
    setSelectedUser(null);
    setActionType(null);
  };

  const getActionText = () => {
    switch (actionType) {
      case "activate":
        return "Activate";
      case "deactivate":
        return "Deactivate";
      case "suspend":
        return "Suspend";
      default:
        return "";
    }
  };

  const getActionDescription = () => {
    if (!selectedUser) return "";
    
    const userName = `${selectedUser.first_name} ${selectedUser.last_name}`;
    
    switch (actionType) {
      case "activate":
        return `Are you sure you want to activate ${userName}? This will allow them to access the system.`;
      case "deactivate":
        return `Are you sure you want to deactivate ${userName}? They will not be able to access the system.`;
      case "suspend":
        return `Are you sure you want to suspend ${userName}? This action is reversible.`;
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
    handleSuspend,
    executeAction,
    getActionText,
    getActionDescription,
    isLoading: activateUser.isLoading || deactivateUser.isLoading || suspendUser.isLoading,
  };
};