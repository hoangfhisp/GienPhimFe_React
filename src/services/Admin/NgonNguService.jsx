import * as request from "../../untils/Request.jsx";
import axios from "axios";

const API_URL = 'http://localhost:5039/api/Admin/NgonNgu';

// Xử lý lỗi
const handleError = (error) => {
    console.error('API Error:', error);
    throw error;
};

// Lấy danh sách ngôn ngữ với phân trang
export const fetchNgonNgus = async (page, limit) => {
    try {
        const response = await request.get('/Admin/NgonNgu', {
            params: { page, limit }
        });

        console.log('API Response NgonNgu:', response);

        const responseData = response.data?.data || response.data || response;

        return response;

    } catch (error) {
        console.error("Lỗi tải ngôn ngữ:", error);
        return {
            status: false,
            data: [],
            pagination: null,
            msg: error.message || 'Lỗi khi tải danh sách ngôn ngữ'
        };
    }
};

// Tìm kiếm ngôn ngữ
export const searchNgonNgus = async (keyword, page, limit) => {
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
            msg: 'Tìm kiếm ngôn ngữ thành công'
        };

    } catch (error) {
        console.error("Lỗi tìm kiếm ngôn ngữ:", error);
        return {
            status: false,
            data: [],
            totalItems: 0,
            msg: error.message || 'Lỗi khi tìm kiếm ngôn ngữ'
        };
    }
};

// Thêm ngôn ngữ mới
export const createNgonNgu = async (ngonNguData) => {
    try {
        const response = await axios.post(API_URL, ngonNguData);
        return {
            status: true,
            data: response.data,
            msg: 'Thêm ngôn ngữ thành công'
        };
    } catch (error) {
        console.error("Lỗi thêm ngôn ngữ:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi thêm ngôn ngữ'
        };
    }
};

// Cập nhật ngôn ngữ
export const updateNgonNgu = async (id, ngonNguData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, ngonNguData);
        return {
            status: true,
            data: response.data,
            msg: 'Cập nhật ngôn ngữ thành công'
        };
    } catch (error) {
        console.error("Lỗi cập nhật ngôn ngữ:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi cập nhật ngôn ngữ'
        };
    }
};

// Xóa ngôn ngữ
export const deleteNgonNgu = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return {
            status: true,
            msg: 'Xóa ngôn ngữ thành công'
        };
    } catch (error) {
        console.error("Lỗi xóa ngôn ngữ:", error);
        return {
            status: false,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi xóa ngôn ngữ'
        };
    }
};
