import React from "react";
import NavbarMenu from "./NavbarMenu";
import logo from "../../assets/img/logo.png" 
import './Header.scss';  // Import file CSS vào đây


export default function header(){
    return(
        <>
            <header>
                <nav class="navbar navbar-expand-lg navbar-dark bg-black">
                    <div class="container">
                       <a class="navbar-brand" href="/">
                        <img src= {logo} alt="logo"/>
                        
                       </a>

                        {/* Nút mở menu trên mobile */}
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <span class="navbar-toggler-icon"></span>
                        </button>

                       <NavbarMenu home={"Trang chủ"}/>
                    </div>
                </nav>
            </header>
        </>
    );
}