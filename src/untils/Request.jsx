import apiHelper from "./ApiHelper";
import publicRequest from "./PublicRequest";

export const get = (url, options = {}, auth = false) =>
  auth
    ? apiHelper.get(url, { ...options, auth }).then(res => res.data)
    : publicRequest.get(url, options).then(res => res.data);

export const post = (url, data = {}, options = {}, auth = false) =>
  auth
    ? apiHelper.post(url, data, { ...options, auth }).then(res => res.data)
    : publicRequest.post(url, data, options).then(res => res.data);

export const put = (url, data = {}, options = {}, auth = false) =>
  auth
    ? apiHelper.put(url, data, { ...options, auth }).then(res => res.data)
    : publicRequest.put(url, data, options).then(res => res.data);

export const deleteRequest = (url, options = {}, auth = false) =>
  auth
    ? apiHelper.delete(url, { ...options, auth }).then(res => res.data)
    : publicRequest.delete(url, options).then(res => res.data);
