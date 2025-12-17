// src/services/User/UserService.jsx
import apiHelper from "../../untils/ApiHelper.jsx";
import axios from 'axios';

const API_URL = 'http://localhost:5039/api/User';


const handleError = (error) => {
    console.error('API Error:', error);
    throw error;
};
// Đăng nhập người dùng
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return {
            status: response.data?.status || true,
            data: response.data,
            msg: response.data?.msg || 'Đăng nhập thành công'
        };
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi đăng nhập'
        };
    }
};

// Đăng ký người dùng
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return {
            status: response.data?.status || true,
            data: response.data,
            msg: response.data?.msg || 'Đăng ký thành công'
        };
    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi đăng ký'
        };
    }
};

// Đổi mật khẩu người dùng
export const changePassword = async (userId, currentPassword, newPassword) => {
    try {
        const response = await axios.post(`${API_URL}/change-password`, {
            userId,
            currentPassword,
            newPassword
        });
        return {
            status: response.data?.status || true,
            data: response.data,
            msg: response.data?.msg || 'Đổi mật khẩu thành công'
        };
    } catch (error) {
        console.error("Lỗi đổi mật khẩu:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi đổi mật khẩu'
        };
    }
};


export const getWalletByUserId = async (userId) => {
    try {
        const res = await apiHelper.get('/Wallet/GetWalletByUserId',{
            params:{
                userId,
            }
        },true);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}