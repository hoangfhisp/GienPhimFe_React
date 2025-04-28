import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Dang_nhap/Login';
import Register from '../pages/Dang_nhap/Register';
import Help from '../pages/Dang_nhap/Help';
import ForgotPassword from '../pages/Dang_nhap/Forgot-password';
import ResetPassword from '../pages/Dang_nhap/Reset-Password';
import PhimList from '../pages/Quan_tri_vien/QuanLyPhim/List-Phim';
import TheLoaiList from '../pages/Quan_tri_vien/QuanLyTheLoai/List-The-Loai';
import QuocGiaList from '../pages/Quan_tri_vien/QuanLyQuocGia/List-Quoc-Gia';
import NgonNguList from '../pages/Quan_tri_vien/QuanLyNgonNgu/List-Ngon-Ngu';
import TheTagList from '../pages/Quan_tri_vien/QuanLyTheTag/List-The-Tag';
import DienVienList from '../pages/Quan_tri_vien/QuanLyDienVien/List-Dien-Vien';
import DaoDienList from '../pages/Quan_tri_vien/QuanLyDaoDien/List-Dao-Dien';
import VaiTroList from '../pages/Quan_tri_vien/QuanLyVaiTro/List-Vai-Tro';
import TaiKhoanList from '../pages/Quan_tri_vien/QuanLyNguoiDung/List-Nguoi-Dung';
import OverviewDashboard from '../pages/Quan_tri_vien/TongQuan/Tong-Quan';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/help" element={<Help />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/List-Phim" element={<PhimList />} />
            <Route path="/List-The-Loai" element={<TheLoaiList />} />
            <Route path="/List-Quoc-Gia" element={<QuocGiaList />} />
            <Route path="/List-Ngon-Ngu" element={<NgonNguList />} />
            <Route path="/List-The-Tag" element={<TheTagList />} />
            <Route path="/List-Dien-Vien" element={<DienVienList />} />
            <Route path="/List-Dao-Dien" element={<DaoDienList />} />
            <Route path="/List-Vai-Tro" element={<VaiTroList />} />
            <Route path="/List-Nguoi-Dung" element={<TaiKhoanList />} />
            <Route path="/Tong-Quan" element={<OverviewDashboard />} />
        </Routes>
    );
};

export default AppRoutes;