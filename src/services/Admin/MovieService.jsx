import * as request from "../../untils/Request.jsx";

// Đảm bảo handle lỗi đúng cách
const handleError = (error) => {
    console.error('API Error:', error);
    throw error; // Hoặc trả về thông báo lỗi thân thiện
};

// Lấy metadata để biết các trường cần nhập
export async function getPhimFormFields() {
    const response = await request.get('/Admin/Phim/metadata');
    return response.fields;
}

// Lấy danh sách phim
export const fetchMovies = async (page, limit) => {
    try {
        const response = await request.get('/Admin/Phim', {
            params: { page, limit }
        });
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

// Lấy danh sách phim theo bộ lọc
export const fetchFilterMovies = async (tenTL, TenQG, TenNN, page, limit) => {
    try {
        const response = await request.get('/Admin/Phim/LocPhim', {
            params: { tenTL, TenQG, TenNN, page, limit }
        });
        return response;
    } catch (error) {
        console.error("Lỗi tải phim:", error);
        return {
            status: false,
            data: [],
            pagination: null,
            msg: error.message || 'Lỗi khi tải danh sách lọc phim'
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

// API để nhập dữ liệu từ nguồn ngoài
export const addMovieFromAPI = (apiLink) => {
    return request.post('/Admin/Phim/inputapi', { query: apiLink });
};

// Tạo phim mới
export const createMovie = (movieData) => {
    const isFormData = movieData instanceof FormData;

    return request.post('/Admin/Phim/Them', movieData, {
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    }).catch(handleError);
};

// Cập nhật phim
export const updateMovie = (id, movieData) => {
    const isFormData = movieData instanceof FormData;

    return request.put(`/Admin/Phim/CapNhat/${id}`, movieData, {
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    }).catch(handleError);
};

// Xóa phim
export const deleteMovie = (id) => {
    return request.deleteRequest(`/Admin/Phim/Xoa/${id}`).catch(handleError);
};

// Lấy metadata để biết các trường cần nhập
export async function getTheLoaiFormFields() {
    const response = await request.get('/Admin/QuanTriVienTheLoai/metadata');
    return response.fields;
}

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

export const searchTheLoais = async (tentl, page, limit) => {
    try {
        const response = await request.get(`/Admin/QuanTriVienTheLoai/search`, {
            params: {
                tentl,
                page,
                limit
            }
        });

        return response;

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

// Tạo thể loại mới
export const createTheLoai = (theLoaiData) => {
    const isFormData = theLoaiData instanceof FormData;

    return request.post('/Admin/QuanTriVienTheLoai/Them', theLoaiData, {
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    }).catch(handleError);
};

// Cập nhật thể loại
export const updateTheLoai = (id, theLoaiData) => {
    const isFormData = theLoaiData instanceof FormData;

    return request.put(`/Admin/QuanTriVienTheLoai/CapNhat/${id}`, theLoaiData, {
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    }).catch(handleError);
};

// Xóa thể loại
export const deleteTheLoai = (id) => {
    return request.deleteRequest(`/Admin/QuanTriVienTheLoai/Xoa/${id}`).catch(handleError);
};

// Lấy danh sách quốc gia với phân trang
export const fetchQuocGias = async (page, limit) => {
    try {
        const response = await request.get('/Admin/QuocGia', {
            params: { page, limit }
        });

        return response;

    } catch (error) {
        console.error("Lỗi tải quốc gia:", error);
        return {
            status: false,
            data: [],
            pagination: null,
            msg: error.message || 'Lỗi khi tải danh sách quốc gia'
        };
    }
};

// Lấy metadata để biết các trường cần nhập
export async function getQuocGiaFormFields() {
    const response = await request.get('/Admin/QuocGia/metadata');
    return response.fields;
}

// Tìm kiếm quốc gia theo từ khóa
export const searchQuocGias = async (tenqg, page, limit) => {
    try {
        const response = await request.get(`/Admin/QuocGia/search`, {
            params: {
                tenqg,
                page,
                limit
            }
        });

        return response;

    } catch (error) {
        console.error("Lỗi tìm kiếm quốc gia:", error);
        return {
            status: false,
            data: [],
            totalItems: 0,
            msg: error.message || 'Lỗi khi tìm kiếm quốc gia'
        };
    }
};

// Thêm quốc gia mới
export const createQuocGia = (quocGiaData) => {
    const isFormData = quocGiaData instanceof FormData;

    return request.post('/Admin/QuocGia/Them', quocGiaData, {
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    }).catch(handleError);
};

// Cập nhật thông tin quốc gia
export const updateQuocGia = (id, quocGiaData) => {
    const isFormData = quocGiaData instanceof FormData;

    return request.put(`/Admin/QuocGia/CapNhat/${id}`, quocGiaData, {
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    }).catch(handleError);
};

// Xóa quốc gia
export const deleteQuocGia = (id) => {
    return request.deleteRequest(`/Admin/QuocGia/Xoa/${id}`).catch(handleError);
};


// Lấy danh sách ngôn ngữ với phân trang
export const fetchNgonNgus = async (page, limit) => {
    try {
        const response = await request.get('/Admin/NgonNgu', {
            params: { page, limit }
        });

        console.log('API Response NgonNgu:', response);

        return response;

    } catch (error) {
        console.error("Lỗi tải ngôn ngữ:", error);
        return {
            status: false,
            data: [],
            pagination: null,
            msg: error.message || 'Lỗi khi tải danh sách ngôn ngữ'
        };
    }
};

// Tìm kiếm ngôn ngữ
export const searchNgonNgus = async (tennn, page, limit) => {
    try {
        const response = await request.get(`/Admin/NgonNgu/search`, {
            params: {
                tennn,
                page,
                limit
            }
        });

        return response;

    } catch (error) {
        console.error("Lỗi tìm kiếm ngôn ngữ:", error);
        return {
            status: false,
            data: [],
            totalItems: 0,
            msg: error.message || 'Lỗi khi tìm kiếm ngôn ngữ'
        };
    }
};

// Lấy metadata để biết các trường cần nhập
export async function getNgonNguFormFields() {
    const response = await request.get('/Admin/NgonNgu/metadata');
    return response.fields;
}

// Thêm ngôn ngữ mới
export const createNgonNgu = (ngonNguData) => {
    const isFormData = ngonNguData instanceof FormData;

    return request.post('/Admin/NgonNgu/Them', ngonNguData, {
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    }).catch(handleError);
};

// Cập nhật ngôn ngữ
export const updateNgonNgu = (id, ngonNguData) => {
    const isFormData = ngonNguData instanceof FormData;

    return request.put(`/Admin/NgonNgu/CapNhat/${id}`, ngonNguData, {
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    }).catch(handleError);
};

// Xóa ngôn ngữ
export const deleteNgonNgu = (id) => {
    return request.deleteRequest(`/Admin/NgonNgu/Xoa/${id}`).catch(handleError);
};

export const fetchDaoDiens = async (page, limit) => {
    try {
        const response = await request.get('/Admin/DaoDien', {
            params: { page, limit }
        });

        console.log('API Response DaoDien:', response);

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

export const searchDaoDiens = async (tendg, page, limit) => {
    try {
        const response = await request.get(`/Admin/DaoDien/search`, {
            params: {
                tendg,
                page,
                limit
            }
        });

        return response;

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

// Lấy metadata để biết các trường cần nhập
export async function getDaoDienFormFields() {
    const response = await request.get('/Admin/DaoDien/metadata');
    return response.fields;
}

// Thêm đạo diễn
export const createDaoDien = (daoDienData) => {
    const isFormData = daoDienData instanceof FormData;

    return request.post('/Admin/DaoDien/Them', daoDienData, {
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    }).catch(handleError);
};

// Cập nhật đạo diễn
export const updateDaoDien = (id, daoDienData) => {
    const isFormData = daoDienData instanceof FormData;

    return request.put(`/Admin/DaoDien/CapNhat/${id}`, daoDienData, {
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    }).catch(handleError);
};

// Xóa đạo diễn
export const deleteDaoDien = (id) => {
    return request.deleteRequest(`/Admin/DaoDien/Xoa/${id}`).catch(handleError);
};


export const fetchDienViens = async (page, limit) => {
    try {
        const response = await request.get('/Admin/DienVien', {
            params: { page, limit }
        });

        return response;

    } catch (error) {
        console.error("Lỗi tải danh sách diễn viên:", error);
        return {
            status: false,
            data: [],
            pagination: null,
            msg: error.message || 'Lỗi khi tải danh sách diễn viên'
        };
    }
};

// Tìm kiếm diễn viên theo từ khóa
export const searchDienViens = async (tendv, page, limit) => {
    try {
        const response = await request.get(`/Admin/DienVien/search`, {
            params: {
                tendv,
                page,
                limit
            }
        });

        return response;

    } catch (error) {
        console.error("Lỗi tìm kiếm diễn viên:", error);
        return {
            status: false,
            data: [],
            totalItems: 0,
            msg: error.message || 'Lỗi khi tìm kiếm diễn viên'
        };
    }
};

// Lấy metadata để biết các trường cần nhập
export async function getDienVienFormFields() {
    const response = await request.get('/Admin/DienVien/metadata');
    return response.fields;
}

// Thêm diễn viên
export const createDienVien = (dienVienData) => {
    const isFormData = dienVienData instanceof FormData;

    return request.post('/Admin/DienVien/Them', dienVienData, {
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    }).catch(handleError);
};

// Cập nhật diễn viên
export const updateDienVien = (id, dienVienData) => {
    const isFormData = dienVienData instanceof FormData;

    return request.put(`/Admin/DienVien/CapNhat/${id}`, dienVienData, {
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    }).catch(handleError);
};

// Xóa diễn viên
export const deleteDienVien = (id) => {
    return request.deleteRequest(`/Admin/DienVien/Xoa/${id}`).catch(handleError);
};

// Lấy danh sách tất cả các thẻ tag
export const fetchTheTags = async (page, limit) => {
    try {
        const response = await request.get('/Admin/TheTag', {
            params: { page, limit }
        });

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
export const searchTheTags = async (tent, page, limit) => {
    try {
        const response = await request.get(`/Admin/TheTag/search`, {
            params: {
                tent,
                page,
                limit
            }
        });

        return response;

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

// Lấy metadata để biết các trường cần nhập
export async function getTheTagFormFields() {
    const response = await request.get('/Admin/TheTag/metadata');
    return response.fields;
}

// Thêm thẻ tag
export const createTheTag = (theTagData) => {
    const isFormData = theTagData instanceof FormData;

    return request.post('/Admin/TheTag/Them', theTagData, {
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    }).catch(handleError);
};

// Cập nhật thẻ tag
export const updateTheTag = (id, theTagData) => {
    const isFormData = theTagData instanceof FormData;

    return request.put(`/Admin/TheTag/CapNhat/${id}`, theTagData, {
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    }).catch(handleError);
};

// Xóa thẻ tag
export const deleteTheTag = (id) => {
    return request.deleteRequest(`/Admin/TheTag/Xoa/${id}`).catch(handleError);
};