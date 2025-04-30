import * as request from "../../untils/Request.jsx";

export const searchphim = async (tenp) =>{
    try {
        const res = await request.get('/Search',{
            params:{
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