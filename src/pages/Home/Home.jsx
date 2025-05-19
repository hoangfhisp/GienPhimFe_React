import { useState } from 'react';
import 'jwt-decode'
import './Home.scss'

import BoxTitle from "../../components/Commons/BoxTitle";
import SeeMore from "../../components/Commons/SeeMore";
import AnimeList from "../../components/Layouts/AnimeList/AnimeList.jsx";
import FilmList from "../../components/Layouts/FilmList/FilmList.jsx";
import Notice from "../../components/Layouts/Notice/Notice.jsx";
import FilmRanking from "../../components/Layouts/FilmRanking";
import FilmBannerList from "../../components/Layouts/FilmBanners/FilmBannerList.jsx";
import RenderPagination from '../../components/Commons/RenderPagination.jsx';
import { jwtDecode } from 'jwt-decode';
import * as authHook from '../../hooks/auth.jsx'



export default function Home() {
    const [pagination,setPagination] = useState([]);
    const [currentPage,setCurrentPage] = useState();
    
    return(
            <div className="container-main">
                <Notice/>

                <BoxTitle>New Phim</BoxTitle>

                <FilmList top={20} page={1} limit={20}/>

                <FilmBannerList top={8} page={1} limit={10}></FilmBannerList>

                <br /><hr />
                <BoxTitle>Đề Cử</BoxTitle>

                <AnimeList page={currentPage} limit={12} onPagination={setPagination}/>
                <RenderPagination data={pagination} onPageChange={setCurrentPage}/>

                <SeeMore>Xem Thêm...</SeeMore>

                <FilmRanking>Hot Tuần</FilmRanking>
               
            </div>
    );
}