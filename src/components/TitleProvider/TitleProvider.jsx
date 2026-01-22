import { Outlet, useLocation, matchRoutes } from "react-router-dom";
import { useEffect } from "react";
import ScrollToTop from "../Router/ScrollToTop";

const routes = [
    // ===== ROOT =====
    { path: "/", title: "Trang chủ" },
    { path: "/Home", title: "Trang chủ" },

    // ===== USER =====
    { path: "/Phim/:id", title: p => `Chi tiết phim #${p.id}` },
    { path: "/XemPhim/:id/:tap", title: p => `Xem #${p.id} - Tập ${p.tap}` },
    { path: "/SearchPhim/:type/:timtheo", title: "Tìm kiếm phim" },
    { path: "/History", title: "Lịch sử xem phim" },
    { path: "/InfoAccount", title: "Thông tin tài khoản" },
    { path: "/GoiThanhVien", title: "Gói thành viên" },
    { path: "/LichSuGiaoDich", title: "Lịch sử giao dịch" },
    { path: "/NapTien/:phuongthuc", title: p => `Nạp tiền (${p.phuongthuc})` },
    { path: "/TaoGiaoDichVIB", title: "Tạo giao dịch VIB" },

    // ===== STATIC =====
    { path: "/LienHe", title: "Liên hệ" },
    { path: "/DieuKhoan", title: "Điều khoản sử dụng" },
    { path: "/ChinhSach", title: "Chính sách bảo mật" },
    { path: "/help", title: "Trợ giúp" },

    // ===== AUTH =====
    { path: "/login", title: "Đăng nhập" },
    { path: "/register", title: "Đăng ký" },
    { path: "/forgot-password", title: "Quên mật khẩu" },
    { path: "/reset-password", title: "Đặt lại mật khẩu" },

    // ===== WATCH PARTY =====
    { path: "/watch-party/:groupId", title: p => `Watch Party #${p.groupId}` },

    // ===== ADMIN =====
    { path: "/admin", title: "Admin Panel" },
    { path: "/admin/Tong-Quan", title: "Admin - Tổng quan" },
    { path: "/admin/List-Phim", title: "Admin - Quản lý phim" },
    { path: "/admin/List-Tap-Phim", title: "Admin - Quản lý tập phim" },
    { path: "/admin/List-Quoc-Gia", title: "Admin - Quản lý quốc gia" },
    { path: "/admin/List-Dao-Dien", title: "Admin - Quản lý đạo diễn" },
    { path: "/admin/List-Ngon-Ngu", title: "Admin - Quản lý ngôn ngữ" },
    { path: "/admin/List-The-Loai", title: "Admin - Quản lý thể loại" },
    { path: "/admin/List-The-Tag", title: "Admin - Quản lý thẻ tag" },
    { path: "/admin/List-Dien-Vien", title: "Admin - Quản lý diễn viên" },
    { path: "/admin/List-Nguoi-Dung", title: "Admin - Quản lý người dùng" },
    { path: "/admin/List-Goi-Thanh-Vien", title: "Admin - Gói thành viên" },
    { path: "/admin/Bot", title: "Admin - Bot" },

    // ===== 404 =====
    { path: "*", title: "Không tìm thấy trang" },
];

export default function TitleProvider() {
    const location = useLocation();

    useEffect(() => {
        const matches = matchRoutes(routes, location);
        const match = matches?.at(-1);

        let title = "GienPhim";

        if (match) {
            const t = match.route.title;
            title = typeof t === "function" ? t(match.params) : t;
        }

        document.title = `${title} | GienPhim`;
    }, [location]);

    return (
        <>
            <ScrollToTop />
            <Outlet />
        </>);
}
