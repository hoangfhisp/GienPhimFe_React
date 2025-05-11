import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function FilmPanel({data,onSelect}){

    const {id,tap} = useParams();
    const[dataTap,setDataTap] = useState([])
    const[tapTiep,setTapTiep] = useState("");

    useEffect(() => {
        if(!data){
            return;
        }
        setDataTap(data);
    },[data])

    useEffect(() => {
        
        const parts = tap.split('-');
        const number = parseInt(parts[1],10);

        if(isNaN(number)){
            return;
        }
        
        const nextNumber = number + 1;
        const nextSlug = `tap-${String(nextNumber).padStart(2,'0')}`;

        if(nextNumber <= dataTap.length ){

            setTapTiep(nextSlug);
        }

    },[tap,data])


    console.log(tapTiep)
    return(
        <div className="control-panel">
    
            <Link to={`/XemPhim/${id}/${tapTiep}`} onClick={onSelect}>
                <button type="button">▶ Tập tiếp</button>
            </Link>
        
            <a >
                <button type="button">💡 Thích phim</button>
            </a>
            <a >
                <button type="button" >⭐ Không thích</button>
            </a>
        
            <Link to={`/Phim/${id}`}>
                <button >📺 Chi tiết phim</button>
            </Link>
            <Link to={'/LienHe'}>
                <button>⚠ Báo lỗi</button>
            </Link>
            <Link to={'/LichSuXem'} >
                <button type="button">⬇ Tải về</button>
            </Link>
            <Link to={'/History'} >
                <button>🕒 Lịch sử xem</button>
            </Link>

        </div>
    );
};

export default FilmPanel;