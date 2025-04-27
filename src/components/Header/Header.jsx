import React, { useEffect, useState } from "react";
import TippyHeadless from '@tippyjs/react/headless';
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";

import logo from "../../assets/img/logo.png" 
import NavbarMenu from "../Header/NavbarMenu";
import TabButton from "../Button/TabButton";
import * as phimServices  from "../../services/api/FilmService";
import WrapperPopper from "../Popper/Wrapper";
import './Header.scss'
import FilmInfo from "../Layouts/FilmInfo/FilmInfo";

export default function Header(){
    const[search,setSearch] = useState("nhấn click")
    const [inputValue, setInputValue] = useState("");
    const[searchResult,setSearchResult] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setSearchResult([1,2,3])
        }, 3000);
    },[])

    function HandelSearch(onSearch) {
        alert(`${onSearch} được chọn`);
            const fetchApi = async () => {
                let result;
                if(!onSearch){
                    result = await phimServices.listphim();
                }else{
                    result = await phimServices.phim(onSearch);
                }
                setSearch(result);
            }
        fetchApi();
      }



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
                        
                            <form className="d-flex " onSubmit={(e) => e.preventDefault()}>
                                
                                <TippyHeadless
                                    interactive = {true}
                                    visible={searchResult.length > 0}
                                    render={attrs => (
                                        <WrapperPopper>
                                            <div className="search-result" tabIndex={-1} {...attrs}>
                                                <FilmInfo/>
                                                <FilmInfo/>
                                                <FilmInfo/>
                                            </div>
                                        </WrapperPopper>
                                    )}
                                    >
                                    <div>
                                        <input className="search-form-control me-2" type="search" name="timkiem" placeholder="Tìm anime..." value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
                                    </div>
                                </TippyHeadless>

                                <TabButton onSelect={() => {HandelSearch(inputValue)}}>Tìm</TabButton>
                            </form> 

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