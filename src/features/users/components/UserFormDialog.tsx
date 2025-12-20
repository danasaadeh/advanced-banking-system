// features/users/components/UserFormDialog.tsx
import React, { useState } from "react";
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
import { toast } from "@/shared/components/ui/sonner";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userData: UserFormData, userId?: number) => Promise<any>;
  user?: User | null;
  mode: "create" | "edit";
}

export const UserFormDialog: React.FC<UserFormDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  user,
  mode,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    formData,
    handleInputChange,
    handleRoleChange,
    handleStatusChange,
    resetForm,
    prepareSubmitData,
  } = useUserForm({ user, mode });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ فقط التحقق من الصحة يعرض toast هنا
    if (!formData.first_name || !formData.last_name || !formData.email || 
        !formData.phone || !formData.national_id || !formData.date_of_birth || 
        !formData.address || formData.roles.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const dataToSend = prepareSubmitData();
      // ✅ الـ toast ستظهر من الـ facade
      await onSave(dataToSend, user?.id);
      
      // إغلاق الديالوج بعد نجاح الطلب
      setTimeout(() => {
        resetForm();
        onOpenChange(false);
      }, 500);
      
    } catch (error: any) {
      // ❌ لا حاجة لـ toast هنا، تم التعامل معه في الـ facade
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const dialogTitle = mode === "create" ? "Add New User" : "Edit User";
  const dialogDescription = mode === "create" 
    ? "Fill in the details to create a new user account."
    : `Edit ${user?.first_name} ${user?.last_name}'s information.`;

  const handleDialogOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      resetForm();
      onOpenChange(false);
    }
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
              onInputChange={handleInputChange}
              onRoleChange={handleRoleChange}
              onStatusChange={handleStatusChange}
            />
          </ScrollArea>

          <DialogFooter className="px-6 py-4 border-t bg-muted/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (!isSubmitting) {
                  resetForm();
                  onOpenChange(false);
                }
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "create" ? "Creating User..." : "Saving Changes..."}
                </>
              ) : (
                mode === "create" ? "Create User" : "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>

        {isSubmitting && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                {mode === "create" ? "Creating user..." : "Updating user..."}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};