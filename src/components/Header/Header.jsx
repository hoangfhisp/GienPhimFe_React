import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import logo from "../../assets/img/logo.png" 
import NavbarMenu from "../Header/NavbarMenu";
import SearchFilm from "../Layouts/SearchFilm/SearchFilm";
import * as authHook from "../../hooks/auth.jsx"
import * as authServices from "../../services/Admin/AuthenticationService.jsx"
import logoDefaultUser from "../../assets/img/LogoDefaultUser.webp"
import { formatVND } from "../../untils/Format.jsx";
import * as managerServices from '../../services/ManagerService.jsx'

export default function Header(){
    const[isLogin,setIsLogin] = useState(false);
    const[roleLogin,setRoleLogin] = useState('');
    const[dataUser,setDataUser] = useState([]);

    var userId =authHook.getUserIdFromToken();
    var roleUser = authHook.getRolseUserFromToken();

    useEffect(() => {
        if(!userId || !roleUser){
            setIsLogin(false);
            return;
        }
        setRoleLogin(roleUser);
        setIsLogin(true);

        const fetchApi = async () => {
            var result = await authServices.getUserById(userId);
            setDataUser(result);
            await managerServices.CheckXuLyGoiHetHanUser(userId);
        }
        fetchApi();

    },[userId,roleUser]);


    return(
        <>
            <header>
                <nav className="navbar navbar-expand-lg navbar-dark bg-black">
                    <div className="container">
                        <Link to ="/Home" className="navbar-brand" >
                            <img src= {logo} alt="logo"/>
                        </Link>

                        {/* Nút mở menu trên mobile */}
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        

                        <NavbarMenu/>
                        
                        <SearchFilm/>

                        <seacr/>

                        <ul className="navbar-nav ms-3">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown">
                                    <img src={userId && dataUser?.avatarND ? dataUser.avatarND : logoDefaultUser} alt="logo-login" width="40" className="avatar logologin" />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end ">
                                    {isLogin && <UserLogin data={dataUser} role={roleLogin} onlogins={setIsLogin}/>}
                                    {!isLogin && <UserLogout/>}
                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        </>
    );
}

function UserLogout(){
    return(
        <>
            <ItemUser link={"/Login"}>Đăng Nhập</ItemUser>
            <ItemUser link={"/register"}>Đăng ký</ItemUser>
        </>
    );
}

function UserLogin({onlogins,role,data}){

    const handleLogout = () => {
        localStorage.removeItem('token');
        onlogins(false);
    }

    console.log(data)
    return(
        <>
            <ItemUser link={"/InfoAccount"}>Thông Tin Tài khoản</ItemUser>
            {role === "Admin" && <ItemUser link={"/Tong-Quan"}>Quản Lý Giền Phim</ItemUser>}
            {role === "User" && <ItemUser link={"/NapTien/Home"} >Nạp Tiền: {formatVND(data.soDuTaiKhoan || 0)}</ItemUser>}
            <ItemUser link={"/GoiThanhVien"}>Mua Gói Thành Viên</ItemUser>
            <ItemUser link={"/History"}>Lịch Sử Xem</ItemUser>
            <ItemUser link={"/LienHe"}>Liên Hệ Giền Phim</ItemUser>
            <ItemUser link={'/Home'} onSelect = {() => handleLogout()} >Đăng Xuất</ItemUser>
        </>
    );
}


function ItemUser({children,onSelect,link}){
    return(
        <li>
            <Link to={link} className="dropdown-item" onClick={onSelect} >{children}</Link>
        </li>
    );
}