import apiHelper from "../../untils/ApiHelper.jsx";


export const chatMessageByGroup = async (groupId, page, limit) => {
    try {
        const res = await apiHelper.get('/ChatMessage/ByGroup/', {
            params: {
                groupId,
                page,
                limit
            }
        },true);
        return res.data;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const createChatGroup = async (phimId,phimName) => {
    try {
        const res = await apiHelper.post('/ChatGroup/Create', {
                phimId,
                phimName
        },{},true);
        return res.data;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const getGroupMembersByGroupId = async (groupId,page,limit) => {
    try {
        const res = await apiHelper.get(`/GroupMember/ByGroup/${groupId}`, {
            params: {
                page,
                limit
            }
        },true);
        return res.data;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const getChatGroupByGroupId = async (groupId) => {
    try {
        const res = await apiHelper.get(`/ChatGroup/Detail/${groupId}`, {
        },true);
        return res.data;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const CreateJoinRequest = async (groupId) => {
    try {
        const res = await apiHelper.post(`/JoinRequest/Create`, {
            groupId
        },{},true);
        return res.data;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const getJoinRequestByGroupId = async (groupId,status,page,limit) => {
    try {
        const res = await apiHelper.get(`/JoinRequest/ByGroup/${groupId}`, {
            params: {
                status,
                page,
                limit
            }
        },true);
        return res.data;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const AcceptJoinRequest = async (requestId) => {
    try {
        const res = await apiHelper.post(`/JoinRequest/Accept/${requestId}`, {},{},true);
        return res.data;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const RejectJoinRequest = async (requestId) => {
    try {
        const res = await apiHelper.post(`/JoinRequest/Reject/${requestId}`, {},{},true);
        return res.data;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const getChatGroupByFilm = async (phimId,status, page, pageSize) => {
    try {
        const res = await apiHelper.get(`/ChatGroup/ByFilm/${phimId}`, {
            params: {
                status,
                page,
                pageSize
            }
        },true);
        return res.data;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

