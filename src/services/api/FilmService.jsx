import * as request from "../../untils/Request.jsx";

export const listphim = async () =>{
    try {
        const res = await request.get('/phim');
        console.log(res.data);
        return res;
        
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

export const phim = async (id) =>{
    try {
        const res = await request.get(`/phim/${id}`);
        return res.data;
        
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }

}