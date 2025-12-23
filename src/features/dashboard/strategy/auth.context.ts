export const getUserRoles = (): string[] => {
  const rawUser = localStorage.getItem("user");
  if (!rawUser) return [];

  try {
    const user = JSON.parse(rawUser);
    return user.roles ?? [];
  } catch {
    return [];
  }
};
