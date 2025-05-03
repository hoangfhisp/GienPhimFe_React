import * as request from "../../untils/Request.jsx";

export const listphim = async (page,limit) =>{
    try {
        const res = await request.get('/phim',{
            params:{
                page,
                limit
            }
        });
        return res;
        
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const listTopLuotXemPhim = async (topphim,page,limit) =>{
    try {
        const res = await request.get('/phim/TopPhim/LuotXem',{
            params:{
                topphim, // Lấy top 5,... phim thì điền 5,...
                page,
                limit
            }
        });
        return res;
        
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const phim = async (id) =>{
    try {
        const res = await request.get(`/phim/${id}`);
        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
    
}

export const newPhims = async (topphim,page,limit) => {
    try {
        const res = await request.get('/phim/TopPhim/NewPhim',{
            params:{
                topphim,
                page,
                limit
            }
        });
        return res;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}