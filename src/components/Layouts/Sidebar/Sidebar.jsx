import "./Sidebar.scss";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Globe,
    Languages,
    Film,
    ListVideo,
    Shapes,
    Tags,
    Users,
    CreditCard,
    History,
    Bot,
    Clapperboard,
    UsersRound,
} from "lucide-react";

const menus = [
    { id: "tong-quan", label: "Thông tin", icon: LayoutDashboard, to: "/admin/Tong-Quan" },
    { id: "phim", label: "Phim", icon: Film, to: "/admin/List-Phim" },
    { id: "tap-phim", label: "Tập phim", icon: ListVideo, to: "/admin/List-Tap-Phim" },
    { id: "dao-dien", label: "Đạo diễn", icon: Clapperboard, to: "/admin/List-Dao-Dien" },
    { id: "dien-vien", label: "Diễn viên", icon: UsersRound, to: "/admin/List-Dien-Vien" },
    { id: "quoc-gia", label: "Quốc gia", icon: Globe, to: "/admin/List-Quoc-Gia" },
    { id: "ngon-ngu", label: "Ngôn ngữ", icon: Languages, to: "/admin/List-Ngon-Ngu" },
    { id: "the-loai", label: "Thể loại", icon: Shapes, to: "/admin/List-The-Loai" },
    { id: "the-tag", label: "Thẻ tag", icon: Tags, to: "/admin/List-The-Tag" },
    { id: "nguoi-dung", label: "Người dùng", icon: Users, to: "/admin/List-Nguoi-Dung" },
    { id: "goi-thanh-vien", label: "Gói thành viên", icon: CreditCard, to: "/admin/List-Goi-Thanh-Vien" },
    { id: "lich-su-giao-dich", label: "Lịch sử giao dịch", icon: History, to: "/admin/List-Lich-Su-Giao-Dich" },
    { id: "bot", label: "Bot", icon: Bot, to: "/admin/Bot" },
];

export default function Sidebar() {
    return (
        <aside className="Sidebar">
            <div className="Sidebar__logo">
                <img src="/images/logo-gienphimvuong-3.png.png" alt="GienPhim" />
            </div>

            <nav className="Sidebar__nav">
                {menus.map((m) => {
                    const Icon = m.icon;

                    return (
                        <NavLink
                            key={m.id}
                            to={m.to}
                            className={({ isActive }) =>
                                `Sidebar__item ${isActive ? "Sidebar__item--active" : ""}`
                            }
                        >
                            <span className="Sidebar__icon">
                                <Icon size={16} strokeWidth={1.8} />
                            </span>
                            <span className="Sidebar__label">{m.label}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
}
