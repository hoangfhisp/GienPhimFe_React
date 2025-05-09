import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function FilmBanner({data}){
    const [dataPhim,setDataPhim] = useState([]);
    const [rating,setRating] = useState("0");
    useEffect(() => {
        if (data?.theLoai) {
            setDataPhim(data.theLoai);
        }

        const rate = ((data.luotThichP / (data.luotThichP + data.luotDislikeP))*10).toFixed(1);
        if(isNaN(rate)){
            setRating("0")
        }else{
            setRating(rate);
        }
    }, [data]);

    

    return(
        
        <div className="banner" 
            style={{
                background: `url(${data.avatarP}) center/cover no-repeat`,
        }}>
            <div className="overlay-banner"></div>
            <div className="content-banner">
                <div className="title-banner">{data.tenP}</div>
                <h7 style={{color: "yellow"}}>Phim Xem Nhiều Nhất</h7>
                <hr />
                <div className="info-banner">
                        <span className="tag-banner">⭐ {rating}</span>
                    <span>⏳ {data.thoiLuongP}</span>
                    <span>📅 {data.ngayPhatHanhP}</span>
                </div>
                <p>{data.moTaP}</p>
                <div className="studio-banner">🏢 Studio: {data.tenCTSXP}</div>
                <div className="genres-banner">
                📌 Thể loại:
                {dataPhim.map((result) => (
                    <span>{result.tenTL}</span>
                ))}
                </div>
                <Link to={`/Phim/${data.phimId}`} className="watch-btn">▶ Xem Phim</Link>
            </div>
        </div>
    );
}