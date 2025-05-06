// services/movieService.jsx
import * as request from "../../untils/Request.jsx";
import axios from "axios";
import { filterMovies } from "../User/LocPhimService.jsx";
const API_URL = 'http://localhost:5039/api/Admin/Phim';

const handleError = (error) => {
    console.error('API Error:', error);
    throw error; // Hoặc trả về thông báo lỗi thân thiện
};

export const fetchMovies = async (page, limit) => {
    try {
        const response = await request.get('/Admin/Phim', {
            params: { page, limit }
        });

        console.log('API Response:', response);

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

export const addMovieFromAPI = (apiLink) => {
    return axios.post(`${API_URL}/inputapi`, { query: apiLink });
};

export const createMovie = (movieData) => {
    return axios.post(API_URL, movieData);
};

export const updateMovie = (id, movieData) => {
    return axios.put(`${API_URL}/${id}`, movieData);
};

export const deleteMovie = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};
