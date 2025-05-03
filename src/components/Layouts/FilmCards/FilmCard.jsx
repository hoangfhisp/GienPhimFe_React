import './FilmCard.scss'

export default function FilmCard(){
    return(
        <div className="phim-card-box">
                <h4 className="phim-card-Title">Hahahah</h4>
                <p className="phim-card-Info">
                    <span>⭐ 9.6</span>
                    <span>📺 120</span>
                    <span>📅 5/12</span>
                    <span>🎬 2025</span>
                </p>
                <div className='phim-card-description'>
                    <p>Nhân vật đang được cập nhật Nhân vật đang được cập nhật Nhân vật đang được cập nhật Nhân vật đang được cập nhật</p>
                    <p>Studio:
                       <span>Haicudi</span> 
                    </p>
                    <p>Thể Loại:
                        <span>Tâm Lý</span>
                    </p>
                    <p>Diễn viên:
                        <span>Huy Hàng</span>
                    </p>
                </div>
        </div>
    );
}