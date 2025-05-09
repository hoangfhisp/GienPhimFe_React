import * as request from "../../untils/Request.jsx";
import axios from "axios";
import { filterMovies } from "../User/LocPhimService.jsx";

const API_URL = 'http://localhost:5039/api/Admin/Phim';

// Đảm bảo handle lỗi đúng cách
const handleError = (error) => {
    console.error('API Error:', error);
    throw error; // Hoặc trả về thông báo lỗi thân thiện
};

// Lấy metadata để biết các trường cần nhập
export async function getPhimFormFields() {
    const response = await fetch('http://localhost:5039/api/Admin/Phim/metadata');
    const json = await response.json();
    return json.fields;
}

// Lấy danh sách phim
export const fetchMovies = async (page, limit) => {
    try {
        const response = await request.get('/Admin/Phim', {
            params: { page, limit }
        });
        const responseData = response.data?.data || response.data || response;
        return response;
    } catch (error) {
        console.error("Lỗi tải phim:", error);
        return {
            status: false,
            data: [],
            pagination: null,
            msg: error.message || 'Lỗi khi tải danh sách phim'
        };
    }
};

// Tìm kiếm phim theo tên
export const searchMovies = async (tenp, page = 1, limit = 10) => {
    try {
        const response = await request.get('/Search', {
            params: { tenp, page, limit }
        });
        return response;
    } catch (error) {
        console.error("Lỗi khi tìm kiếm phim:", error);
        return {
            status: false,
            data: [],
            pagination: { page, limit, total: 0 },
            msg: error.message || 'Lỗi khi tìm kiếm phim'
        };
    }
};

// Lọc phim theo các bộ lọc
export const fetchFilteredMovies = async (filters) => {
    try {
        const response = await filterMovies(filters);
        return response;
    } catch (error) {
        console.error("Lỗi lọc phim:", error);
        return {
            status: false,
            data: [],
            pagination: null,
            msg: error.message || 'Lỗi khi lọc phim'
        };
    }
};

// API để nhập dữ liệu từ nguồn ngoài
export const addMovieFromAPI = (apiLink) => {
    return axios.post(`${API_URL}/inputapi`, { query: apiLink });
};

// Tạo mới phim (cần hỗ trợ FormData)
export const createMovie = (movieData) => {
    const isFormData = movieData instanceof FormData;

    return axios.post(API_URL, movieData, {
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    }).catch(handleError);
};

// Cập nhật phim (cần hỗ trợ FormData)
export const updateMovie = (id, movieData) => {
    const isFormData = movieData instanceof FormData;

    return axios.put(`${API_URL}/${id}`, movieData, {
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    }).catch(handleError);
};

// Xóa phim
export const deleteMovie = (id) => {
    return axios.delete(`${API_URL}/${id}`).catch(handleError);
};
