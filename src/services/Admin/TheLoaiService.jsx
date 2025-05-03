// services/Admin/TheLoaiService.jsx
import * as request from "../../untils/Request.jsx";
import axios from "axios";
const API_URL = 'http://localhost:5039/api/Admin/QuanTriVienTheLoai';

const handleError = (error) => {
    console.error('API Error:', error);
    throw error;
};

export const fetchTheLoais = async (page, limit) => {
    try {
        const response = await request.get('/Admin/QuanTriVienTheLoai', {
            params: { page, limit }
        });

        return response;

    } catch (error) {
        console.error("Lỗi tải thể loại:", error);
        return {
            status: false,
            data: [],
            pagination: null,
            msg: error.message || 'Lỗi khi tải danh sách thể loại'
        };
    }
};

export const searchTheLoais = async (keyword, page, limit) => {
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
            msg: 'Tìm kiếm thể loại thành công'
        };

    } catch (error) {
        console.error("Lỗi tìm kiếm thể loại:", error);
        return {
            status: false,
            data: [],
            totalItems: 0,
            msg: error.message || 'Lỗi khi tìm kiếm thể loại'
        };
    }
};

export const createTheLoai = async (theLoaiData) => {
    try {
        const response = await axios.post(API_URL, theLoaiData);
        return {
            status: true,
            data: response.data,
            msg: 'Thêm thể loại thành công'
        };
    } catch (error) {
        console.error("Lỗi thêm thể loại:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi thêm thể loại'
        };
    }
};

export const updateTheLoai = async (id, theLoaiData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, theLoaiData);
        return {
            status: true,
            data: response.data,
            msg: 'Cập nhật thể loại thành công'
        };
    } catch (error) {
        console.error("Lỗi cập nhật thể loại:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi cập nhật thể loại'
        };
    }
};

export const deleteTheLoai = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return {
            status: true,
            msg: 'Xóa thể loại thành công'
        };
    } catch (error) {
        console.error("Lỗi xóa thể loại:", error);
        return {
            status: false,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi xóa thể loại'
        };
    }
};