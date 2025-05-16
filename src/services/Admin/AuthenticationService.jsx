import * as request from "../../untils/Request.jsx";

// Đảm bảo handle lỗi đúng cách
const handleError = (error) => {
    console.error('API Error:', error);
    throw error; // Hoặc trả về thông báo lỗi thân thiện
};

// API Đăng ký
export const register = async (userData) => {
    try {
        const response = await request.post('/User/register', userData);
        return response;  // Trả về kết quả đăng ký (thường có token nếu thành công)
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

// API Đăng nhập
export const login = async (credentials) => {
    try {
        const response = await request.post('/User/login', credentials);
        return response;  // Trả về thông tin đăng nhập (thường có token nếu thành công)
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

// API Đăng xuất
export const logout = async () => {
    try {
        localStorage.removeItem('token');
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

// API Forgot Password
export const forgotPassword = async (email) => {
    try {
        const response = await request.post('/User/forgot-password', { email });
        return response;  // Trả về kết quả gửi email thành công
    } catch (error) {
        handleError(error);
    }
}

// API Reset Password
export const resetPassword = async (token, email, newPassword) => {
    try {
        const response = await request.post('/User/reset-password', { token, email, newPassword });
        return response;  // Trả về kết quả reset mật khẩu thành công
    } catch (error) {
        handleError(error);
    }
}

// API Change Password
export const changePassword = async (userId, currentPassword, newPassword) => {
    try {
        const response = await request.post('/User/change-password', { userId, currentPassword, newPassword });
        return response;  // Trả về kết quả đổi mật khẩu thành công
    } catch (error) {
        handleError(error);
    }
}