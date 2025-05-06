// services/User/LocPhimService.jsx

import * as request from "../../untils/Request.jsx";

export const filterMovies = async (filters) => {
    try {
        const response = await request.get('/LocPhim/filter', {
            params: filters
        });

        console.log('Raw filter response:', response);

        return response;
    } catch (error) {
        console.error("Lỗi lọc phim:", error);
        return {
            data: [],
            pagination: {
                total: 0,
                limit: filters.limit,
                page: filters.page
            }
        };
    }
};
