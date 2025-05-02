// services/movieService.js
import * as request from "../../untils/Request.jsx";
import axios from "axios";
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

export const searchMovies = (tenp) => {
    return axios.get(`http://localhost:5039/api/Admin/Search?tenp=${tenp}`);
};

export const filterMovies = ({ theLoai, quocGia, ngonNgu }) => {
    const query = `?theLoai=${theLoai}&quocGia=${quocGia}&ngonNgu=${ngonNgu}`;
    return axios.get(`${API_URL}${query}`);
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
