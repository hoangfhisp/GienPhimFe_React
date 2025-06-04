import * as request from "../../untils/Request.jsx";

export const listphim = async (page, limit) => {
    try {
        const res = await request.get('/phim', {
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

export const listTopLuotXemPhim = async (topphim,page,limit) =>{
    try {
        const res = await request.get('/phim/TopPhim/LuotXem',{
            params:{
                topphim, // Lấy top 5,... phim thì điền 5,...
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
        const res = await request.get(`/phim/${id}`);
        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
    
}

export const newPhims = async (topphim,page,limit) => {
    try {
        const res = await request.get('/phim/TopPhim/NewPhim',{
            params:{
                topphim,
                page,
                limit
            }
        });
        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}



export const addLuotXem = async(phimId,nguoiDungId) => {
    try {
        const res = await request.post('/LuotXem/AddLuotXem',{
            phimId,
            nguoiDungId
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
        const res = await request.get('/LichSuXem/LichSuXem',{
            params:{
                userId,
                page,
                limit
            }
        });
        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

// Gọi api xử lý Lưu lịch sử người dùng xem
export const XuLyLichXuXem = async (phimId,userId,tapPhim) => {
    try {
        const res = await request.post('/LichSuXem/XuLyLichSuXem',{
            phimId,
            userId,
            tapPhim
        });

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
export const GetAllTheLoai = async () => {
    try {
        const res = await request.get('/TheLoai');
        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

//QUỐC GIA
// Lấy hết quốc gia
export const GetAllQuocGia = async (page,limit) => {
    try {
        const res = await request.get('/QuocGiaPhim/AllQuocGia',{
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

