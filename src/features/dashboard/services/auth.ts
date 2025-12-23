export const getUserRoles = (): string[] => {
  const rawUser = localStorage.getItem("user");
  if (!rawUser) return [];

  try {
    const user = JSON.parse(rawUser);
    return Array.isArray(user.roles) ? user.roles : [];
  } catch {
    return [];
  }
};
