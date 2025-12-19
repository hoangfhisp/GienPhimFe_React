// Request.jsx
import apiHelper from "./ApiHelper";
import apiMultipart from "./ApiMultipart";
import publicRequest from "./PublicRequest";

const isFormData = (v) => typeof FormData !== "undefined" && v instanceof FormData;

export const get = (url, options = {}, auth = false) =>
    auth
        ? apiHelper.get(url, options).then((res) => res.data)
        : publicRequest.get(url, options).then((res) => res.data);

export const post = (url, data = {}, options = {}, auth = false) => {
    if (!auth) return publicRequest.post(url, data, options).then((res) => res.data);

    const client = isFormData(data) ? apiMultipart : apiHelper;
    return client.post(url, data, options).then((res) => res.data);
};

export const put = (url, data = {}, options = {}, auth = false) => {
    if (!auth) return publicRequest.put(url, data, options).then((res) => res.data);

    const client = isFormData(data) ? apiMultipart : apiHelper;
    return client.put(url, data, options).then((res) => res.data);
};

export const deleteRequest = (url, options = {}, auth = false) =>
    auth
        ? apiHelper.delete(url, options).then((res) => res.data)
        : publicRequest.delete(url, options).then((res) => res.data);
