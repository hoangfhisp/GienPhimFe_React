// services/Admin/QuocGiaService.jsx
import * as request from "../../untils/Request.jsx";
import axios from "axios";

const API_URL = 'http://localhost:5039/api/Admin/QuocGia';

const handleError = (error) => {
    console.error('API Error:', error);
    throw error;
};

// Lấy danh sách quốc gia với phân trang
export const fetchQuocGias = async (page, limit) => {
    try {
        const response = await request.get('/Admin/QuocGia', {
            params: { page, limit }
        });

        console.log('API Response QuocGia:', response);

        const responseData = response.data?.data || response.data || response;

        return response;

    } catch (error) {
        console.error("Lỗi tải quốc gia:", error);
        return {
            status: false,
            data: [],
            pagination: null,
            msg: error.message || 'Lỗi khi tải danh sách quốc gia'
        };
    }
};

// Tìm kiếm quốc gia theo từ khóa
export const searchQuocGias = async (keyword, page, limit) => {
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
            msg: 'Tìm kiếm quốc gia thành công'
        };

    } catch (error) {
        console.error("Lỗi tìm kiếm quốc gia:", error);
        return {
            status: false,
            data: [],
            totalItems: 0,
            msg: error.message || 'Lỗi khi tìm kiếm quốc gia'
        };
    }
};

// Thêm quốc gia mới
export const createQuocGia = async (quocGiaData) => {
    try {
        const response = await axios.post(API_URL, quocGiaData);
        return {
            status: true,
            data: response.data,
            msg: 'Thêm quốc gia thành công'
        };
    } catch (error) {
        console.error("Lỗi thêm quốc gia:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi thêm quốc gia'
        };
    }
};

// Cập nhật thông tin quốc gia
export const updateQuocGia = async (id, quocGiaData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, quocGiaData);
        return {
            status: true,
            data: response.data,
            msg: 'Cập nhật quốc gia thành công'
        };
    } catch (error) {
        console.error("Lỗi cập nhật quốc gia:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi cập nhật quốc gia'
        };
    }
};

// Xóa quốc gia
export const deleteQuocGia = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return {
            status: true,
            msg: 'Xóa quốc gia thành công'
        };
    } catch (error) {
        console.error("Lỗi xóa quốc gia:", error);
        return {
            status: false,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi xóa quốc gia'
        };
    }
};
