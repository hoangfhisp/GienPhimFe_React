import { Navigate, Outlet } from "react-router-dom";
import {
    getUserIdFromToken,
    getRolseUserFromToken,
} from "../../hooks/auth";

export default function AdminGuard() {
    const userId = getUserIdFromToken();
    const role = getRolseUserFromToken();

    // chưa login
    if (!userId) {
        return <Navigate to="/login" replace />;
    }

    // không phải admin
    if (role !== "Admin") {
        return <Navigate to="/Home" replace />;
    }

    // hợp lệ
    return <Outlet />;
}
