import { Link } from "react-router-dom";

import * as phimServices from '../../services/User/FilmService.jsx'
import { useEffect, useState } from "react";

export default function NavbarMenu(){

    const[allTheLoai,setAllTheLoai] = useState([]);
    const[allQuocGia,setAllQuocGia] = useState([]);

    const dataDang = [
    {
        idDang: 1,
        moTaDang: "full",
        tenDang: "Phim Lẻ"
    },
    {
        idDang: 2,
        moTaDang: "tap",
        tenDang: "Phim Bộ"
    }];

    useEffect(() => {
        const fetchApiAllTheLoai = async () => {
            const resultTL = await phimServices.GetAllTheLoai();
            setAllTheLoai(resultTL.data);

            const resultQG = await phimServices.GetAllQuocGia(1,12);
            setAllQuocGia(resultQG.data);

        }
        fetchApiAllTheLoai();
    },[])

    return (
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul  className="navbar-nav me-auto collapse navbar-collapse">
                <NavbarSingle link={"/Home"}>TRANG CHỦ</NavbarSingle>
                <NavbarList data={dataDang} type="DangPhim">DẠNG PHIM</NavbarList>
                <NavbarSingle link={`/SearchPhim/TopPhim/top-phim`} >TOP PHIM</NavbarSingle>
                <NavbarList data = {allTheLoai} type="TheLoai">THỂ LOẠI</NavbarList>
                <NavbarList data = {allQuocGia} type="QuocGia">QUỐC GIA</NavbarList>
                <NavbarSingle link={"/LienHe"}>LIÊN HỆ</NavbarSingle>
            </ul>
        </div>
    );
}


function NavbarSingle({children,link,type}){
    return(
            <li className="nav-item">
                 <Link to={link} className="nav-link @isHome" >{children}</Link>
            </li>
    );
}

function NavbarList({children,data,type}){
    const[listNavbar,setListNavbar] = useState([]);

    useEffect(() => {
        if(data){
            setListNavbar(data);
        }

    },[data])

    return(
        <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown">
                {children}
            </a>
            <ul className="dropdown-menu bg dropdown-menu-dark dropdown-menu-end">
                {listNavbar.map((result) => (
                    <li key={result.theLoaiId || result.quocGiaId || result.idDang }>
                        <Link className="dropdown-item " to={`/SearchPhim/${type}/${result.moTa || result.moTaQG || result.moTaDang}`} >{result.tenTL || result.tenQG || result.tenDang }</Link>
                    </li>
                ))};
            </ul>
        </li>
    );
}