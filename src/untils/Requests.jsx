import axios from "axios";

const request = axios.create({
    baseURL: process.env.REACT_APP_GIENPHIM_BE_API_URL,
    withCredentials: true,
    validateStatus: function (status) {
        // Cho phép 200 và 404 đi qua then
        return status >= 200 && status < 300 || status === 404;
    }
});

export const get = async (path, options = {}) => {
    const respones = await request.get(path, options);
    return respones.data;
}

export const post = async (path, data = {}, options = {}) => {
    const response = await request.post(path, data, options);
    return response.data;
};

export const put = async (path, data, options = {}) => {
    const response = await request.put(path, data, options);
    return response.data;
};

export const deleteRequest = async (path, options = {}) => {
    const response = await request.delete(path, options);
    return response.data;
};

export default request;