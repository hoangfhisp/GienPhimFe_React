import * as request from "../../untils/Request.jsx";
import axios from "axios";

const API_URL = 'http://localhost:5039/api/Admin/TheTag';  // Địa chỉ API cho TheTag

const handleError = (error) => {
    console.error('API Error:', error);
    throw error;
};

// Lấy danh sách tất cả các thẻ tag
export const fetchTheTags = async (page, limit) => {
    try {
        const response = await request.get('/Admin/TheTag', {
            params: { page, limit }
        });

        console.log('API Response TheTag:', response);

        const responseData = response.data?.data || response.data || response;

        return response;

    } catch (error) {
        console.error("Lỗi tải thẻ tag:", error);
        return {
            status: false,
            data: [],
            pagination: null,
            msg: error.message || 'Lỗi khi tải danh sách thẻ tag'
        };
    }
};

// Tìm kiếm thẻ tag theo từ khóa
export const searchTheTags = async (keyword, page, limit) => {
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
            msg: 'Tìm kiếm thẻ tag thành công'
        };

    } catch (error) {
        console.error("Lỗi tìm kiếm thẻ tag:", error);
        return {
            status: false,
            data: [],
            totalItems: 0,
            msg: error.message || 'Lỗi khi tìm kiếm thẻ tag'
        };
    }
};

// Tạo thẻ tag mới
export const createTheTag = async (theTagData) => {
    try {
        const response = await axios.post(API_URL, theTagData);
        return {
            status: true,
            data: response.data,
            msg: 'Thêm thẻ tag thành công'
        };
    } catch (error) {
        console.error("Lỗi thêm thẻ tag:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi thêm thẻ tag'
        };
    }
};

// Cập nhật thẻ tag theo ID
export const updateTheTag = async (id, theTagData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, theTagData);
        return {
            status: true,
            data: response.data,
            msg: 'Cập nhật thẻ tag thành công'
        };
    } catch (error) {
        console.error("Lỗi cập nhật thẻ tag:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi cập nhật thẻ tag'
        };
    }
};

// Xóa thẻ tag theo ID
export const deleteTheTag = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return {
            status: true,
            msg: 'Xóa thẻ tag thành công'
        };
    } catch (error) {
        console.error("Lỗi xóa thẻ tag:", error);
        return {
            status: false,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi xóa thẻ tag'
        };
    }
};
