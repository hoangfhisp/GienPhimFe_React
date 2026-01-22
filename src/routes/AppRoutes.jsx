import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Register from '../pages/Dang_nhap/Register';
import Help from '../pages/Dang_nhap/Help';
import LienHe from "../pages/LienHe/LienHe.jsx";
import ForgotPassword from '../pages/Dang_nhap/Forgot-password';
import ResetPassword from '../pages/Dang_nhap/Reset-Password';
import TongQuan from '../pages/Quan_tri_vien/TongQuan/Tong-Quan';
import AdminLayout from "../components/Layouts/AdminLayout/AdminLayout.jsx";
import WatchPartyLayout from "../components/Layouts/WatchPartyLayout/WatchPartyLayout";
import ListPhim from "../pages/Quan_tri_vien/QuanLyPhim/List-Phim";
import ListTapPhim from "../pages/Quan_tri_vien/QuanLyTapPhim/List-Tap-Phim";
import ListQuocGia from "../pages/Quan_tri_vien/QuanLyQuocGia/List-Quoc-Gia";
import ListNgonNgu from "../pages/Quan_tri_vien/QuanLyNgonNgu/List-Ngon-Ngu";
import ListTheLoai from "../pages/Quan_tri_vien/QuanLyTheLoai/List-The-Loai";
import ListTheTag from "../pages/Quan_tri_vien/QuanLyTheTag/List-The-Tag";
import ListDaoDien from "../pages/Quan_tri_vien/QuanLyDaoDien/List-Dao-Dien";
import ListDienVien from "../pages/Quan_tri_vien/QuanLyDienVien/List-Dien-Vien";
import ListNguoiDung from "../pages/Quan_tri_vien/QuanLyNguoiDung/List-Nguoi-Dung.jsx";
import ListGoiThanhVien from "../pages/Quan_tri_vien/QuanLyGoiThanhVien/List-Goi-Thanh-Vien";
import ListBot from "../pages/Quan_tri_vien/QuanLyBot/List-Bot.jsx";
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
import AdminGuard from "../components/AdminGuard/AdminGuard";
import DieuKhoan from "../pages/DieuKhoanChinhSach/DieuKhoan.jsx";
import ChinhSach from "../pages/DieuKhoanChinhSach/ChinhSach.jsx";
import TitleProvider from "../components/TitleProvider/TitleProvider.jsx";

export default function AppRoutes() {

    const userId = authHook.getUserIdFromToken();
    const role = authHook.getRolseUserFromToken();

    return (
        <Routes>
            <Route element={<TitleProvider />}>
            
                {/* Redirect root / → /Home */}
                <Route path="/" element={<Navigate to="/Home" replace />} />

                {/* Router UI*/}
                <Route path="/Home" element={<Home />} />
                <Route path="/Phim/:id" element={<Phim />} />
                <Route path="/XemPhim/:id/:tap" element={<XemPhim />} />
                <Route path="/LienHe" element={<LienHe />} />
                <Route path="/History" element={<History />} />
                {userId && <Route path="/InfoAccount" element={<InfoAccount />} />}
                <Route path="/SearchPhim/:type/:timtheo" element={<SearchPhim />} />
                <Route path="/help" element={<Help />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/DieuKhoan" element={<DieuKhoan />} />
                <Route path="/ChinhSach" element={<ChinhSach />} />
                {userId && <Route path="/GoiThanhVien" element={<GoiThanhVien />} />}
                {userId && <Route path="/LichSuGiaoDich" element={<LichSuGiaoDich />} />}

                {/* <Route path="/admin" element={<AdminLayout />}>
                    <Route path="Tong-Quan" element={<TongQuan />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="List-Quoc-Gia" element={<ListQuocGia />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="List-Ngon-Ngu" element={<ListNgonNgu />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="List-The-Loai" element={<ListTheLoai />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="List-The-Tag" element={<ListTheTag />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="List-Dao-Dien" element={<ListDaoDien />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="List-Dien-Vien" element={<ListDienVien />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="List-Phim" element={<ListPhim />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="List-Tap-Phim" element={<ListTapPhim />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="List-Nguoi-Dung" element={<ListNguoiDung />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="List-Goi-Thanh-Vien" element={<ListGoiThanhVien />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="Bot" element={<ListBot />} />
                </Route>

                <Route path="/List-Vai-Tro" element={<RoleList />} /> */}
                <Route path="/watch-party/:groupId" element={<WatchPartyLayout />} />

                {/* Router Admin */}
                <Route element={<AdminGuard />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="Tong-Quan" element={<TongQuan />} />
                        <Route path="List-Quoc-Gia" element={<ListQuocGia />} />
                        <Route path="List-Dao-Dien" element={<ListDaoDien />} />
                        <Route path="List-Ngon-Ngu" element={<ListNgonNgu />} />
                        <Route path="List-The-Loai" element={<ListTheLoai />} />
                        <Route path="List-The-Tag" element={<ListTheTag />} />
                        <Route path="List-Dien-Vien" element={<ListDienVien />} />
                        <Route path="List-Phim" element={<ListPhim />} />
                        <Route path="List-Tap-Phim" element={<ListTapPhim />} />
                        <Route path="List-Nguoi-Dung" element={<ListNguoiDung />} />
                        <Route path="List-Goi-Thanh-Vien" element={<ListGoiThanhVien />} />
                        <Route path="Bot" element={<ListBot />} />
                    </Route>
                </Route>
                {/* {userId && role === 'Admin' && <Route path="/List-Goi-Thanh-Vien" element={<GoiThanhVienList />} />}
                {userId && role === 'Admin' && <Route path="/List-Lich-Su-Giao-Dich" element={<LichSuGiaoDichList />} />} */}


                {/* Router nạp tiền */}
                {userId && <Route path="/NapTien/:phuongthuc" element={<NapTien />} />}
                {userId && <Route path="/TaoGiaoDichVIB" element={<TaoGiaoDichVIB />} />}

                {/* Thêm route 404 nếu muốn */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}