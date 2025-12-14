import { useEffect, useState } from 'react';
import './FilmCard.scss'
import { formatYear } from '../../../untils/Format';

export default function FilmCard({data}){
    const [dataTheLoai,setDataTheLoai] = useState([]);
    const [dataDienVien,setDataDienVien] = useState([]);
    const [rating,setRating] = useState([]);
    

    useEffect(() => {
        if(data?.theLoais){
            setDataTheLoai(data.theLoais);
        }
        if(data?.dienViens){
            setDataDienVien(data.dienViens);
        }
        const rate = (data.luotThichP + data.luotDislikeP) === 0
        ? 0
        : ((data.luotThichP / (data.luotThichP + data.luotDislikeP)) * 10).toFixed(1);

      setRating(isNaN(rate) ? "0" : rate);
    },[dataTheLoai,dataDienVien])
    

    return(
        <div className="phim-card-box">
                <h4 className="phim-card-Title">{data.tenP}</h4>
                <p className="phim-card-Info">
                    <span>⭐ {rating}</span>
                    <span>📺 {data.soTapP} Tập</span>
                    <span>⌛ {data.thuoiLuongP}</span>
                    <span>📅 {formatYear(data.ngayPhatHanhP)}</span>
                </p>
                <div className='phim-card-description'>
                    <h5>🎬 {data.moTaP}</h5>
                    <p>Studio:
                       <span>{data.tenCTSXP}</span> 
                    </p>
                    <p>Thể Loại:
                        {dataTheLoai.map((result) => (
                            <span>{result}</span>
                        ))}
                    </p>
                    <p>Diễn viên:
                    {dataDienVien.map((result) => (
                            <span>{result}</span>
                        ))}
                    </p>
                </div>
        </div>
    );
}