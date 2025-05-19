
import { jwtDecode } from "jwt-decode";

// Lấy token đã lưu 
export function getToken(){
    return localStorage.getItem('token');
}

// Dịch Token 
export function decodeToken(){
    const token = getToken();
    
    if(!token) return null;

    try {
        return jwtDecode(token);
    } catch (error) {
        console.log("Dịch token thất bại")
        return;
    }
}

// Lấy userID từ token đã dịch
export function getUserIdFromToken(){
    const decode = decodeToken();
    return decode?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
}

// Lấy role user từ token đã dịch
export function getRolseUserFromToken(){
    const decode = decodeToken();
    return decode?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
}

// Xóa token người dùng khi đăng xuất
export function deleteToken(){
    return localStorage.removeItem('token');
}