// features/users/routes/UserRoutes.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import UsersListPage from "../pages/UsersListPage";

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<UsersListPage />} />
      <Route path=":id" element={<UsersListPage />} />
    </Routes>
  );
};

export default UserRoutes;