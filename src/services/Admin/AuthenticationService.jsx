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

// Lấy metadata để biết các trường cần nhập
export async function GetUserFormFields() {
    const response = await request.get('/Admin/QuanTriVienNguoiDung/metadata');
    return response.fields;
}

//Api người dùng
export const fetchUsers = async (page, limit) => {
    try {
        const response = await request.get('/Admin/QuanTriVienNguoiDung', {
            params: { page, limit }
        });

        return response;

    } catch (error) {
        console.error("Lỗi tải người dùng:", error);
        return {
            status: false,
            data: [],
            pagination: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi tải danh sách người dùng'
        };
    }
};

//Tìm kiếm người dùng
export const searchUsers = async (tennd, page, limit) => {
    try {
        const response = await request.get(`/User/search`, {
            params: { tennd, page, limit }
        });

        return response;

    } catch (error) {
        console.error("Lỗi tìm kiếm người dùng:", error);
        return {
            status: false,
            data: [],
            pagination: null,
            msg: error.response?.data?.msg || error.message || 'Lỗi khi tìm kiếm người dùng'
        };
    }
};

//Lấy id người dùng
export const getUserById = async (id) => {
    try {
        const res = await request.get(`/User/${id}`);
        return res;
    } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
    }
};

// Cập nhật người dùng
export const updateUser = (id, userData) => {
    const isFormData = userData instanceof FormData;

    return request.put(`/Admin/QuanTriVienNguoiDung/CapNhat/${id}`, userData, {
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    }).catch(handleError);
};

// Xóa người dùng
export const deleteUser = (id) => {
    return request.deleteRequest(`/Admin/QuanTriVienNguoiDung/Xoa/${id}`).catch(handleError);
};

//Khoá người dùng
export const lockUser = async (userLockDto) => {
    try {
        const response = await request.post('/Admin/QuanTriVienNguoiDung/lock', userLockDto);
        return response;
    } catch (error) {
        console.error("Lỗi khi khóa người dùng:", error);
        return {
            status: false,
            msg: error.response?.data?.message || error.message || 'Lỗi khi khóa người dùng'
        };
    }
};

//Mở khoá người dùng
export const unlockUser = async (userId) => {
    try {
        const response = await request.post(`/Admin/QuanTriVienNguoiDung/${userId}`);
        return response;
    } catch (error) {
        console.error("Lỗi khi mở khóa người dùng:", error);
        return {
            status: false,
            msg: error.response?.data?.message || error.message || 'Lỗi khi mở khóa người dùng'
        };
    }
};

//update user info
export const UpdateUserInfo = async (formData) => {
    try {
        const res = await request.put('/User/UserInfoUpdate', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
                });
        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}


// Tạo giao dịch nạp tiền
export const taoGiaoDich = async (napTienDto) => {
    try {
        const response = await request.post('/Payment/TaoGiaoDich', napTienDto);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo giao dịch nạp tiền:", error);
        throw error;
    }
};

// Huỷ giao dịch mới nhất của người dùng
export const huyGiaoDich = async () => {
    try {
        const response = await request.post('/api/Payment/HuyGiaoDich');
        return response.data;
    } catch (error) {
        console.error("Lỗi khi huỷ giao dịch:", error);
        throw error;
    }
};

// Lấy lịch sử giao dịch của người dùng hiện tại
export const layLichSuGiaoDich = async () => {
    try {
        const response = await request.get('/api/Payment/LichSu');
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy lịch sử giao dịch:", error);
        throw error;
    }
};

// Huỷ giao dịch mới nhất của người dùng
export const xacNhanChuyenTien = async () => {
    try {
        const response = await request.post('/api/Payment/HuyGiaoDich');
        return response.data;
    } catch (error) {
        console.error("Lỗi khi huỷ giao dịch:", error);
        throw error;
    }
};


// api nap tien qua VnPay
export const CreatePaymentVnPay = async (soTien,motaDH) => {
    try {
        const res = await request.post('/Payments/Create',{
            soTien,
            motaDH,
            kieuDH: "oder"
        });

        return res;
    } catch (error) {
        console.error("Lỗi khi huỷ giao dịch:", error);
    }
}