import { useEffect, useMemo, useState } from 'react';

import './FilmVideo.scss'

import FilmPanel from './FilmPanel';
import * as phimServices from '../../../services/User/FilmService.jsx'
import FilmTap from './FilmTap.jsx';

function FilmVideo({id,tap}){
    const[isPlaying,setIsPlaying] = useState(false);
    const[dataTapPhim,setDataTapPhim] = useState([]);
    const[tapPhim,setTapPhim] = useState([]);

    useEffect(() => {
        if(id == null){
            return;
        }
        const fetchApi = async () => {
            const dataTap = await phimServices.phim(id);
            const danhSachTap = dataTap.tapCuaPhim || [];
            setDataTapPhim(danhSachTap);
        }
        
        fetchApi();

    },[id])

    const tapchon = useMemo(() => {
        return dataTapPhim.find(item => item.slugTap === tap);
    },[dataTapPhim,tap])

    useEffect(() => {
        if(dataTapPhim === null){
            return;
        }

        const tapphim = () => {
            
            if(tapchon){
                setTapPhim(tapchon.linkPhu);
            }
        }

        tapphim();

    },[tapchon])

    return(
        <>
            <div className="video-container">
            
                <iframe src={tapPhim} style={{display: isPlaying ? "block" : "none", height : "100%", width: "100%"}} allowFullScreen = {1} loading='lazy'> </iframe>

                <div className="video-overlay" style={{display: isPlaying ? "none" : "block"}}>
                    <p className="warning">WEBSITE CÓ NHIỀU QUẢNG CÁO!</p>
                    <p className="subtext">KHÔNG CÓ QUẢNG CÁO THÌ DUY TRÌ WEBSITE LÀM SAO?!</p>
                    <p className="support-text">
                        NẾU BẠN DÙNG CHẶN QUẢNG CÁO <span>VUI LÒNG TẮT</span> ĐỂ ỦNG HỘ GIENPHIM NHÉ!
                        <br />
                        ĐÂY LÀ LINK PHIM FREE NÊN SẼ CÓ QUẢNG CÁO <span>CỜ BẠC</span> VUI LÒNG CÂN NHẮC TRƯỚC KHI XEM!
                    </p>


                    <button className="play-btn" onClick={() => setIsPlaying(true)}>
                        <div className="play-icon"></div>
                    </button>
                </div>
            </div>

            <FilmPanel data={dataTapPhim} idphim = {id} slugtap ={tap} onSelect={() => setIsPlaying(false)}/>

            <div className="tap-container">
                <FilmTap data={dataTapPhim} idphim = {id} slugtap ={tap} onSelect={() => setIsPlaying(false)}>📺 GIENPHIM Tập</FilmTap>
            </div>
            
        </>
    );
}

export default FilmVideo;