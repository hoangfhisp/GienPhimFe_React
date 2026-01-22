import { Link } from "react-router-dom";

import * as phimServices from '../../services/User/FilmService.jsx'
import { useEffect, useState } from "react";

export default function NavbarMenu({ onItemClick }) {

    const [allTheLoai, setAllTheLoai] = useState([]);
    const [allQuocGia, setAllQuocGia] = useState([]);

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
            const resultTL = await phimServices.GetAllTheLoai(1, 20);
            setAllTheLoai(resultTL.data);

            const resultQG = await phimServices.GetAllQuocGia(1, 12);
            setAllQuocGia(resultQG.data);

        }
        fetchApiAllTheLoai();
    }, [])

    return (
        <div className="navbar-menu">
            <ul className="navbar-nav me-auto">

                <NavbarSingle link="/Home" onItemClick={onItemClick}>TRANG CHỦ</NavbarSingle>
                <NavbarSingle link="/SearchPhim/TopPhim/top-phim" onItemClick={onItemClick}>TOP PHIM</NavbarSingle>
                <NavbarList data={allTheLoai} type="TheLoai" onItemClick={onItemClick}>THỂ LOẠI</NavbarList>
                <NavbarList data={allQuocGia} type="QuocGia" onItemClick={onItemClick}>QUỐC GIA</NavbarList>
                <NavbarSingle link="/LienHe" onItemClick={onItemClick}>LIÊN HỆ</NavbarSingle>
            </ul>
        </div>
    );
}


function NavbarSingle({ children, link, onItemClick }) {
    return (
        <li className="nav-item">
            <Link to={link} className="nav-link" onClick={onItemClick}>{children}</Link>
        </li>
    );
}

function NavbarList({ children, data, type, onItemClick }) {
    const [listNavbar, setListNavbar] = useState([]);

    useEffect(() => {
        if (data) {
            setListNavbar(data);
        }

    }, [data])

    return (
        <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown">
                {children}
            </a>
            <ul className="dropdown-menu bg dropdown-menu-dark dropdown-menu-end">
                {listNavbar.map((result) => (
                    <li key={result.theLoaiId || result.quocGiaId || result.idDang}>
                        <Link className="dropdown-item " onClick={onItemClick} to={`/SearchPhim/${type}/${result.moTa || result.moTaQG || result.moTaDang}`} >{result.tenTL || result.tenQG || result.tenDang}</Link>
                    </li>
                ))}
            </ul>
        </li>
    );
}