import * as request from "../../untils/Requests.jsx";

// Đảm bảo handle lỗi đúng cách
const handleError = (error) => {
    console.error('API Error:', error);
    throw error; // Hoặc trả về thông báo lỗi thân thiện
};

// Lấy danh sách phim với phân trang
export const fetchPhims = async (page, limit) => {
    try {
        return await request.get(
            "/Phim/GetAllPhims",
            { params: { page, limit } },
        );
    } catch (error) {
        console.error("Lỗi khi gọi API phim:", error);
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
export const searchPhims = async (keyword) => {
    // backend đang dùng [FromQuery] string keyword
    return await request.get("/Phim/Search", {
        params: { keyword: (keyword || "").trim() },
    });
};

// API để nhập dữ liệu từ nguồn ngoài
export const addMovieFromAPI = (slugNameFilmApi) => {
    return request.post("/Phim/ImportFromApi", null,
        { params: { slug: slugNameFilmApi } },
        true
    );
};

// Xem chi tiết phim
export const fetchPhimDetail = (id) => {
    return request.get(`/Phim/GetById/${id}`);
};

// Thêm phim (multipart/form-data) -> ADMIN cần token
export const createPhim = async (formData) => {
    return await request.post("/Phim/Create", formData, {}, true);
};

// Cập nhật phim 
export const updatePhim = async (formData) => {
    return await request.put(
        "/Phim/Update",
        formData,
        {},
        true
    );
};

// Xoá phim
export const deletePhim = async (phimId) => {
    return await request.deleteRequest(
        "/Phim/Delete",
        { params: { phimId } },
        true
    );
};

// Lấy danh sách tất cả tập phim (phân trang)
export const fetchTapPhims = async (page, limit) => {
    try {
        const response = await request.get("/TapPhim/GetAll", {
            params: { page, limit },
        });
        return response;
    } catch (error) {
        console.error("Lỗi khi gọi API fetchTapPhims:", error);
    }
};

// Lấy danh sách tập theo PhimId
export const fetchTapPhimsByPhimId = async (phimId) => {
    try {
        const response = await request.get("/TapPhim/GetByPhimId", {
            params: { phimId },
        });
        return response;
    } catch (error) {
        console.error("Lỗi khi gọi API fetchTapPhimsByPhimId:", error);
    }
};

// Tìm kiếm tập phim theo keyword (tên tập + tên phim)
export const searchTapPhims = async (keyword, page = 1, limit = 10) => {
    return await request.get("/TapPhim/Search", {
        params: {
            keyword: (keyword || "").trim(),
            page,
            limit,
        },
    });
};

// Thêm tập phim (multipart/form-data)
export const createTapPhim = async (formData) => {
    return await request.post(
        "/TapPhim/Create",
        formData,
        {},
        true
    );
};

// Cập nhật tập phim (multipart/form-data)
export const updateTapPhim = async (formData) => {
    return await request.put(
        "/TapPhim/Update",
        formData,
        {},
        true
    );
};

// Xoá tập phim
export const deleteTapPhim = async (tapId) => {
    return await request.deleteRequest(
        "/TapPhim/Delete",
        { params: { tapId } },
        true
    );
};

// Lấy danh sách thể loại
export const fetchTheLoais = async (page, limit) => {
    try {
        const response = await request.get("/TheLoai/GetAllTheLoais", {
            params: { page, limit },
        });

        return response;
    } catch (error) {
        console.error("Lỗi khi gọi API thể loại:", error);
    }
};

// Tìm kiếm thể loại
export const searchTheLoais = async (keyword) => {
    return await request.get("/TheLoai/Search", {
        params: { keyword: (keyword || "").trim() },
    });
};

// Xem chi tiết thể loại
export const fetchTheLoaiDetail = (theLoaiId) => {
    return request.get(`/TheLoai/Detail/${theLoaiId}`);
};

// Thêm thể loại
export const createTheLoai = async (payload) => {
    return await request.post(
        "/TheLoai/Create",
        {
            tenTL: payload.tenTL,
            moTa: payload.moTa,
        },
        {},
        true
    );
};

// Cập nhật thể loại
export const updateTheLoai = async (payload) => {
    return await request.put(
        "/TheLoai/Update",
        payload,
        {},
        true
    );
};

// Xoá thể loại
export const deleteTheLoai = async (theLoaiId) => {
    return await request.deleteRequest(
        "/TheLoai/Delete",
        { params: { theLoaiId } },
        true
    );
};

// Lấy danh sách quốc gia với phân trang
export const fetchQuocGias = async (page, limit) => {
    try {
        const response = await request.get('/QuocGia/GetAllQuocGias', {
            params: { page, limit }
        });

        return response;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
};

// Tìm kiếm quốc gia theo từ khóa
export const searchQuocGias = async (keyword) => {
    return await request.get("/QuocGia/Search", {
        params: { keyword: (keyword || "").trim() },
    });
};

// Xem chi tiết quốc gia
export const fetchQuocGiaDetail = (quocGiaId) => {
    return request.get(`/QuocGia/Detail/${quocGiaId}`);
};

// Thêm quốc gia
export const createQuocGia = async (payload) => {
    return await request.post(
        "/QuocGia/Create",
        {
            tenQG: payload.tenQG,
            moTaQG: payload.moTaQG,
        },
        {},
        true
    );
};

// Cập nhật quốc gia
export const updateQuocGia = async (payload) => {
    return await request.put(
        "/QuocGia/Update",
        payload,
        {},
        true
    );
};

// Xoá quốc gia
export const deleteQuocGia = async (quocGiaId) => {
    return await request.deleteRequest(
        "/QuocGia/Delete",
        { params: { quocGiaId } },
        true
    );
};

// Lấy danh sách ngôn ngữ với phân trang
export const fetchNgonNgus = async (page, limit) => {
    try {
        const response = await request.get('/NgonNgu/GetAllNgonNgus', {
            params: { page, limit }
        });

        return response;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
};

// Tìm kiếm ngôn ngữ
export const searchNgonNgus = async (keyword) => {
    return await request.get("/NgonNgu/Search", {
        params: { keyword: (keyword || "").trim() },
    });
};

// Xem chi tiết ngôn ngữ
export const fetchNgonNguDetail = (ngonNguId) => {
    return request.get(`/NgonNgu/Detail/${ngonNguId}`);
};

// Thêm ngôn ngữ
export const createNgonNgu = async (payload) => {
    return await request.post(
        "/NgonNgu/Create",
        {
            tenNN: payload.tenNN,
            moTaNN: payload.moTaNN,
        },
        {},
        true
    );
};

// Cập nhật ngôn ngữ
export const updateNgonNgu = async (payload) => {
    return await request.put(
        "/NgonNgu/Update",
        payload,
        {},
        true
    );
};

// Xoá ngôn ngữ
export const deleteNgonNgu = async (ngonNguId) => {
    return await request.deleteRequest(
        "/NgonNgu/Delete",
        { params: { ngonNguId } },
        true
    );
};

// Lấy danh sách đạo diễn với phân trang
export const fetchDaoDiens = async (page, limit) => {
    try {
        const response = await request.get("/DaoDien/GetAllDaoDiens", {
            params: { page, limit },
        });

        return response;
    } catch (error) {
        console.error("Lỗi khi gọi API đạo diễn:", error);
    }
};

// Tìm kiếm đạo diễn
export const searchDaoDiens = async (keyword) => {
    return await request.get("/DaoDien/Search", {
        params: { keyword: (keyword || "").trim() },
    });
};

// Xem chi tiết đạo diễn
export const fetchDaoDienDetail = (daoDienId) => {
    return request.get(`/DaoDien/Detail/${daoDienId}`);
};

// Thêm đạo diễn
export const createDaoDien = async (payload) => {
    return await request.post(
        "/DaoDien/Create",
        {
            tenDD: payload.tenDD,
            moTaDD: payload.moTaDD,
        },
        {},
        true
    );
};

// Cập nhật đạo diễn
export const updateDaoDien = async (payload) => {
    return await request.put(
        "/DaoDien/Update",
        payload,
        {},
        true
    );
};

// Xoá đạo diễn
export const deleteDaoDien = async (daoDienId) => {
    return await request.deleteRequest(
        "/DaoDien/Delete",
        { params: { daoDienId } },
        true
    );
};

// Lấy danh sách diễn viên với phân trang
export const fetchDienViens = async (page, limit) => {
    try {
        const response = await request.get("/DienVien/GetAllDienViens", {
            params: { page, limit },
        });

        return response;
    } catch (error) {
        console.error("Lỗi khi gọi API diễn viên:", error);
    }
};

// Tìm kiếm diễn viên theo từ khóa
export const searchDienViens = async (keyword) => {
    return await request.get("/DienVien/Search", {
        params: { keyword: (keyword || "").trim() },
    });
};

// Xem chi tiết diễn viên
export const fetchDienVienDetail = (dienVienId) => {
    return request.get(`/DienVien/Detail/${dienVienId}`);
};

// Thêm diễn viên
export const createDienVien = async (payload) => {
    return await request.post(
        "/DienVien/Create",
        {
            tenDV: payload.tenDV,
            moTaDV: payload.moTaDV,
        },
        {},
        true
    );
};

// Cập nhật diễn viên
export const updateDienVien = async (payload) => {
    return await request.put(
        "/DienVien/Update",
        payload,
        {},
        true
    );
};

// Xoá diễn viên
export const deleteDienVien = async (dienVienId) => {
    return await request.deleteRequest(
        "/DienVien/Delete",
        { params: { dienVienId } },
        true
    );
};

// Lấy danh sách thẻ tag với phân trang
export const fetchTheTags = async (page, limit) => {
    try {
        const response = await request.get("/TheTag/GetAllTheTags", {
            params: { page, limit },
        });

        return response;
    } catch (error) {
        console.error("Lỗi khi gọi API thẻ tag:", error);
    }
};

// Tìm kiếm thẻ tag theo từ khóa
export const searchTheTags = async (keyword) => {
    return await request.get("/TheTag/Search", {
        params: { keyword: (keyword || "").trim() },
    });
};

// Xem chi tiết thẻ tag
export const fetchTheTagDetail = (theTagId) => {
    return request.get(`/TheTag/Detail/${theTagId}`);
};

// Thêm thẻ tag
export const createTheTag = async (payload) => {
    return await request.post(
        "/TheTag/Create",
        {
            tenT: payload.tenT,
            moTaT: payload.moTaT,
        },
        {},
        true
    );
};

// Cập nhật thẻ tag
export const updateTheTag = async (payload) => {
    return await request.put(
        "/TheTag/Update",
        payload,
        {},
        true
    );
};

// Xoá thẻ tag
export const deleteTheTag = async (theTagId) => {
    return await request.deleteRequest(
        "/TheTag/Delete",
        { params: { theTagId } },
        true
    );
};

// Lấy danh sách lịch sử giao dịch
export const fetchLichSuGiaoDichNguoiDung = async (page, limit) => {
    try {
        const response = await request.get('/Admin/QuanTriVienLichSuGiaoDich', {
            params: { page, limit }
        });

        return response;
    } catch (error) {
        console.error("Lỗi tải lịch sử giao dịch:", error);
        return {
            status: false,
            data: [],
            pagination: null,
            msg: error.message || 'Lỗi khi tải danh sách lịch sử giao dịch'
        };
    }
};

// Tìm kiếm lịch sử giao dịch theo ID người dùng
export const searchLichSuGiaoDichByNguoiDung = async (nguoiDungName, page = 1, limit = 10) => {
    try {
        const response = await request.get('/Admin/QuanTriVienLichSuGiaoDich/search', {
            params: { nguoiDungName, page, limit }
        });
        return response;
    } catch (error) {
        console.error("Lỗi khi tìm giao dịch theo người dùng:", error);
        return {
            status: false,
            data: [],
            pagination: { page, limit, total: 0 },
            msg: error.message || 'Lỗi khi tìm kiếm giao dịch'
        };
    }
};

export const fetchTopViewedMovies = async (topphim = 5, page = 1, limit = 10) => {
    try {
        const response = await request.get('/Phim/TopPhim/LuotXem', {
            params: { topphim, page, limit }
        });
        return response.data;  // trả về data trực tiếp
    } catch (error) {
        console.error("Lỗi lấy lượt xem:", error);
        return {
            status: false,
            data: [],
            pagination: { page, limit, total: 0 },
            msg: error.message || 'Lỗi lấy lượt xem'
        };
    }
};

// Lấy metadata để biết các trường cần nhập
export async function getGoiThanhVienFormFields() {
    const response = await request.get('/GoiThanhVien/metadata');
    return response.fields;
}

// Thêm gói thành viên
export const createGoiThanhVien = (goiThanhVienData) => {
    return request.post(
        "/GoiThanhVien/AddGoiThanhVien",
        goiThanhVienData,
        {},
        true
    ).catch(handleError);
};

// Cập nhật gói thành viên (đúng route mới)
export const updateGoiThanhVien = (id, goiThanhVienData) => {
    return request.put(
        `/GoiThanhVien/UpdateGoiThanhVien/${id}`,
        goiThanhVienData,
        {},
        true
    ).catch(handleError);
};

// Xóa gói thành viên (đúng route mới)
export const deleteGoiThanhVien = (id) => {
    return request.deleteRequest(
        `/GoiThanhVien/DeleteGoiThanhVien/${id}`,
        {},
        true
    ).catch(handleError);
};

// Lấy danh sách tất cả gói thành viên
export const fetchAllGoiThanhVien = async () => {
    try {
        const response = await request.get('/GoiThanhVien/GetAllGoiThanhVien');
        return response;
    } catch (error) {
        console.error("Lỗi tải gói thành viên:", error);
        return {
            status: false,
            data: [],
            msg: error.message || 'Lỗi khi tải danh sách gói thành viên'
        };
    }
};

// Lấy metadata để biết các trường cần nhập
export async function getLuaChonGoiTVFormFields() {
    try {
        const response = await request.get('/LuaChonGoiTV/metadata');
        return response.fields;
    } catch (error) {
        console.error("Lỗi khi tải metadata LuaChonGoiTV:", error);
        return [];
    }
}

// Thêm lựa chọn gói thành viên
export const createLuaChonGoiTV = (luaChonData) => {
    return request.post(
        "/LuaChonGoiTV/AddLuachonGoiTV",
        luaChonData,
        {},
        true
    ).catch(handleError);
};

// Cập nhật lựa chọn gói thành viên
export const updateLuaChonGoiTV = (id, luaChonData) => {
    return request.put(
        `/LuaChonGoiTV/UpdateLuaChonGoiTV/${id}`,
        luaChonData,
        {},
        true
    ).catch(handleError);
};

// Xoá lựa chọn gói thành viên
export const deleteLuaChonGoiTV = (id) => {
    return request.deleteRequest(
        `/LuaChonGoiTV/DeleteLuaChonGoiTV/${id}`,
        {},
        true
    ).catch(handleError);
};

// Lấy tất cả lựa chọn gói thành viên
export const fetchAllLuaChonGoiTV = async () => {
    try {
        const response = await request.get('/LuaChonGoiTV/GetAllLuaChonGoiTV');
        return response;
    } catch (error) {
        console.error("Lỗi tải danh sách LuaChonGoiTV:", error);
        return {
            status: false,
            data: [],
            msg: error.message || 'Lỗi khi tải danh sách lựa chọn gói TV'
        };
    }
};

// Lấy lựa chọn gói thành viên theo ID và số ngày
export const fetchLuaChonGoiTVByIdAndNgay = async (goiTVId, ngay) => {
    try {
        const response = await request.get('/LuaChonGoiTV/GetLuaChonGoiTVByIdAndNgay', {
            params: { goiTVId, ngay }
        });
        return response;
    } catch (error) {
        console.error("Lỗi khi lấy LuaChonGoiTV theo ID và ngày:", error);
        return {
            status: false,
            data: [],
            msg: error.message || 'Lỗi khi lấy lựa chọn gói TV'
        };
    }
};

// add phim bằng api kk phim
export const AddPhimByApi = async (api) => {
    try {
        const res = await request.get('/Phim/kkPhim/LuuDuLieu', {
            params: {
                api
            }
        })
        return res;
    } catch (error) {
        console.error("Lỗi khi add phim api:", error);
    }
}

// Lấy danh sách gói thành viên (phân trang)
export const fetchMembershipPlans = async (page = 1, limit = 10) => {
    return await request.get("/MembershipPlan/GetAllMembershipPlans", {
        params: { page, limit },
    });
};

// Lấy chi tiết gói thành viên
export const fetchMembershipPlanDetail = async (planId) => {
    return await request.get(`/MembershipPlan/Detail/${planId}`);
};

// Tạo gói thành viên
export const createMembershipPlan = async (payload) => {
    return await request.post(
        "/MembershipPlan/Create",
        payload,
        {},
        true
    );
};

// Cập nhật gói thành viên
export const updateMembershipPlan = async (payload) => {
    return await request.put(
        "/MembershipPlan/Update",
        payload,
        {},
        true
    );
};

// Xoá gói thành viên
export const deleteMembershipPlan = async (planId) => {
    return await request.deleteRequest(
        "/MembershipPlan/Delete",
        { params: { planId } },
        true
    );
};

// Lấy danh sách option (phân trang – dùng cho admin tổng)
export const fetchPlanOptions = async (page = 1, limit = 10) => {
    return await request.get("/PlanOption/GetAllPlanOptions", {
        params: { page, limit },
    });
};

// Lấy chi tiết option
export const fetchPlanOptionDetail = async (optionId) => {
    return await request.get(`/PlanOption/Detail/${optionId}`);
};

// Tạo option cho gói
export const createPlanOption = async (payload) => {
    return await request.post(
        "/PlanOption/Create",
        payload,
        {},
        true
    );
};

// Cập nhật option
export const updatePlanOption = async (payload) => {
    return await request.put(
        "/PlanOption/Update",
        payload,
        {},
        true
    );
};

// Xoá option
export const deletePlanOption = async (optionId) => {
    return await request.deleteRequest(
        "/PlanOption/Delete",
        { params: { optionId } },
        true
    );
};

// GET cấu hình bot
export const fetchBotConfig = async () => {
    return await request.get(
        "/BotConfig/GetConfig",
        {},
        true
    );
};

// PUT cập nhật cấu hình bot
export const updateBotConfig = async (payload) => {
    return await request.put(
        "/BotConfig/Update",
        payload,
        {},
        true
    );
};

// GET logs phân trang
export const fetchBotSyncLogs = async (page = 1, limit = 10) => {
    return await request.get("/BotSyncLogs/GetAll", { params: { page, limit } });
};

//Api người dùng
export const fetchUsers = async (page, limit) => {
    try {
        const res = await request.get(
            "/User/GetListUser",
            { params: { page, limit } },
            true
        );
        return res;
    } catch (error) {
        console.error("Lỗi lấy danh sách user:", error);
    }
};

// Cập nhật người dùng
export const updateInfoUser = async (formData) => {
    return await request.put(
        "/User/UpdateInfoUser",
        formData,
        {},
        true
    );
};

// Xóa người dùng
export const deleteUser = async (userId) => {
    return await request.deleteRequest(
        "/User/DeleteUser",
        { params: { userId } },
        true
    );
};
