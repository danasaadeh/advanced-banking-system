/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "../../../lib/axios";
import { rolesStorage, userIdStorage, userStorage } from "../storage";
import type {
  AuthPayload,
  AuthResponse,
  LogoutResponse,
  MeResponse,
  UserProfile,
} from "../types";

interface LoginResult {
  token: string;
  user: UserProfile;
  message: string;
}

class AuthServices {
  #endPoint = "/";

  async login(payload: AuthPayload): Promise<LoginResult> {
    const response = await httpClient.post<AuthResponse>(
      `${this.#endPoint}login`,
      payload,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const { token, user, message } = response.data;

    if (!token) {
      throw new Error(message || "Invalid login response: missing token");
    }

    // ✅ Save token
    userStorage.set(user);
    userIdStorage.set(user.id)
    // ✅ Save roles
    rolesStorage.set(user.roles);


    // ✅ Normalize user for frontend
    const normalizedUser: UserProfile = {
      id: user.id,
      fullName: `${user.first_name} ${user.last_name}`,
      email: user.email,
      roles: user.roles,
      status: user.status,
    };

    return {
      token,
      user: normalizedUser,
      message,
    };
  }

  async logout(): Promise<{ message: string }> {
    const response = await httpClient.delete<LogoutResponse>(
      `${this.#endPoint}logout`
    );

    // Clear local auth data
    userStorage.remove();
    rolesStorage.remove();

    return response.data;
  }

  // -----------------------
  // GET PROFILE
  // -----------------------
  async getMe(): Promise<UserProfile> {
    const response = await httpClient.get<MeResponse>(`${this.#endPoint}me`);

    const { user } = response.data;

    return {
      id: user.id,
      fullName: `${user.first_name} ${user.last_name}`,
      email: user.email,
      roles: user.roles,
      status: user.status,
    };
  }
}

export default new AuthServices();
