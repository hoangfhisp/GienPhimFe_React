import * as request from "../../untils/Request.jsx";

export const listphim = async () =>{
    try {
        const res = await request.get('/phim');
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