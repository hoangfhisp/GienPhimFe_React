import axios from "axios";

const request = axios.create({
    baseURL: 'http://localhost:5039/api',
    withCredentials: true
})

export const get = async (path, options = {}) => {
    const respones = await request.get(path,options);
    return respones.data ;
}


export default request;