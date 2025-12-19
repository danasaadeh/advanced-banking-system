// features/users/services/user.api.ts
import { httpClient } from "@/lib/axios";
import type { User, UsersResponse, CreateUserRequest, UpdateUserRequest } from "../types/user.types";

class UserApiService {
  async getUsers(
    search: string = "",
    role: string = "all",
    page: number = 1,
    perPage: number = 10
  ): Promise<UsersResponse> {
    try {
      const params: Record<string, any> = {
        page,
        per_page: perPage,
      };

      if (search.trim()) {
        params.search = search;
      }

      if (role !== "all") {
        params.role = role;
      }

      const response = await httpClient.get("/users", { params });
      
      return {
        data: response.data.data,
        pagination: {
          current_page: response.data.meta.current_page,
          last_page: response.data.meta.last_page,
          total: response.data.meta.total,
          per_page: response.data.meta.per_page,
          first_page_url: response.data.links.first,
          last_page_url: response.data.links.last,
          prev_page_url: response.data.links.prev,
          next_page_url: response.data.links.next,
        },
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch users");
    }
  }

  async getUserById(userId: number): Promise<User> {
    try {
      const response = await httpClient.get(`/users/${userId}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || `Failed to fetch user with ID ${userId}`);
    }
  }

  async createUser(userData: CreateUserRequest): Promise<{ success: boolean; message: string; data: User }> {
    try {
      const response = await httpClient.post("/users", userData);
      
      return {
        success: true,
        message: response.data.message || "User created successfully",
        data: response.data.user,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to create user");
    }
  }

  async updateUser(userId: number, userData: UpdateUserRequest): Promise<{ success: boolean; message: string; data: User }> {
    try {

      const response = await httpClient.post(`/users/${userId}`, userData);
      
      return {
        success: true,
        message: response.data.message || "User updated successfully",
        data: response.data.user || response.data.data,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to update user");
    }
  }

  async activateUser(userId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await httpClient.patch(`/users/${userId}/status`, { status: "active" });
      
      return {
        success: true,
        message: response.data.message || "User activated successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to activate user");
    }
  }

  async deactivateUser(userId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await httpClient.patch(`/users/${userId}/status`, { status: "inactive" });
      
      return {
        success: true,
        message: response.data.message || "User deactivated successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to deactivate user");
    }
  }
}

export const userApiService = new UserApiService();