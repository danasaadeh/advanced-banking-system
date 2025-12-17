export type AuthPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    middle_name?: string;
    email: string;
    phone: string;
    national_id: string;
    date_of_birth: string;
    address: string;
    status: "active" | "inactive";
    roles: string[]; // 👈 IMPORTANT
    created_at: string;
  };
}

export type UserProfile = {
  id: number;
  fullName: string;
  email: string;
  roles: string[];
  status: string;
};

export interface LogoutResponse {
  message: string;
}

export interface MeResponse {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    middle_name?: string;
    email: string;
    phone: string;
    national_id: string;
    date_of_birth: string;
    address: string;
    status: "active" | "inactive";
    roles: string[];
    created_at: string;
  };
}
