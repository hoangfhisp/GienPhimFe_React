import * as request from "../../untils/Request.jsx";
import axios from "axios";
const API_URL = 'http://localhost:5039/api/Admin/DienVien';

const handleError = (error) => {
    console.error('API Error:', error);
    throw error;
};

export const fetchDienViens = async (page, limit) => {
    try {
        const response = await request.get('/Admin/DienVien', {
            params: { page, limit }
        });

        console.log('API Response DienVien:', response);

        const responseData = response.data?.data || response.data || response;

        return response;

    } catch (error) {
        console.error("Lỗi tải danh sách diễn viên:", error);
        return {
            status: false,
            data: [],
            pagination: null,
            msg: error.message || 'Lỗi khi tải danh sách diễn viên'
        };
    }
};

// Tìm kiếm diễn viên theo từ khóa
export const searchDienViens = async (keyword, page, limit) => {
    try {
        const response = await axios.get(`${API_URL}/search`, {
            params: {
                keyword,
                page,
                limit
            }
        });

        return {
            status: true,
            data: response.data?.data || [],
            totalItems: response.data?.pagination?.total || 0,
            msg: 'Tìm kiếm diễn viên thành công'
        };

    } catch (error) {
        console.error("Lỗi tìm kiếm diễn viên:", error);
        return {
            status: false,
            data: [],
            totalItems: 0,
            msg: error.message || 'Lỗi khi tìm kiếm diễn viên'
        };
    }
};

// Thêm một diễn viên mới
export const createDienVien = async (dienVienData) => {
    try {
        const response = await axios.post(API_URL, dienVienData);
        return {
            status: true,
            data: response.data,
            msg: 'Thêm diễn viên thành công'
        };
    } catch (error) {
        console.error("Lỗi thêm diễn viên:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi thêm diễn viên'
        };
    }
};

// Cập nhật thông tin diễn viên
export const updateDienVien = async (id, dienVienData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, dienVienData);
        return {
            status: true,
            data: response.data,
            msg: 'Cập nhật diễn viên thành công'
        };
    } catch (error) {
        console.error("Lỗi cập nhật diễn viên:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi cập nhật diễn viên'
        };
    }
};

// Xóa một diễn viên
export const deleteDienVien = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return {
            status: true,
            msg: 'Xóa diễn viên thành công'
        };
    } catch (error) {
        console.error("Lỗi xóa diễn viên:", error);
        return {
            status: false,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi xóa diễn viên'
        };
    }
};
