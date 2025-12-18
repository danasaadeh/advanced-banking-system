// features/users/services/user.api.ts
import type { User, UsersResponse, CreateUserRequest, UpdateUserRequest } from "../types/user.types";

class UserApiService {
  private mockUsers: User[] = [
    {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      middle_name: "Middle",
      email: "john.doe@example.com",
      phone: "1234567890",
      national_id: "1234567890",
      date_of_birth: "1990-01-01",
      address: "123 Main St, City",
      status: "active",
      roles: ["Admin"],
      created_at: "2025-12-17 13:00:56",
    },
    {
      id: 2,
      first_name: "Jane",
      last_name: "Smith",
      middle_name: null,
      email: "jane.smith@example.com",
      phone: "0987654321",
      national_id: "0987654321",
      date_of_birth: "1992-05-15",
      address: "456 Oak Ave, Town",
      status: "active",
      roles: ["Customer"],
      created_at: "2025-12-16 10:30:45",
    },
    {
      id: 3,
      first_name: "Robert",
      last_name: "Johnson",
      middle_name: "James",
      email: "robert.j@example.com",
      phone: "5551234567",
      national_id: "5551234567",
      date_of_birth: "1985-08-22",
      address: "789 Pine Rd, Village",
      status: "inactive",
      roles: ["Manager", "Teller"],
      created_at: "2025-12-15 14:20:30",
    },
    {
      id: 4,
      first_name: "Sarah",
      last_name: "Williams",
      middle_name: null,
      email: "sarah.w@example.com",
      phone: "4449876543",
      national_id: "4449876543",
      date_of_birth: "1995-03-10",
      address: "321 Elm St, City",
      status: "active",
      roles: ["Teller"],
      created_at: "2025-12-14 09:15:22",
    },
    {
      id: 5,
      first_name: "Michael",
      last_name: "Brown",
      middle_name: "David",
      email: "michael.b@example.com",
      phone: "7778889999",
      national_id: "7778889999",
      date_of_birth: "1988-11-30",
      address: "654 Maple Dr, Town",
      status: "inactive",
      roles: ["Admin", "Manager"],
      created_at: "2025-12-13 16:45:18",
    },
    {
      id: 6,
      first_name: "Emily",
      last_name: "Davis",
      middle_name: "Rose",
      email: "emily.d@example.com",
      phone: "3332221111",
      national_id: "3332221111",
      date_of_birth: "1993-07-20",
      address: "987 Cedar Ln, City",
      status: "active",
      roles: ["Teller"],
      created_at: "2025-12-12 11:10:05",
    },
    {
      id: 7,
      first_name: "David",
      last_name: "Wilson",
      middle_name: null,
      email: "david.w@example.com",
      phone: "6665554444",
      national_id: "6665554444",
      date_of_birth: "1987-04-18",
      address: "555 Birch St, Town",
      status: "inactive",
      roles: ["Customer"],
      created_at: "2025-12-11 08:45:33",
    },
    {
      id: 8,
      first_name: "Lisa",
      last_name: "Taylor",
      middle_name: "Ann",
      email: "lisa.t@example.com",
      phone: "2223334444",
      national_id: "2223334444",
      date_of_birth: "1991-09-25",
      address: "222 Spruce Ave, Village",
      status: "active",
      roles: ["Manager"],
      created_at: "2025-12-10 15:20:10",
    },
  ];

  private generateId(): number {
    return Math.max(...this.mockUsers.map(u => u.id)) + 1;
  }

  async getUsers(
    search: string = "",
    role: string = "all",
    page: number = 1,
    perPage: number = 10
  ): Promise<UsersResponse> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filteredUsers = this.mockUsers;

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          `${user.first_name} ${user.last_name}`
            .toLowerCase()
            .includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.phone.includes(search) ||
          user.national_id.includes(search)
      );
    }

    if (role !== "all") {
      filteredUsers = filteredUsers.filter((user) =>
        user.roles.includes(role)
      );
    }

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      data: paginatedUsers,
      pagination: {
        current_page: page,
        last_page: Math.ceil(filteredUsers.length / perPage),
        total: filteredUsers.length,
        per_page: perPage,
        first_page_url: "",
        last_page_url: "",
        prev_page_url: page > 1 ? `?page=${page - 1}` : null,
        next_page_url: endIndex < filteredUsers.length ? `?page=${page + 1}` : null,
      },
    };
  }

  async getUserById(userId: number): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const user = this.mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");

    return user;
  }

  async createUser(userData: CreateUserRequest): Promise<{ success: boolean; message: string; data: User }> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newUser: User = {
      id: this.generateId(),
      ...userData,
      middle_name: userData.middle_name || null,
      status: userData.status || "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.mockUsers.unshift(newUser);

    return {
      success: true,
      message: "User created successfully",
      data: newUser,
    };
  }

  async updateUser(userId: number, userData: UpdateUserRequest): Promise<{ success: boolean; message: string; data: User }> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const userIndex = this.mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new Error("User not found");

    const updatedUser = {
      ...this.mockUsers[userIndex],
      ...userData,
      updated_at: new Date().toISOString(),
    };

    this.mockUsers[userIndex] = updatedUser;

    return {
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    };
  }

  async activateUser(userId: number): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const user = this.mockUsers.find((u) => u.id === userId);
    if (user) {
      user.status = "active";
      user.updated_at = new Date().toISOString();
    }

    return {
      success: true,
      message: "User activated successfully",
    };
  }

  async deactivateUser(userId: number): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const user = this.mockUsers.find((u) => u.id === userId);
    if (user) {
      user.status = "inactive";
      user.updated_at = new Date().toISOString();
    }

    return {
      success: true,
      message: "User deactivated successfully",
    };
  }
}

export const userApiService = new UserApiService();