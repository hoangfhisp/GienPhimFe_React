// services/Admin/UserService.jsx
import * as request from "../../untils/Request.jsx";
import axios from "axios";
const API_URL = 'http://localhost:5039/api/User';


export const fetchUsers = async (page, limit) => {
    try {
        const response = await request.get('/User', {
            params: { page, limit }
        });

        return response;

    } catch (error) {
        console.error("Lỗi tải người dùng:", error);
        return {
            status: false,
            data: [],
            pagination: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi tải danh sách người dùng'
        };
    }
};

export const searchUsers = async (tennd, page, limit) => {
    try {
        const response = await request.get(`/User/search`, {
            params: { tennd, page, limit }
        });

        return response;

    } catch (error) {
        console.error("Lỗi tìm kiếm người dùng:", error);
        return {
            status: false,
            data: [],
            pagination: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi tìm kiếm người dùng'
        };
    }
};


export const searchNguoiDungs = async (tenND, page = 1, limit = 10) => {
    try {
        const res = await request.get('/Search/NguoiDung', {
            params: { tenND, page, limit }
        });
        return res;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const getUserById = async (id) => {
    try {
        const res = await request.get(`/User/${id}`);
        return res;
    } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, userData);
        return response;
    } catch (error) {
        console.error("Lỗi cập nhật người dùng:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi cập nhật người dùng'
        };
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response;
    } catch (error) {
        console.error("Lỗi xóa người dùng:", error);
        return {
            status: false,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi xóa người dùng'
        };
    }
};

export const lockUser = async (lockData) => {
    try {
        const response = await axios.post(`${API_URL}/lock`, lockData);
        return response;
    } catch (error) {
        console.error("Lỗi khóa tài khoản:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi khóa tài khoản'
        };
    }
};

export const unlockUser = async (userId) => {
    try {
        const response = await axios.post(`${API_URL}/unlock/${userId}`);
        return response;
    } catch (error) {
        console.error("Lỗi mở khóa tài khoản:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi mở khóa tài khoản'
        };
    }
};

