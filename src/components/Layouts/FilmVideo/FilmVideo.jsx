import { useEffect, useMemo, useState } from 'react';

import './FilmVideo.scss'

import FilmPanel from './FilmPanel';
import * as phimServices from '../../../services/User/FilmService.jsx'
import FilmTap from './FilmTap.jsx';
import { set } from 'lodash';

function FilmVideo({id,tap}){
    const[isPlaying,setIsPlaying] = useState(false); // hàm để bật tắt xem phim để bật iframe
    const[dataTapPhim,setDataTapPhim] = useState([]); // hàm gắn lấy dữ liệu của 1 list phim
    const[tapPhim,setTapPhim] = useState([]); // hàm gán 1 link của tập phim cụ thể

    // Hàm lấy api id phim. rồi lấy list tập phim
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

    // Lọc danh sách tập có slugtap = tap (params)
    const tapchon = useMemo(() => {
        return dataTapPhim.find(item => item.slugTap === tap);
    },[dataTapPhim,tap])

    // Hàm lấy tập phim để gắn vào iframe
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

    // Hàm để chạy api update lại số lượt xem khi người dùng xem
    const Views = async (idphim,nguoiDungId) => {
        await phimServices.addLuotXem(idphim,nguoiDungId);
        setIsPlaying(true); 
    }

    

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


                    <button className="play-btn" onClick={() => Views(id,"4b6d0384-5e73-411a-9c9a-5765aef56e9e")}> {/* Khi người dùng ấn gọi hàm tăng view */}
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