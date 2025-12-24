// features/users/hooks/useUserForm.ts
import { useState, useEffect } from "react";
import type { User, UserFormData } from "../types/user.types";

interface UseUserFormProps {
  user?: User | null;
  mode: "create" | "edit";
}

export const useUserForm = ({ user, mode }: UseUserFormProps) => {
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
    } else {
      // Reset form for create mode
      resetForm();
    }
  }, [user, mode]);

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
  };

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

  const prepareSubmitData = (): UserFormData => {
    return {
      first_name: formData.first_name,
      last_name: formData.last_name,
      middle_name: formData.middle_name || undefined,
      email: formData.email,
      phone: formData.phone,
      national_id: formData.national_id,
      date_of_birth: formData.date_of_birth,
      address: formData.address,
      roles: formData.roles,
      status: formData.status,
    };
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleRoleChange,
    handleStatusChange,
    resetForm,
    prepareSubmitData,
  };
};