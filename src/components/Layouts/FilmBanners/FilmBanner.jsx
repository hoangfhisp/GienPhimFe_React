import { useEffect, useState } from "react";


export default function FilmBanner({data}){
    const [dataPhim,setDataPhim] = useState([]);
    useEffect(() => {
        if (data?.theLoai) {
            setDataPhim(data.theLoai);
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
                        <span className="tag-banner">⭐ {(data.luotThichP / (data.luotThichP + data.luotThichP))*100}</span>
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
                <a  className="watch-btn">▶ Xem Phim</a>
            </div>
        </div>
    );
}