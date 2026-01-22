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
import * as quangCao from '../../components/Layouts/QuangCao/QuangCao.jsx'


export default function Home() {
    
    const [pagination,setPagination] = useState([]);
    const [currentPage,setCurrentPage] = useState(1);
    
    const userId = authHook.getUserIdFromToken();

    return(
            <div className="container-main">
                <Notice/>

                <BoxTitle>New Phim</BoxTitle>

                <FilmList  page={1} limit={20}/>

                <FilmBannerList page={1} limit={10}></FilmBannerList>

                <br /><hr />
                <BoxTitle>Đề Cử</BoxTitle>

                <AnimeList page={currentPage} limit={12} onPagination={setPagination}/>
                <RenderPagination data={pagination} onPageChange={setCurrentPage}/>

                <SeeMore>Xem Thêm...</SeeMore>
                <quangCao.QuangCaoNgang userId={userId} src={"https://phimimg.com/upload/vod/20250112-1/fbf0edd755fb8be213f1d59ab1497202.jpg"} href={"https://gienphim-fmd0bneqe9crddfg.canadacentral-01.azurewebsites.net/Phim/Index/1"}></quangCao.QuangCaoNgang>
                <FilmRanking>Hot Tuần</FilmRanking>
               
            </div>
    );
}