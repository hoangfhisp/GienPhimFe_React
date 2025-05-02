import * as request from "../../untils/Request.jsx";
import axios from "axios";

const API_URL = 'http://localhost:5039/api/Admin/DaoDien';

const handleError = (error) => {
    console.error('API Error:', error);
    throw error;
};

export const fetchDaoDiens = async (page, limit) => {
    try {
        const response = await request.get('/Admin/DaoDien', {
            params: { page, limit }
        });

        console.log('API Response DaoDien:', response);

        const responseData = response.data?.data || response.data || response;

        return response;

    } catch (error) {
        console.error("Lỗi tải đạo diễn:", error);
        return {
            status: false,
            data: [],
            pagination: null,
            msg: error.message || 'Lỗi khi tải danh sách đạo diễn'
        };
    }
};

export const searchDaoDiens = async (keyword, page, limit) => {
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
            msg: 'Tìm kiếm đạo diễn thành công'
        };

    } catch (error) {
        console.error("Lỗi tìm kiếm đạo diễn:", error);
        return {
            status: false,
            data: [],
            totalItems: 0,
            msg: error.message || 'Lỗi khi tìm kiếm đạo diễn'
        };
    }
};

export const createDaoDien = async (daoDienData) => {
    try {
        const response = await axios.post(API_URL, daoDienData);
        return {
            status: true,
            data: response.data,
            msg: 'Thêm đạo diễn thành công'
        };
    } catch (error) {
        console.error("Lỗi thêm đạo diễn:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi thêm đạo diễn'
        };
    }
};

export const updateDaoDien = async (id, daoDienData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, daoDienData);
        return {
            status: true,
            data: response.data,
            msg: 'Cập nhật đạo diễn thành công'
        };
    } catch (error) {
        console.error("Lỗi cập nhật đạo diễn:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi cập nhật đạo diễn'
        };
    }
};

export const deleteDaoDien = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return {
            status: true,
            msg: 'Xóa đạo diễn thành công'
        };
    } catch (error) {
        console.error("Lỗi xóa đạo diễn:", error);
        return {
            status: false,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi xóa đạo diễn'
        };
    }
};
