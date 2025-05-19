import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import logo from "../../assets/img/logo.png" 
import NavbarMenu from "../Header/NavbarMenu";
import SearchFilm from "../Layouts/SearchFilm/SearchFilm";
import * as authHook from "../../hooks/auth.jsx"

export default function Header(){
    const[isLogin,setIsLogin] = useState(false);
    const[roleLogin,setRoleLogin] = useState('');

    var userId =authHook.getUserIdFromToken();
    var roleUser = authHook.getRolseUserFromToken();

    useEffect(() => {
        if(!userId || !roleUser){
            setIsLogin(false);
            return;
        }
        setRoleLogin(roleUser);
        setIsLogin(true);

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
                                    <img src="https://animevietsub.bio/statics/images/user-image.png" alt="logo-login" width="40" className="rounded-circle user-icon" />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end ">
                                    {isLogin && <UserLogin role={roleLogin} onlogins={setIsLogin}/>}
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

function UserLogin({onlogins,role,userId}){

    const handleLogout = () => {
        localStorage.removeItem('token');
        onlogins(false);
    }

    return(
        <>
            <ItemUser link={"/InfoAccount"}>Thông Tin Tài khoản</ItemUser>
            {role === "Admin" && <ItemUser>Quản Lý Giền Phim</ItemUser>}
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