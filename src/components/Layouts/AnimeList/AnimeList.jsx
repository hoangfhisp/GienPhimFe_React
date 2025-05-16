import {  useEffect, useState } from "react";
import TippyHeadless from '@tippyjs/react/headless';
import { Link, useLocation } from "react-router-dom";

import './AnimeList.scss'

import FilmCard from "../FilmCards/FilmCard.jsx";
import WrapperPopper from "../../Popper/Wrapper.jsx";
import * as phimServices from "../../../services/User/FilmService.jsx"
import * as searchServices from '../../../services/User/SearchSevice.jsx'

export default function AnimeList({userId,timtheo,page,limit,webpage,onPagination}){
    const [listPhimResult,setListPhimResult] = useState([]);
    

    useEffect(() => {
    const fetchApi = async () => {
        try {
            let result;
            if (userId && webpage == "History"){
                result = await phimServices.LichSuXemUser(userId, page, limit);
            }else if(webpage == "SearchPhim") {
                result = await searchServices.searchTheLoaiSlug(timtheo,page,limit)
            }
            else {
                result = await phimServices.listphim(page, limit);
            }

            if (result && result.data) {
                setListPhimResult(result.data);
                onPagination(result.pagination);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách phim:", error);
        }
    };

        fetchApi();
    }, [webpage,userId, page, limit,timtheo]);


    return(
        <>       
            <div className="anime-list" id="anime-list">
                {listPhimResult.map((result) => (
                    <TippyHeadless
                    key={result.phimId}
                    interactive
                    placement="right"
                    render={attrs => (
                        <WrapperPopper>
                            <div className="film-card-result" tabIndex={-1} {...attrs}>
                                <FilmCard data={result}/>
                            </div>
                        </WrapperPopper>
                    )}
                    >
                        <div className="anime-item">
                            <div className="episode-label">{result.soTapP} Tập</div>
                                <Link to={`/Phim/${result.phimId}`}>
                                    <img src={result.avatarPoster} alt={result.tenP}/>
                                    <p ><strong>{result.tenP}</strong></p>
                                    {webpage === "History" ? (
                                        <>
                                            <h6>Đã xem tập: {result.slugTapXem} </h6> 
                                            <h6>vào lúc {result.thoiGianXem}</h6> 
                                            <Link to = {`/XemPhim/${result.phimId}/${result.slugTapXem}`} className="history-xemtiep">Xem tiếp</Link> 
                                        </> 
                                        ) : (<h6>Lượt xem: {result.luotXemP}</h6> ) }
                                </Link>
                        </div>  
                </TippyHeadless> 
                ))}
            </div>  
        </>

    );
}