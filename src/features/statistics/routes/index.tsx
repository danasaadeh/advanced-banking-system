import React from "react";
import { Route, Routes } from "react-router-dom";
import { StatisticsPage } from "../pages";

const StatisticsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<StatisticsPage />} />
    </Routes>
  );
};

export default StatisticsRoutes;