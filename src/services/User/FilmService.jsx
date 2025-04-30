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

export const phim = async (id) =>{
    try {
        const res = await request.get(`/phim/${id}`);
        
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }

}