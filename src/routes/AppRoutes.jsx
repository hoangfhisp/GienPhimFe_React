import { Route, Routes } from "react-router-dom";

import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound.jsx";
import Register from '../pages/Dang_nhap/Register';
import Help from '../pages/Dang_nhap/Help';
import ForgotPassword from '../pages/Dang_nhap/Forgot-password';
import ResetPassword from '../pages/Dang_nhap/Reset-Password';
import PhimList from '../pages/Quan_tri_vien/QuanLyPhim/List-Phim';
import Login from '../pages/Dang_nhap/Login.jsx'
import FilmBanner from "../components/Layouts/FilmBanners/FilmBanner.jsx";


export default function AppRoutes(){
    return(
        <Routes>
            <Route path="/Home" element = {<Home/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/help" element={<Help />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/List-Phim" element={<PhimList />} />
            {/* Thêm route 404 nếu muốn */}
            <Route path="*" element={<NotFound/>} />
        </Routes>
    );
}