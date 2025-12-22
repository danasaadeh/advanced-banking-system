/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Provides access to user authentication token and user info storage.
 * Utilizes the `dataStorage` utility to persist and retrieve the user's token, roles, and ID.
 *
 * @see dataStorage
 * @type {ReturnType<typeof dataStorage>}
 */
import { dataStorage } from "../../../lib/storage";

// Persistent user token storage (Remember Me = ON)
export const userTokenStorage = dataStorage<string>("token");

// Session token (Remember Me = OFF)
export const sessionUserTokenStorage = dataStorage<string>(
  "session_token",
  () => (typeof window !== "undefined" ? sessionStorage : null)
);

// Persistent user roles
export const rolesStorage = dataStorage<string[]>("roles");

// Persistent user ID
export const userIdStorage = dataStorage<number>("user_id");

// Optional: store full user object if needed
export const userStorage = dataStorage<any>("user");
