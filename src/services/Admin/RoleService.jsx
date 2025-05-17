import * as request from "../../untils/Request.jsx";
import axios from "axios";

const API_URL = 'http://localhost:5039/api/Role';

// Xử lý lỗi API chung
const handleError = (error) => {
    console.error('API Error:', error);
    throw error;
};

// Lấy danh sách vai trò
export const fetchRoles = async (page, limit) => {
    try {
        const response = await request.get(`${API_URL}`, {
            params: { page, limit }
        });

        return response;

    } catch (error) {
        console.error("Lỗi tải vai trò:", error);
        return {
            status: false,
            data: [],
            pagination: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi tải danh sách vai trò'
        };
    }
};

// Tìm kiếm vai trò
export const searchVaiTros = async (tenVT, page = 1, limit = 10) => {
    try {
        const res = await request.get('/Search/VaiTro', {
            params: { tenVT, page, limit }
        });
        return res;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

// Lấy thông tin vai trò theo ID
export const getRoleById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response;
    } catch (error) {
        console.error("Lỗi lấy thông tin vai trò:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi lấy thông tin vai trò'
        };
    }
};

// Tạo vai trò mới
export const createRole = async (roleData) => {
    try {
        const response = await axios.post(API_URL, roleData);
        return response;
    } catch (error) {
        console.error("Lỗi tạo vai trò:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi tạo vai trò'
        };
    }
};

// Cập nhật vai trò
export const updateRole = async (id, roleData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, roleData);
        return response;
    } catch (error) {
        console.error("Lỗi cập nhật vai trò:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi cập nhật vai trò'
        };
    }
};

// Xóa vai trò
export const deleteRole = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response;
    } catch (error) {
        console.error("Lỗi xóa vai trò:", error);
        return {
            status: false,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi xóa vai trò'
        };
    }
};


