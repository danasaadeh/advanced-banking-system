// features/users/components/UserFormDialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import type { User, UserFormData } from "../types/user.types";
import { useUserForm } from "../hooks/useUserForm";
import { UserFormContent } from "./UserFormContent";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userData: UserFormData, userId?: number) => void;
  user?: User | null;
  isLoading?: boolean;
  mode: "create" | "edit";
}

export const UserFormDialog: React.FC<UserFormDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  user,
  isLoading = false,
  mode,
}) => {
  const {
    formData,
    dateOfBirth,
    handleInputChange,
    handleRoleChange,
    handleStatusChange,
    handleDateSelect,
    resetForm,
    prepareSubmitData,
  } = useUserForm({ user, mode });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSend = prepareSubmitData();

    if (mode === "edit" && user) {
      onSave(dataToSend, user.id);
    } else {
      onSave(dataToSend);
    }
  };

  const dialogTitle = mode === "create" ? "Add New User" : "Edit User";
  const dialogDescription = mode === "create" 
    ? "Fill in the details to create a new user account."
    : `Edit ${user?.first_name} ${user?.last_name}'s information.`;

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) resetForm();
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl font-bold">
            {dialogTitle}
          </DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <ScrollArea className="h-[calc(90vh-180px)]">
            <UserFormContent
              formData={formData}
              dateOfBirth={dateOfBirth}
              onInputChange={handleInputChange}
              onRoleChange={handleRoleChange}
              onStatusChange={handleStatusChange}
              onDateSelect={handleDateSelect}
            />
          </ScrollArea>

          <DialogFooter className="px-6 py-4 border-t bg-muted/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "create" ? "Creating..." : "Saving..."}
                </>
              ) : (
                mode === "create" ? "Create User" : "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};