import { Link } from 'react-router-dom';

import logouser from '../../../assets/img/avatar.png';
import * as format from '../../../untils/Format';


function ProfileSidebar({dataU}){

    return(
        <div className="profile-sidebar">
            <img src={dataU?.avatarND ? format.formatURLImage(dataU?.avatarND) : logouser} alt="Avatar" className ="avatar" />
                <h2 className="lable-username">{dataU?.nameND ? dataU?.nameND : "Tên chưa cập nhật"}</h2>
                <p className="join-date">Tham Gia: <br /> {format.formatDateTime(dataU?.thoiGianTao || 0)}</p>
            <div className="btn-update">
                <Link to={"/forgot-password"} >Đổi Mật Khẩu Mới</Link>
            </div>
                <p className="join-date">Số Dư: {format.formatVND(dataU.soDuTaiKhoan || 0)}</p>
        </div>
    );
}

export default ProfileSidebar;