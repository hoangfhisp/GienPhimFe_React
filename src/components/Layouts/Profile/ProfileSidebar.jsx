import { Link } from "react-router-dom";
import logouser from "../../../assets/img/avatar.png";
import * as format from "../../../untils/Format";
import "./Profile.scss";
function ProfileSidebar({ dataU, walletData }) {
    const u = dataU?.data ?? dataU;
    const w = walletData?.data ?? walletData;

    return (
        <div className="profile-sidebar">
            <img
                src={u?.avatarND ? format.formatURLImage(u.avatarND) : logouser}
                alt="Avatar"
                className="avatar"
            />

            <h2
                className="lable-username"
                style={{ color: "#fff", fontWeight: 700 }}
            >
                {u?.nameND ? u.nameND : "Tên chưa cập nhật"}
            </h2>

            <p className="join-date">
                Tham Gia: <br /> {format.formatDateTime(u?.thoiGianTao || 0)}
            </p>

            <div className="btn-update">
                <Link to={"/forgot-password"}>Đổi Mật Khẩu Mới</Link>
            </div>

            <p className="join-date">
                Số Dư: {format.formatVND(w?.soDu || 0)}
            </p>
        </div>
    );
}

export default ProfileSidebar;