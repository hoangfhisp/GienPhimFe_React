import { useEffect, useState } from "react";
import * as authServices from "../../../services/Admin/AuthenticationService.jsx";
import { decodeToken } from "../../../hooks/auth.jsx";
import "./Profile.scss";
function ProfileContent({ dataU }) {
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        phoneNumber: "",
        nameND: "",
        gioiTinh: 0,
        moTa: "",
        avatarND: null,
    });

    useEffect(() => {
        if (!dataU) return;

        const u = dataU?.data ?? dataU;

        setFormData((prev) => ({
            ...prev,

            userName: u?.userName || prev.userName || "",
            email: u?.email || prev.email || "",
            phoneNumber: u?.phoneNumber || "",
            nameND: u?.nameND || "",

            gioiTinh: Number.isFinite(u?.gioiTinh) ? u.gioiTinh : Number(u?.gioiTinh ?? 0),

            moTa: u?.moTa ?? u?.mota ?? "",

            avatarND: null,
        }));
    }, [dataU]);

    const HandleChange = (e) => {
        const { name, value, type, files } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "file"
                    ? files?.[0] ?? null
                    : name === "gioiTinh"
                        ? parseInt(value, 10)
                        : value,
        }));
    };

    const HandleSubmit = async (e) => {
        e.preventDefault();

        const decoded = decodeToken();
        const userName =
            formData.userName ||
            decoded?.unique_name ||
            decoded?.name ||
            decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
            "";

        if (!userName) {
            window.alert("Không lấy được UserName từ token. Vui lòng đăng nhập lại.");
            return;
        }

        const fd = new FormData();
        fd.append("UserName", userName);
        fd.append("NameND", formData.nameND || "");
        fd.append("GioiTinh", String(formData.gioiTinh ?? 0));
        fd.append("MoTa", formData.moTa || "");
        fd.append("PhoneNumber", formData.phoneNumber || "");

        if (formData.avatarND instanceof File) {
            fd.append("AvatarND", formData.avatarND);
        }

        const result = await authServices.UpdateUserInfo(fd);
        if (!result) {
            window.alert("Cập nhật Không Thành Công!");
            return;
        }
        window.alert("Cập nhật thành công!");
    };

    return (
        <div className="profile-content">
            <h2 className="profile-title">Thông Tin Tài Khoản</h2>

            <form className="profile-form" onSubmit={HandleSubmit} encType="multipart/form-data">
                <input type="hidden" name="userName" value={formData.userName} />

                <label>Email</label>
                <input type="email" name="email" value={formData.email} disabled />

                <label>Số điện thoại</label>
                <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={HandleChange}
                />

                <label>Tên</label>
                <input
                    type="text"
                    name="nameND"
                    placeholder="Bạn hãy nhập tên bản thân mình ..."
                    value={formData.nameND}
                    onChange={HandleChange}
                />

                <label>Giới tính</label>

                <div className="gender-options">
                    <label className="gender-item">
                        <input
                            type="radio"
                            name="gioiTinh"
                            value={1}
                            checked={formData.gioiTinh === 1}
                            onChange={HandleChange}
                        />
                        <span>Nam</span>
                    </label>

                    <label className="gender-item">
                        <input
                            type="radio"
                            name="gioiTinh"
                            value={2}
                            checked={formData.gioiTinh === 2}
                            onChange={HandleChange}
                        />
                        <span>Nữ</span>
                    </label>

                    <label className="gender-item">
                        <input
                            type="radio"
                            name="gioiTinh"
                            value={0}
                            checked={formData.gioiTinh === 0}
                            onChange={HandleChange}
                        />
                        <span>Không xác định</span>
                    </label>
                </div>

                <label>Mô tả bản thân</label>
                <textarea
                    rows="6"
                    cols="50"
                    placeholder="Bạn hãy nhập mô tả bản thân mình ..."
                    name="moTa"
                    value={formData.moTa}
                    onChange={HandleChange}
                />

                <label>Avatar</label>
                <input type="file" name="avatarND" onChange={HandleChange} />

                <button type="submit" className="btn-update">CẬP NHẬT</button>
            </form>
        </div>
    );
}

export default ProfileContent;