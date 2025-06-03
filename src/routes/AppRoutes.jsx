import { Route, Routes } from "react-router-dom";

import Home from "../pages/Home/Home";
import Register from '../pages/Dang_nhap/Register';
import Help from '../pages/Dang_nhap/Help';
import LienHe from "../pages/LienHe/LienHe.jsx";
import ForgotPassword from '../pages/Dang_nhap/Forgot-password';
import ResetPassword from '../pages/Dang_nhap/Reset-Password';
import OverviewDashboard from '../pages/Quan_tri_vien/TongQuan/Tong-Quan';
import PhimList from '../pages/Quan_tri_vien/QuanLyPhim/List-Phim';
import TapPhimList from '../pages/Quan_tri_vien/QuanLyTapPhim/List-Tap-Phim';
import TheLoaiList from '../pages/Quan_tri_vien/QuanLyTheLoai/List-The-Loai';
import QuocGiaList from '../pages/Quan_tri_vien/QuanLyQuocGia/List-Quoc-Gia';
import NgonNguList from '../pages/Quan_tri_vien/QuanLyNgonNgu/List-Ngon-Ngu';
import DaoDienList from '../pages/Quan_tri_vien/QuanLyDaoDien/List-Dao-Dien';
import DienVienList from '../pages/Quan_tri_vien/QuanLyDienVien/List-Dien-Vien';
import TheTagList from '../pages/Quan_tri_vien/QuanLyTheTag/List-The-Tag';
import UserList from '../pages/Quan_tri_vien/QuanLyNguoiDung/List-Nguoi-Dung.jsx';
import RoleList from '../pages/Quan_tri_vien/QuanLyVaiTro/List-Vai-Tro';
import Login from '../pages/Dang_nhap/Login.jsx'
import Phim from "../pages/Phim/Phim.jsx";
import XemPhim from "../pages/XemPhim/XemPhim.jsx";
import NotFound from "../pages/NotFound/NotFound.jsx";
import History from "../pages/History/History.jsx";
import SearchPhim from "../pages/SearchPhim/SearchPhim.jsx";
import NapTien from "../pages/NapTien/NapTien.jsx";
import TaoGiaoDichVIB from "../pages/NapTien/TaoGiaoDichVIB.jsx";
import * as authHook from "../hooks/auth.jsx";
import InfoAccount from "../pages/InfoAccount/InfoAccount.jsx";
import GoiThanhVien from "../pages/GoiThanhVien/GoiThanhVien.jsx";
import LichSuGiaoDich from "../pages/LichSuGiaoDich/LichSuGiaoDich.jsx";

export default function AppRoutes() {

    const userId = authHook.getUserIdFromToken();
    const role = authHook.getRolseUserFromToken();
    return (
        <Routes>
            {/* Router UI*/}
            <Route path="/Home" element={<Home />} />
            <Route path="/Phim/:id" element={<Phim />} />
            <Route path="/XemPhim/:id/:tap" element={<XemPhim />} />
            <Route path="/LienHe" element={<LienHe />} />
            {userId && <Route path="/History" element={<History />} />}
            {userId && <Route path="/InfoAccount" element={<InfoAccount />} />}
            <Route path="/SearchPhim/:type/:timtheo" element={<SearchPhim />} />
            <Route path="/help" element={<Help />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {userId && <Route path="/GoiThanhVien" element={<GoiThanhVien />} />}
            {userId && <Route path="/LichSuGiaoDich" element={<LichSuGiaoDich />} />}

            {/* <Route path="/Tong-Quan" element={<OverviewDashboard />} />
            <Route path="/List-Phim" element={<PhimList />} />
            <Route path="/List-The-Loai" element={<TheLoaiList />} />
            <Route path="/List-Quoc-Gia" element={<QuocGiaList />} />
            <Route path="/List-Ngon-Ngu" element={<NgonNguList />} />
            <Route path="/List-Dao-Dien" element={<DaoDienList />} />
            <Route path="/List-Dien-Vien" element={<DienVienList />} />
            <Route path="/List-The-Tag" element={<TheTagList />} />
            <Route path="/List-Nguoi-Dung" element={<UserList />} />
            <Route path="/List-Vai-Tro" element={<RoleList />} /> */}

            {/* Router Admin */}
            {userId && role === 'Admin' && <Route path="/Tong-Quan" element={<OverviewDashboard />} />}
            {userId && role === 'Admin' && <Route path="/List-Phim" element={<PhimList />} />}
            {userId && role === 'Admin' && <Route path="/List-Tap-Phim" element={<TapPhimList />} />}
            {userId && role === 'Admin' && <Route path="/List-Vai-Tro" element={<RoleList />} />}
            {userId && role === 'Admin' && <Route path="/List-The-Loai" element={<TheLoaiList />} />}
            {userId && role === 'Admin' && <Route path="/List-Quoc-Gia" element={<QuocGiaList />} />}
            {userId && role === 'Admin' && <Route path="/List-Ngon-Ngu" element={<NgonNguList />} />}
            {userId && role === 'Admin' && <Route path="/List-Dao-Dien" element={<DaoDienList />} />}
            {userId && role === 'Admin' && <Route path="/List-Dien-Vien" element={<DienVienList />} />}
            {userId && role === 'Admin' && <Route path="/List-The-Tag" element={<TheTagList />} />}
            {userId && role === 'Admin' && <Route path="/List-Nguoi-Dung" element={<UserList />} />}
            {userId && role === 'Admin' && <Route path="/List-Vai-Tro" element={<RoleList />} />}


            {/* Router nạp tiền */}
            {userId && <Route path="/NapTien/:phuongthuc" element={<NapTien />} />}
            {userId && <Route path="/TaoGiaoDichVIB" element={<TaoGiaoDichVIB />} />}

            {userId && <Route path="/TaoGiaoDichVIB" element={<TaoGiaoDichVIB />} />}
            {/* Thêm route 404 nếu muốn */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}