import { Route, Routes } from "react-router-dom";

import Home from "../pages/Home/Home";
import Register from '../pages/Dang_nhap/Register';
import Help from '../pages/Dang_nhap/Help';
import LienHe from "../pages/LienHe/LienHe.jsx";
import ForgotPassword from '../pages/Dang_nhap/Forgot-password';
import ResetPassword from '../pages/Dang_nhap/Reset-Password';
import OverviewDashboard from '../pages/Quan_tri_vien/TongQuan/Tong-Quan';
import PhimList from '../pages/Quan_tri_vien/QuanLyPhim/List-Phim';
import TheLoaiList from '../pages/Quan_tri_vien/QuanLyTheLoai/List-The-Loai';
import QuocGiaList from '../pages/Quan_tri_vien/QuanLyQuocGia/List-Quoc-Gia';
import NgonNguList from '../pages/Quan_tri_vien/QuanLyNgonNgu/List-Ngon-Ngu';
import DaoDienList from '../pages/Quan_tri_vien/QuanLyDaoDien/List-Dao-Dien';
import DienVienList from '../pages/Quan_tri_vien/QuanLyDienVien/List-Dien-Vien';
import TheTagList from '../pages/Quan_tri_vien/QuanLyTheTag/List-The-Tag';
import UserList from '../pages/Quan_tri_vien/QuanLyNguoiDung/List-Nguoi-Dung';
import RoleList from '../pages/Quan_tri_vien/QuanLyVaiTro/List-Vai-Tro';
import Login from '../pages/Dang_nhap/Login.jsx'
import Phim from "../pages/Phim/Phim.jsx";
import XemPhim from "../pages/XemPhim/XemPhim.jsx";
import NotFound from "../pages/NotFound/NotFound.jsx";
import History from "../pages/History/History.jsx";
import SearchPhim from "../pages/SearchPhim/SearchPhim.jsx";
import * as authHook from"../hooks/auth.jsx";
import InfoAccount from "../pages/InfoAccount/InfoAccount.jsx";

export default function AppRoutes() {
    
    const userId = authHook.getUserIdFromToken();

    return (
        <Routes>
            <Route path="/Home" element={<Home />} />
            <Route path="/Phim/:id" element={<Phim />} />
            <Route path="/XemPhim/:id/:tap" element={<XemPhim />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/LienHe" element={<LienHe/>}/>
            {userId && <Route path="/History" element={<History/>}/>}
            {userId && <Route path="/InfoAccount" element={<InfoAccount/>}/>}
            <Route path="/SearchPhim/:type/:timtheo" element={<SearchPhim/>}/>
            <Route path="/help" element={<Help />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/Tong-Quan" element={<OverviewDashboard />} />
            <Route path="/List-Phim" element={<PhimList />} />
            <Route path="/List-The-Loai" element={<TheLoaiList />} />
            <Route path="/List-Quoc-Gia" element={<QuocGiaList />} />
            <Route path="/List-Ngon-Ngu" element={<NgonNguList />} />
            <Route path="/List-Dao-Dien" element={<DaoDienList />} />
            <Route path="/List-Dien-Vien" element={<DienVienList />} />
            <Route path="/List-The-Tag" element={<TheTagList />} />
            <Route path="/List-Nguoi-Dung" element={<UserList />} />
            <Route path="/List-Vai-Tro" element={<RoleList />} />
            {/* Thêm route 404 nếu muốn */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}