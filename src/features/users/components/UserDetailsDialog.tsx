// features/users/components/UserDetailsDialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  IdCard,
  Clock,
  Shield,
  Hash,
  UserCog,
  Building,
  Edit,
} from "lucide-react";
import type { User as UserType } from "../types/user.types";

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType | null;
  onEdit?: (user: UserType) => void;
}

export const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({
  open,
  onOpenChange,
  user,
  onEdit,
}) => {
  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const fullName = `${user.first_name} ${user.middle_name ? user.middle_name + ' ' : ''}${user.last_name}`;

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(user);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  {fullName}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2 text-sm">
                  <Hash className="h-3 w-3" />
                  ID: {user.id}
                  <span className="mx-2">•</span>
                  <Badge className={getStatusColor(user.status)}>
                    {user.status.toUpperCase()}
                  </Badge>
                </DialogDescription>
              </div>
            </div>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={handleEditClick} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(85vh-180px)] px-6">
          <div className="space-y-4 py-4">
            {/* Personal Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <UserCog className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1 p-3 rounded-lg border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </div>
                  <div className="font-medium text-sm truncate">{user.email}</div>
                </div>

                <div className="space-y-1 p-3 rounded-lg border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    Phone
                  </div>
                  <div className="font-medium text-sm">{user.phone}</div>
                </div>

                <div className="space-y-1 p-3 rounded-lg border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IdCard className="h-3.5 w-3.5" />
                    National ID
                  </div>
                  <div className="font-medium text-sm font-mono">{user.national_id}</div>
                </div>

                <div className="space-y-1 p-3 rounded-lg border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Date of Birth
                  </div>
                  <div className="font-medium text-sm">
                    {formatDate(user.date_of_birth)} ({calculateAge(user.date_of_birth)} years)
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Address */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Address</h3>
              </div>
              
              <div className="p-3 rounded-lg border">
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                  <div className="font-medium text-sm leading-relaxed">{user.address}</div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Roles Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Roles</h3>
              </div>
              
              <div className="flex flex-wrap gap-2 p-3 rounded-lg border">
                {user.roles.map((role) => (
                  <Badge key={role} variant="secondary" className="px-3 py-1 text-xs">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Timestamps */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Timestamps</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1 p-3 rounded-lg border">
                  <div className="text-sm text-muted-foreground">Created</div>
                  <div className="font-medium text-sm">{formatDate(user.created_at)}</div>
                </div>

                <div className="space-y-1 p-3 rounded-lg border">
                  <div className="text-sm text-muted-foreground">Last Updated</div>
                  <div className="font-medium text-sm">{formatDate(user.updated_at || user.created_at)}</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="px-6 py-3 border-t bg-muted/50">
          <div className="text-xs text-muted-foreground text-center">
            User Profile Details
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};