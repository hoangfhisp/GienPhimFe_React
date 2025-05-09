
import './Home.scss'

import BoxTitle from "../../components/Commons/BoxTitle";
import SeeMore from "../../components/Commons/SeeMore";
import AnimeList from "../../components/Layouts/AnimeList/AnimeList.jsx";
import FilmList from "../../components/Layouts/FilmList/FilmList.jsx";
import Notice from "../../components/Layouts/Notice/Notice.jsx";
import FilmRanking from "../../components/Layouts/FilmRanking";
import FilmBannerList from "../../components/Layouts/FilmBanners/FilmBannerList.jsx";



export default function Home() {

    return(
        <div className="container-main">
            <Notice/>

            <BoxTitle>New Phim</BoxTitle>

            <FilmList top={20} page={1} limit={20}/>

            <FilmBannerList></FilmBannerList>

            <br /><hr />
            <BoxTitle>Đề Cử</BoxTitle>

            <AnimeList page={1} limit={12}/>

            <SeeMore>Xem Thêm...</SeeMore>

            <FilmRanking>Hot Tuần</FilmRanking>
        </div>
    );
}