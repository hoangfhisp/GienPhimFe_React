import {  useEffect, useState } from "react";
import TippyHeadless from '@tippyjs/react/headless';

import BoxTitle from "../../components/Commons/BoxTitle";
import SeeMore from "../../components/Commons/SeeMore";
import AnimeList from "../../components/Layouts/AnimeList";
import FilmList from "../../components/Layouts/FilmList/FilmList.jsx";
import Notice from "../../components/Layouts/Notice";
import FilmRanking from "../../components/Layouts/FilmRanking";
import * as phimServices from "../../services/User/FilmService.jsx"
import FilmBannerList from "../../components/Layouts/FilmBanners/FilmBannerList.jsx";
import WrapperPopper from "../../components/Popper/Wrapper.jsx";
import FilmCard from "../../components/Layouts/FilmCards/FilmCard.jsx";

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

                <FilmList/>

                <FilmBannerList></FilmBannerList>

                <br /><hr />
                <BoxTitle>Đề Cử</BoxTitle>

                <div className="anime-list" id="anime-list">
                    {listPhimResult.map((result) => (
                        <TippyHeadless
                            key={result.phimId}
                            interactive
                            placement="right"
                            render={attrs => (
                                <WrapperPopper>
                                    <div className="film-card-result" tabIndex={-1} {...attrs}>
                                        <FilmCard/>
                                    </div>
                                </WrapperPopper>
                            )}
                        >
                            <div>
                            <AnimeList  data={result}/>
                            </div>
                        </TippyHeadless>
                        ))}
                </div>

                <SeeMore>Xem Thêm...</SeeMore>

                <FilmRanking>Hot Tuần</FilmRanking>
            </div>
    );
}