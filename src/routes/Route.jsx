import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Dang_nhap/Login'; 
import Register from '../pages/Dang_nhap/Register';
import Help from '../pages/Dang_nhap/Help';
import ForgotPassword from '../pages/Dang_nhap/Forgot-password';
import ResetPassword from '../pages/Dang_nhap/Reset-Password';
import PhimList from '../pages/Quan_tri_vien/QuanLyPhim/List-Phim';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/help" element={<Help />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/List-Phim" element={<PhimList />} />
    </Routes>
  );
};

export default AppRoutes;