import * as request from "../../untils/Request.jsx";

export const searchphim = async (tenp) => {
    try {
        const res = await request.get('/Search', {
            params: {
                tenp,
                page: 1,
                limit: 3

            }
        });
        return res;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const searchTheLoais = async (tenTL, page = 1, limit = 10) => {
    try {
        const res = await request.get('/Search/TheLoai', {
            params: { tenTL, page, limit }
        });
        return res;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const searchQuocGias = async (tenQG, page = 1, limit = 10) => {
    try {
        const res = await request.get('/Search/QuocGia', {
            params: { tenQG, page, limit }
        });
        return res;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const searchNgonNgus = async (tenNN, page = 1, limit = 10) => {
    try {
        const res = await request.get('/Search/NgonNgu', {
            params: { tenNN, page, limit }
        });
        return res;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const searchTheTags = async (tenTT, page = 1, limit = 10) => {
    try {
        const res = await request.get('/Search/TheTag', {
            params: { tenTT, page, limit }
        });
        return res;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const searchDaoDiens = async (tenDD, page = 1, limit = 10) => {
    try {
        const res = await request.get('/Search/DaoDien', {
            params: { tenDD, page, limit }
        });
        return res;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const searchDienViens = async (tenDV, page = 1, limit = 10) => {
    try {
        const res = await request.get('/Search/DienVien', {
            params: { tenDV, page, limit }
        });
        return res;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const searchTheLoaiSlug = async (searchSlug,page,limit) => {
    try {
        const res = await request.get('/Phim/TheLoaiSlug', {
            params: {
                    searchSlug,
                    page,
                    limit 
                }
        });
        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}
