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

  const [dateOfBirth, setDateOfBirth] = useState<Date>();

  // Initialize form when user changes or mode changes
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
    setDateOfBirth(undefined);
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

  const handleDateSelect = (date: Date | undefined) => {
    setDateOfBirth(date);
    if (date) {
      // تنسيق التاريخ بشكل YYYY-MM-DD كما يتوقع الـ API
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      setFormData((prev) => ({
        ...prev,
        date_of_birth: `${year}-${month}-${day}`,
      }));
    }
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
    dateOfBirth,
    setFormData,
    setDateOfBirth,
    handleInputChange,
    handleRoleChange,
    handleStatusChange,
    handleDateSelect,
    resetForm,
    prepareSubmitData,
  };
};