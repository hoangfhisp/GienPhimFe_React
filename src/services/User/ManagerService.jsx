import * as request from "../../untils/Request.jsx";
import apiHelper from "../../untils/ApiHelper.jsx";

export const getListGoiThanhVien = async (page,limit) => {
    try {
        const res = await request.get('/MembershipPlan/GetAllMembershipPlans',{
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

export const getAllLuaChonGoiTV = async () => {
    try {
        const res = await request.get('/LuaChonGoiTV/GetAllLuaChonGoiTV');
        return res;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const GetLuaChonGTVByGoiTVIdAndNgayAsync = async (planId, day,page,limit) => {
    try {
        const res = await request.get('/PlanOption/GetPlanOptionsByPlanIdAnDay', {
            params: {
                planId,
                day,
                page,
                limit
            }
        });
        return res;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const XuLyChiTietMuaGoiTVUser = async (optionId, userId) => {
    try {
        const res = await apiHelper.post('/UserMembership/Create', {
            optionId,
            userId
        },{}, true);

        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}


export const CheckXuLyGoiHetHanUser = async (userId) => {
    try {
        const res = await request.get('/ChiTietGoiThanhVien/CheckXuLyGoiTVHetHan', {
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
        const res = await apiHelper.get('/UserMembership/CurrentMembership', {
            params: {
                userId
            }
        },true);

        return res.data;
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


