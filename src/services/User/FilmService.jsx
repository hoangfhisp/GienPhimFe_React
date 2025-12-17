import * as request from "../../untils/Request.jsx";
import apiHelper from "../../untils/ApiHelper.jsx";

export const listphim = async (page, limit) => {
    try {
        const res = await request.get('/phim/GetAllPhims', {
            params: {
                page,
                limit
            }
        });
        return res;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const tapPhims = async (phimId) => {
    try {
        const res = await request.get('/TapPhim/GetByPhimId', {
            params: {
                phimId
            }
        });
        return res;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}


export const listTopLuotXemPhim = async (page,limit) =>{
    try {
        const res = await request.get('/phim/GetTopViewPhims',{
            params:{
                page,
                limit
            }
        });
        return res;
        
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const phim = async (id) =>{
    try {
        const res = await request.get(`/Phim/GetById/${id}`);
        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
    
}

export const newPhims = async (page,limit) => {
    try {
        const res = await request.get('/phim/GetNewPhims',{
            params:{
                page,
                limit
            }
        });
        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}



export const addLuotXem = async(phimId,userId) => {
    try {
        const res = await request.post('/FilmView/Create',{
            phimId,
            userId
        });
        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

// LICH SU XEM
// Gọi api lấy lịch sử xem của user đó
export const LichSuXemUser = async (userId,page,limit) => {
    try {
        const res = await apiHelper.get('/LichSuXem/GetLichSuXemByUserId',{
            params:{
                userId,
                page,
                limit
            }
        },true);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

// Gọi api xử lý Lưu lịch sử người dùng xem
export const XuLyLichSuXem = async (xulyLichSuXemData) => {
    try {
        const res = await apiHelper.post('/LichSuXem/XuLyLichSuXem',
           xulyLichSuXemData
        ,{},true);

        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

//PHẢN HỒI NGƯỜI DÙNG
// Gọi Api xử lý like dislike
export const XuLyLuotLikeDislike = async(phimId,nguoiDungId,luotThichP,luotDislikeP) => {
    try {
        const res = await request.post('/PhanHoiNguoiDung/XuLyLikeDislike',{
            phimId,
            nguoiDungId,
            luotThichP,
            luotDislikeP
        });
        
        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error)
    }
}

// Gọi api để check người dùng đã like, dislike chưa
export const CheckLikeDislikeUser = async (phimId,nguoiDungId) => {
    try {
        const res = await request.get('/PhanHoiNguoiDung/CheckLikeDislikeUser',{
            params: {
                phimId,
                nguoiDungId
            }
        });

        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

//THỂ LOẠI
// Lấy hết thể loại
export const GetAllTheLoai = async (page,limit) => {
    try {
        const res = await request.get('/TheLoai/GetAllTheLoais',{
            params: {
                page,
                limit
            }
        });
        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

//QUỐC GIA
// Lấy hết quốc gia
export const GetAllQuocGia = async (page,limit) => {
    try {
        const res = await request.get('/QuocGia/GetAllQuocGias',{
            params: {
                page,
                limit
            }
        })
        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

