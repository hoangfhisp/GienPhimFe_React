import React from "react";

import { Link } from "react-router-dom";

import logo from "../../assets/img/logo.png" 
import NavbarMenu from "../Header/NavbarMenu";
import SearchFilm from "../Layouts/SearchFilm/SearchFilm";

export default function Header(){

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
                                    <li>
                                        <a className="dropdown-item" href="/" >Đăng ký</a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="/" >Đăng Nhập</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        </>
    );
}