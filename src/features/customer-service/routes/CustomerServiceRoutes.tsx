// features/customer-service/routes/CustomerServiceRoutes.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import CustomerServicePage from "../pages/CustomerServicePage";

const CustomerServiceRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<CustomerServicePage />} />
    </Routes>
  );
};

export default CustomerServiceRoutes;