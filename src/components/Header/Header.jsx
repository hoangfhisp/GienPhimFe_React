import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import logo from "../../assets/img/logo.png"
import NavbarMenu from "../Header/NavbarMenu";
import SearchFilm from "../Layouts/SearchFilm/SearchFilm";
import * as authHook from "../../hooks/auth.jsx"
import * as authServices from "../../services/Admin/AuthenticationService.jsx"
import logoDefaultUser from "../../assets/img/LogoDefaultUser.png"
import { formatURLImage, formatVND } from "../../untils/Format.jsx";
import * as managerServices from '../../services/User/ManagerService.jsx'
import * as userService from '../../services/User/UserService.jsx'
import './Header.scss'
export default function Header() {
    const [isLogin, setIsLogin] = useState(false);
    const [roleLogin, setRoleLogin] = useState('');
    const [dataUser, setDataUser] = useState([]);
    const [dataWallet, setDataWallet] = useState([]);
    var userId = authHook.getUserIdFromToken();
    var roleUser = authHook.getRolseUserFromToken();

    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        if (!userId || !roleUser) {
            setIsLogin(false);
            return;
        }
        setRoleLogin(roleUser);
        setIsLogin(true);

        const fetchApi = async () => {
            var result = await authServices.getUserById(userId);
            setDataUser(result.data);
            await managerServices.CheckXuLyGoiHetHanUser(userId);;
            var result = await userService.getWalletByUserId(userId);
            setDataWallet(result.data);
        }
        fetchApi();

    }, [userId, roleUser]);
    
    return (
        <>
            <header>
                <nav className="navbar navbar-expand-lg navbar-dark bg-black">
                    <div className="container">
                        <Link to="/Home" className="navbar-brand" >
                            <img src={logo} alt="logo" />
                        </Link>

                        {/* Nút mở menu trên mobile */}
                        <button
                            className="btn-open-sidebar text-white d-lg-none"
                            onClick={() => setShowSidebar(true)}
                        >
                            ☰
                        </button>

                        <div className="d-none d-lg-flex flex-grow-1 justify-content-between align-items-center">
                            <NavbarMenu onItemClick={() => setShowSidebar(false)} />
                            <SearchFilm />
                        </div>

                        <ul className="navbar-nav ms-3 d-none d-lg-flex">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown">
                                    <img src={userId && dataUser?.avatarND ? formatURLImage(dataUser.avatarND) : logoDefaultUser} alt="logo-login" width="40" className="avatar logologin" />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end ">
                                    {isLogin && <UserLogin data={dataUser} role={roleLogin} onlogins={setIsLogin} />}
                                    {!isLogin && <UserLogout />}
                                </ul>
                            </li>
                        </ul>
                        {isLogin && (
                            <ul className="navbar-nav ms-3 d-none d-lg-flex">
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle d-flex align-items-center" href="/" role="button" data-bs-toggle="dropdown">
                                        <span className="badge bg-warning text-dark">{formatVND(dataWallet?.soDu || "0")}</span>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                                        <WalletUser />
                                    </ul>
                                </li>
                            </ul>)}
                    </div>
                </nav>
            </header>
            <div className={`mobile-sidebar ${showSidebar ? "show" : ""}`}>
                <div className="sidebar-header">
                    <img src={logo} alt="logo" className="sidebar-logo" />

                    <button
                        className="btn-close-sidebar"
                        onClick={() => setShowSidebar(false)}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* ===== USER MOBILE ===== */}
                {/* ===== USER + WALLET (MOBILE AS MENU ITEM) ===== */}
                <ul className="navbar-nav d-block d-lg-none mb-3">

                    {/* ===== AVATAR DROPDOWN ===== */}
                    <li className="nav-item dropdown text-center">
                        <a
                            className="nav-link dropdown-toggle d-flex flex-column align-items-center"
                            href="/"
                            role="button"
                            data-bs-toggle="dropdown"
                        >
                            <img
                                src={
                                    userId && dataUser?.avatarND
                                        ? formatURLImage(dataUser.avatarND)
                                        : logoDefaultUser
                                }
                                alt="avatar"
                                className="sidebar-avatar mb-2"
                            />
                            <span className="text-white">
                                {isLogin ? dataUser?.tenND : "Tài khoản"}
                            </span>
                        </a>

                        <ul className="dropdown-menu dropdown-menu-dark w-100 text-center">
                            {isLogin ? (
                                <UserLogin
                                    data={dataUser}
                                    role={roleLogin}
                                    onlogins={setIsLogin}
                                    setShowSidebar={setShowSidebar}
                                />
                            ) : (
                                <UserLogout />
                            )}
                        </ul>
                    </li>

                    {/* ===== WALLET DROPDOWN ===== */}
                    {isLogin && (
                        <li className="nav-item dropdown text-center mt-2">
                            <a
                                className="nav-link dropdown-toggle"
                                href="/"
                                role="button"
                                data-bs-toggle="dropdown"
                            >
                                Số dư: <span className="badge bg-warning text-dark">
                                    {formatVND(dataWallet?.soDu || 0)}
                                </span>
                            </a>

                            <ul className="dropdown-menu dropdown-menu-dark w-100 text-center">
                                <WalletUser />
                            </ul>
                            <div className="mobile-search">
                                <SearchFilm setShowSidebar={setShowSidebar} />
                            </div>
                        </li>
                    )}
                </ul>



                {/* ===== MENU ===== */}
                <NavbarMenu onItemClick={() => setShowSidebar(false)} />
            </div>

            {showSidebar && (
                <div
                    className="sidebar-backdrop"
                    onClick={() => setShowSidebar(false)}
                />
            )}
        </>
    );
}

function UserLogout() {
    return (
        <>
            <ItemUser link={"/Login"}>Đăng Nhập</ItemUser>
            <ItemUser link={"/register"}>Đăng ký</ItemUser>
        </>
    );
}

function UserLogin({ onlogins, role, setShowSidebar }) {
    const closeSidebar = () => {
        if (typeof setShowSidebar === "function") {
            setShowSidebar(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rf_token');
        onlogins(false);
    }

    return (
        <>
            <ItemUser link={"/InfoAccount"} onSelect={() => closeSidebar()}>Thông Tin Tài khoản</ItemUser>
            {role === "Admin" && <ItemUser link={"/Admin/Tong-Quan"}>Quản Lý Giền Phim</ItemUser>}
            <ItemUser link={"/GoiThanhVien"}>Mua Gói Thành Viên</ItemUser>
            <ItemUser link={"/History"} onSelect={() => closeSidebar()}>Lịch Sử Xem</ItemUser>
            <ItemUser link={"/LienHe"}>Liên Hệ Giền Phim</ItemUser>
            <ItemUser link={'/Home'} onSelect={() => handleLogout()} >Đăng Xuất</ItemUser>
        </>
    );
}


function WalletUser() {

    return (
        <>
            <ItemUser link={"/LichSuGiaoDich"}>Lịch Sử Giao Dịch</ItemUser>
            <ItemUser link={"/NapTien/Home"}>Nạp Tiền</ItemUser>
        </>
    );
}

function ItemUser({ children, onSelect, link }) {
    return (
        <li>
            <Link to={link} className="dropdown-item" onClick={onSelect} >{children}</Link>
        </li>
    );
}