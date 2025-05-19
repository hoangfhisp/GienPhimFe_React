import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import logouser from '../../../assets/img/avatar.png';
import dayjs from 'dayjs';


function ProfileSidebar({dataU}){

    return(
        <div className="profile-sidebar">
            <img src={logouser} alt="Avatar" className ="avatar" />
                <h2 className="lable-username">{dataU[0]?.nameND ? dataU[0]?.nameND : "Tên chưa cập nhật"}</h2>
                <p className="join-date">Tham Gia: <br /> {dayjs(dataU[0]?.thoiGianTao).format("DD/MM/YYYY HH:mm:ss")}</p>
            <div className="btn-update">
                <Link to={"/forgot-password"} >Đổi Mật Khẩu Mới</Link>
            </div>
        </div>
    );
}

export default ProfileSidebar;