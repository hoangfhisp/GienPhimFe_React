import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Dang_nhap/Login'; // Import Login page

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;