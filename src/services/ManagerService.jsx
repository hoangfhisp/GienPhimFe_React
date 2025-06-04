import * as request from "../untils/Request.jsx";

export const getListGoiThanhVien = async () => {
    try {
        const res = await request.get('/GoiThanhVien/GetAllGoiThanhVien');
        return res;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const getAllLuaChonGoiTV = async () => {
    try {
        const res = await request.get('/LuaChonGoiTV/GetAllLuaChonGoiTV');
        return res;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const GetLuaChonGTVByGoiTVIdAndNgayAsync = async (goiTVId,ngay) => {
    try {
        const res = await request.get('/LuaChonGoiTV/GetLuaChonGoiTVByIdAndNgay',{
            params: {
                goiTVId,
                ngay
            }
        });
        return res;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const XuLyChiTietMuaGoiTVUser = async (luaChonGoiTVId,userId) => {
    try {
        const res = await request.post('/ChiTietGoiThanhVien/XuLyChiTietMuaGoiTVUser',{
            luaChonGoiTVId,
            userId
        });
        
        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}


export const CheckXuLyGoiHetHanUser = async (userId) => {
    try {
        const res = await request.get('/ChiTietGoiThanhVien/CheckXuLyGoiTVHetHan',{
            params: {
                userId
            }
        });

        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const GetChiTietGoiTVByUser = async (userId) => {
    try {
        const res = await request.get('/ChiTietGoiThanhVien/GetChiTietGoiTVByUser',{
            params: {
                userId
            }
        });

        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
} 

//Comment
//Add Comment Cha
export const AddComment = async (userId,phimId,binhLuan) => {
    try {
        const res = await request.post('/Comment/AddComment',{
            userId,
            phimId,
            binhLuan
        });

        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

//Add Comment con
export const AddReplyComment = async (phimId,userId,parentCommentId,binhLuan) => {
    try {
        const res = await request.post('/Comment/AddReplyComment',{
            phimId,
            userId,
            parentCommentId,
            binhLuan
        });

        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

// Get Comment phim
export const GetCommentByPhim = async (phimId,page,limit) => {
    try {
        const res = await request.get('/Comment/GetCommentByPhim',{
            params:{
                phimId,
                page,
                limit
            }
        });

        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

//Update Comment
export const UpdateComment = async (commentId,userId,phimId,binhLuan) => {
    try {
        const res = await request.post('/Comment/UpdateComment',{
            commentId,
            userId,
            phimId,
            binhLuan
        });

        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

//Delete Comment
export const DeleteComment = async (commentId) => {
    try {
        const res = await request.deleteRequest('/Comment/DeleteComment',{
            params:{
                commentId
            }
        });

        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}


