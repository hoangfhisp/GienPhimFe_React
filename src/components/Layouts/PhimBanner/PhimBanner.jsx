import { useEffect, useState } from 'react';

import './PhimBanner.scss'
import * as phimServices from '../../../services/User/FilmService.jsx'
import { Link } from 'react-router-dom';
import { formatYear } from '../../../untils/Format.jsx';

function PhimBanner({id}){
    const [rating,setRating] = useState("0");
    const [dataPhim,setDataPhim] = useState([]);
    const [dataTap,setDataTap] = useState([]);
    useEffect(() => {
        if(id == null){
            return;
        }

        const fetchApi = async () => {
            const resultPhim = await phimServices.phim(id);
            const resultTapPhim = await phimServices.tapPhims(id);
            setDataPhim(resultPhim.data);
            setDataTap(resultTapPhim.data);
        }
        fetchApi();
    },[id])

    useEffect(() => {
        if(!dataPhim){
            return;
        }

        const rate = ((dataPhim.luotThichP / (dataPhim.luotThichP + dataPhim.luotDislikeP))*10).toFixed(1);
        if(isNaN(rate)){
            setRating("0")
        }else{
            setRating(rate);
        }

    },[dataPhim])

    return(
        <>
            <div className="banner-phim" style={{
                background: `url(${dataPhim.avatarP}) center/cover no-repeat`,
            }}>
                <div className="background-overlay" ></div>
                <div className="container-phim">
                    <div className="phim-info-banner">
                        <div className="phim-poster">
                            <img src={dataPhim.avatarPoster} alt="kk"/>
                            <Link to={`/XemPhim/${dataPhim.phimId}/${dataTap[0]?.slugTap}`} className="phim-watch-btn">XEM PHIM</Link>
                        </div>
                        <div className="phim-details">
                            <h1>{dataPhim.tenP}</h1>
                            <p className="phim-subtitle">{dataPhim.tenP}</p>
                            <p className="phim-description">{dataPhim.moTaP}</p>
                            <div className="rating">
                                    <span className="rating-score">{rating}</span>
                                    <span className="stars">☆☆☆☆☆</span>
                                    <span className="reviews"> {`( ${dataPhim.luotThichP + dataPhim.luotDislikeP} )`} Đánh giá</span>
                            </div>
                            <div className="phim-stats">
                                <span>⏳ {dataPhim.thuoiLuongP}</span>
                                <span>📅 {formatYear(dataPhim.ngayPhatHanhP)}</span>
                                <span>👁️ {dataPhim.luotXemP} Lượt xem</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PhimBanner;