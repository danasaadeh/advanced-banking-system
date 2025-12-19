// features/users/components/UserFormContent.tsx
import React from "react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import { ROLES_OPTIONS, STATUS_OPTIONS, type UserFormData } from "../types/user.types";

interface UserFormContentProps {
  formData: UserFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: "active" | "inactive") => void;
}

export const UserFormContent: React.FC<UserFormContentProps> = ({
  formData,
  onInputChange,
  onRoleChange,
  onStatusChange,
}) => {
  // تنسيق التاريخ لعرضه في input type="date" (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      return "";
    }
  };

  return (
    <div className="space-y-4 p-6">
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
              onChange={onInputChange}
              placeholder="John"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="middle_name">Middle Name</Label>
            <Input
              id="middle_name"
              name="middle_name"
              value={formData.middle_name || ""}
              onChange={onInputChange}
              placeholder="Middle"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
              placeholder="1234567890"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth *</Label>
            <Input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={formatDateForInput(formData.date_of_birth)}
              onChange={onInputChange}
              required
              className="h-9"
              max={new Date().toISOString().split('T')[0]} // لا يمكن اختيار تاريخ مستقبلي
            />
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
              onChange={onInputChange}
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
              onValueChange={onRoleChange}
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
              value={formData.status || "active"}
              onValueChange={onStatusChange}
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
  );
};