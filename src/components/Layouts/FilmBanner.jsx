

export default function FilmBanner(){
    return(
        <div className="banner" 
            style={{
                background: `url(https://phimimg.com/upload/vod/20241007-1/38d6ba96dca95fe9699f27fb42163ed9.jpg) center/cover no-repeat`,
        }}>
            <div className="overlay"></div>
            <div className="content">
                <div className="title">Blue Box</div>
                <h7 style={{color: "yellow"}}>Phim Xem Nhiều Nhất</h7>
                <hr />
                <div className="info">
                        <span className="tag">⭐ 10</span>
                    <span>⏳ 24 tập</span>
                    <span>📅 2024</span>
                </div>
                <p>Tay vợt cầu lông Taiki luôn ngưỡng mộ ngôi sao bóng rổ Chinatsu từ xa. Nhưng vào một ngày mùa xuân nọ, một bước ngoặt bất ngờ đưa họ đến gần nhau.</p>
                <div className="studio">🏢 Studio: Hoang</div>
                <div className="genres">
                📌 Thể loại:
                    <span>Thể loại</span>
                    <span>Thể loại</span>
                </div>
                <a  className="watch-btn">▶ Xem Phim</a>
            </div>
        </div>
    );
}