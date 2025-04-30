import { use, useEffect, useState } from "react";

import BoxTitle from "../../components/Commons/BoxTitle";
import SeeMore from "../../components/Commons/SeeMore";
import AnimeList from "../../components/Layouts/AnimeList";
import FilmBanner from "../../components/Layouts/FilmBanner";
import FilmList from "../../components/Layouts/FilmList";
import Notice from "../../components/Layouts/Notice";
import FilmRanking from "../../components/Layouts/FilmRanking";
import * as phimServices from "../../services/User/FilmService"

export default function Home(){

    const [listPhimResult,setListPhimResult] = useState([]);
    
    useEffect(() => {
        
        const fetchApi = async () => {
            
            const result = await phimServices.listphim(1,12);
            setListPhimResult(result.data);
        }

        fetchApi();
        
    },[]);

    return(
            <div className="container-main">
                 <div className="notice">
                    <Notice/>
                </div>

                <BoxTitle>New Phim</BoxTitle>

                <div className="film-list" id="film-list">
                    <FilmList/>
                </div>

                <FilmBanner/>
                <br /><hr />
                <BoxTitle>Đề Cử</BoxTitle>

                <div className="anime-list" id="anime-list">
                    {listPhimResult.map((result) => (
                        <AnimeList key={result.phimId} data={result}/>
                    ))}
                </div>

                <SeeMore>Xem Thêm...</SeeMore>

                <FilmRanking>Hot Tuần</FilmRanking>
            </div>
    );
}