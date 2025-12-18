// features/users/components/UserFormDialog.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ROLES_OPTIONS, STATUS_OPTIONS } from "../types/user.types";
import type { User, UserFormData } from "../types/user.types";

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
  const [formData, setFormData] = useState<UserFormData>({
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    phone: "",
    national_id: "",
    date_of_birth: "",
    address: "",
    roles: [],
    status: "active",
  });

  const [dateOfBirth, setDateOfBirth] = useState<Date>();

  // Initialize form when user changes or dialog opens
  useEffect(() => {
    if (mode === "edit" && user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        middle_name: user.middle_name || "",
        email: user.email,
        phone: user.phone,
        national_id: user.national_id,
        date_of_birth: user.date_of_birth,
        address: user.address,
        roles: user.roles,
        status: user.status,
      });

      if (user.date_of_birth) {
        setDateOfBirth(new Date(user.date_of_birth));
      }
    } else {
      // Reset form for create mode
      setFormData({
        first_name: "",
        last_name: "",
        middle_name: "",
        email: "",
        phone: "",
        national_id: "",
        date_of_birth: "",
        address: "",
        roles: [],
        status: "active",
      });
      setDateOfBirth(undefined);
    }
  }, [user, mode, open]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      roles: value ? [value] : [],
    }));
  };

  const handleStatusChange = (value: "active" | "inactive") => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setDateOfBirth(date);
    if (date) {
      setFormData((prev) => ({
        ...prev,
        date_of_birth: date.toISOString().split("T")[0],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "edit" && user) {
      onSave(formData, user.id);
    } else {
      onSave(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      middle_name: "",
      email: "",
      phone: "",
      national_id: "",
      date_of_birth: "",
      address: "",
      roles: [],
      status: "active",
    });
    setDateOfBirth(undefined);
  };

  const dialogTitle = mode === "create" ? "Add New User" : "Edit User";
  const dialogDescription = mode === "create" 
    ? "Fill in the details to create a new user account."
    : `Edit ${user?.first_name} ${user?.last_name}'s information.`;

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        if (!open) resetForm();
        onOpenChange(open);
      }}
    >
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
          <ScrollArea className="h-[calc(90vh-180px)] px-6">
            <div className="space-y-4 py-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      placeholder="John"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="middle_name">Middle Name</Label>
                    <Input
                      id="middle_name"
                      name="middle_name"
                      value={formData.middle_name}
                      onChange={handleInputChange}
                      placeholder="Middle"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john.doe@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="1234567890"
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Identity Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Identity Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="national_id">National ID *</Label>
                    <Input
                      id="national_id"
                      name="national_id"
                      value={formData.national_id}
                      onChange={handleInputChange}
                      placeholder="1234567890"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateOfBirth && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateOfBirth ? (
                            format(dateOfBirth, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateOfBirth}
                          onSelect={handleDateSelect}
                          initialFocus
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Address */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Address</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St, City, Country"
                    required
                  />
                </div>
              </div>

              <Separator />

              {/* Role and Status */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Account Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roles">Role *</Label>
                    <Select
                      value={formData.roles[0] || ""}
                      onValueChange={handleRoleChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES_OPTIONS.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
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