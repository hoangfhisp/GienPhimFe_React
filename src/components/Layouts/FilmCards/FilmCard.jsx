import { useEffect, useState } from 'react';
import './FilmCard.scss'

export default function FilmCard({data}){
    const [dataTheLoai,setDataTheLoai] = useState([]);
    const [dataDienVien,setDataDienVien] = useState([]);

    useEffect(() => {
        if(data?.theLoai){
            setDataTheLoai(data.theLoai);
        }
        if(data?.dienVien){
            setDataDienVien(data.dienVien);
        }
    },[dataTheLoai,dataDienVien])


    return(
        <div className="phim-card-box">
                <h4 className="phim-card-Title">{data.tenP}</h4>
                <p className="phim-card-Info">
                    <span>⭐ {(data.luotThichP / (data.luotThichP + data.luotThichP))*100}</span>
                    <span>📺 {data.soTapP} Tập</span>
                    <span>⌛ {data.thoiLuongP}</span>
                    <span>📅 2025</span>
                </p>
                <div className='phim-card-description'>
                    <h5>🎬 {data.moTaP}</h5>
                    <p>Studio:
                       <span>Haicudi</span> 
                    </p>
                    <p>Thể Loại:
                        {dataTheLoai.map((result) => (
                            <span>{result.tenTL}</span>
                        ))}
                    </p>
                    <p>Diễn viên:
                    {dataDienVien.map((result) => (
                            <span>{result.tenDV}</span>
                        ))}
                    </p>
                </div>
        </div>
    );
}