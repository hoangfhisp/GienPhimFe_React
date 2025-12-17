import dayjs from "dayjs";
import env from "../config/Config";

export function formatVND(value) {
  return value.toLocaleString('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,  // lần min xuất hiện 0 sau phẩy
    maximumFractionDigits: 0,    //số lần min xuất hiện 0 sau phẩy
  }) + ' VNĐ';
}

export function formatDateTime(value){
    return dayjs(value).format('DD/MM/YYYY HH:mm:ss');
}

export function formatYear(value){
    return dayjs(value).format('YYYY');
}

export function formatDate(value){
  return dayjs(value).format('DD/MM/YYYY');
}

export function formatURLImage(value) {
  if (!value) return null;

  // Nếu là full URL (Google, Facebook, CDN...)
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  // Nếu là path từ BE
  return env.BE_URL + value;
}