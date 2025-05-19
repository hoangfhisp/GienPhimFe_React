import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import * as phimServices from '../../../services/User/FilmService.jsx'

function FilmPanel({data,onSelect,nguoiDungId}){

    const {id,tap} = useParams();
    const[dataTap,setDataTap] = useState([])
    const[tapTiep,setTapTiep] = useState(""); // Lưu state của slugtap để chuyển tập
    const[checkLikeDislike,setCheckLikeDislike] = useState([]); // Gán giá trị khi check được lượt like của người dùng với bộ phim


    // Hàm handel gọi api xử lý nếu người dùng ấn thích, không thích
    const xuLyLikeDislike = async (id,nguoiDungId,isLike,isDislike) => {
        await phimServices.XuLyLuotLikeDislike(id,nguoiDungId,isLike,isDislike);
        fetchApi();
    }

    // Hàm handel gọi api để check xem người dùng đã like hay dislike
    const fetchApi = async () => {
        const result = await phimServices.CheckLikeDislikeUser(id,nguoiDungId);
        setCheckLikeDislike(result.data);
    }

    // Lấy dữ liệu list tập của phim đó
    useEffect(() => {
        if(!data){
            return;
        }
        setDataTap(data);
    },[data])

    // Hàm đổi slug thành int để tăng tập. Rồi chuyển lại thành string để đưa lên url
    useEffect(() => {
        const parts = tap.split('-'); // Tách thành 2 mãng trc và sau -
        const number = parseInt(parts[1],10); // Lấy mảng thứ 1 

        if(isNaN(number)){
            return;
        }
        
        const nextNumber = number + 1; 
        const nextSlug = `tap-${String(nextNumber).padStart(2,'0')}`; 

        if(nextNumber <= dataTap.length ){

            setTapTiep(nextSlug);
        }

    },[tap,data])

    //Hàm gọi api để check xem user có like hay dislike
    useEffect(()=> {
        if(id == null)
            return null;
        fetchApi();

    },[id,nguoiDungId])

    // check nút thích active
    const daThich = Array.isArray(checkLikeDislike) && checkLikeDislike[0]?.luotThichP;
    const khongThich = Array.isArray(checkLikeDislike) && checkLikeDislike[0]?.luotDislikeP;
    
    return(
        <div className="control-panel">
    
            <Link to={`/XemPhim/${id}/${tapTiep}`} onClick={onSelect}>
                <button type="button">▶ Tập tiếp</button>
            </Link>
        
            <Link >
                <button type="button" style={{background: `${daThich ? 'red' : '#222' }`}} onClick={() => {daThich ? xuLyLikeDislike(id,nguoiDungId,false,false) : xuLyLikeDislike(id,nguoiDungId,true,false)}}>💡 Thích phim</button>
            </Link>

            <Link >
                <button type="button" style={{background: `${khongThich ? 'red' : '#222' }`}} onClick={() => {khongThich ? xuLyLikeDislike(id,nguoiDungId,false,false) : xuLyLikeDislike(id,nguoiDungId,false,true)}} >⭐ Không thích</button>
            </Link>
        
            <Link to={`/Phim/${id}`}>
                <button >📺 Chi tiết phim</button>
            </Link>

            <Link to={'/LienHe'}>
                <button>⚠ Báo lỗi</button>
            </Link>

            <Link to={'#'} >
                <button type="button">⬇ Tải về</button>
            </Link>

            <Link to={'/History'} >
                <button>🕒 Lịch sử xem</button>
            </Link>

        </div>
    );
};

export default FilmPanel;