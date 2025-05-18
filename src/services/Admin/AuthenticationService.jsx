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

//API Vai trò
export const fetchRoles = async (page, limit) => {
    try {
        const response = await request.get(`/Admin/Role`, {
            params: { page, limit }
        });

        return response;

    } catch (error) {
        console.error("Lỗi tải vai trò:", error);
        return {
            status: false,
            data: [],
            pagination: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi tải danh sách vai trò'
        };
    }
};

// Tìm kiếm vai trò
export const searchRoles = async (tenvt, page = 1, limit = 10) => {
    try {
        const res = await request.get('Admin/Role/search', {
            params: { tenvt, page, limit }
        });
        return res;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

// Lấy thông tin vai trò theo ID
export const getRoleById = async (id) => {
    try {
        const response = await request.get(`Role/${id}`);
        return response;
    } catch (error) {
        console.error("Lỗi lấy thông tin vai trò:", error);
        return {
            status: false,
            data: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi lấy thông tin vai trò'
        };
    }
};

// Tạo vai trò mới
export const createRole = (roleData) => {
    const isFormData = roleData instanceof FormData;

    return request.post('/Admin/Role/Them', roleData, {
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    }).catch(handleError);
};

// Cập nhật vai trò
export const updateRole = (id, roleData) => {
    const isFormData = roleData instanceof FormData;

    return request.put(`/Admin/Role/CapNhat/${id}`, roleData, {
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    }).catch(handleError);
};

// Xóa vai trò
export const deleteRole = (id) => {
    return request.deleteRequest(`/Admin/Role/Xoa/${id}`).catch(handleError);
};

// Lấy metadata để biết các trường cần nhập cho vai trò
export async function getRoleFormFields() {
    const response = await request.get('/Admin/Role/metadata');
    return response.fields;
}
