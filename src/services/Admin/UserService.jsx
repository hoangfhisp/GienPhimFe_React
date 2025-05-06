// services/Admin/UserService.jsx
import * as request from "../../untils/Request.jsx";
import axios from "axios";
const API_URL = 'http://localhost:5039/api/User';

const handleError = (error) => {
    console.error('API Error:', error);
    throw error;
};

export const fetchUsers = async (page, limit) => {
    try {
        const response = await request.get('/User', {
            params: { page, limit }
        });

        console.log('API Response Users:', response);

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

export const searchUsers = async (keyword, page, limit) => {
    try {
        const response = await axios.get(`${API_URL}/search`, {
            params: { keyword, page, limit }
        });

        return {
            status: response.data?.status || true,
            data: response.data?.data || [],
            pagination: response.data?.pagination || null,
            msg: response.data?.msg || 'Tìm kiếm người dùng thành công'
        };

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
        const response = await axios.get(`${API_URL}/${id}`);
        return {
            status: response.data?.status || true,
            data: response.data,
            msg: response.data?.msg || 'Lấy thông tin người dùng thành công'
        };
    } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi lấy thông tin người dùng'
        };
    }
};

export const createUser = async (userData) => {
    try {
        const response = await axios.post(API_URL, userData);
        return {
            status: response.data?.status || true,
            data: response.data,
            msg: response.data?.msg || 'Thêm người dùng thành công'
        };
    } catch (error) {
        console.error("Lỗi thêm người dùng:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi thêm người dùng'
        };
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, userData);
        return {
            status: response.data?.status || true,
            data: response.data,
            msg: response.data?.msg || 'Cập nhật người dùng thành công'
        };
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
        return {
            status: response.data?.status || true,
            msg: response.data?.msg || 'Xóa người dùng thành công'
        };
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
        return {
            status: response.data?.status || true,
            data: response.data,
            msg: response.data?.msg || 'Khóa tài khoản thành công'
        };
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
        return {
            status: response.data?.status || true,
            data: response.data,
            msg: response.data?.msg || 'Mở khóa tài khoản thành công'
        };
    } catch (error) {
        console.error("Lỗi mở khóa tài khoản:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi mở khóa tài khoản'
        };
    }
};

export const changePassword = async (userId, currentPassword, newPassword) => {
    try {
        const response = await axios.post(`${API_URL}/change-password`, {
            userId,
            currentPassword,
            newPassword
        });
        return {
            status: response.data?.status || true,
            data: response.data,
            msg: response.data?.msg || 'Đổi mật khẩu thành công'
        };
    } catch (error) {
        console.error("Lỗi đổi mật khẩu:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi đổi mật khẩu'
        };
    }
};