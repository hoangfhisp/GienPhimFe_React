import { useEffect, useState } from "react";


function ProfileContent({dataU}) {


    return (
        <div className="profile-content">
            <h2 className="profile-title">Thông Tin Tài Khoản</h2>
            <form className="profile-form"  encType="multipart/form-data">
                <input type="hidden" name="id" value={dataU[0]?.id} />

                <label>Email</label>
                <input type="email" name="email" value={dataU[0]?.email}  disabled />

                <label>Tài khoản</label>
                <input type="text" name="userName" value={dataU[0]?.userName} disabled />

                <label>Số điện thoại</label>
                <input type="tel" name="phoneNumber" value={dataU[0]?.phoneNumber} disabled />

                <label>Tên</label>
                <input type="text" name="nameND" placeholder="Nhập tên" value={dataU[0]?.nameND} />

                <label>Giới tính</label>
                <div className="gender-options">
                    <input type="radio" name="gioiTinh" id="male" value="1" checked = {dataU[0]?.gioiTinh === 1} />
                    <label htmlFor="male">Nam</label>

                    <input type="radio" name="gioiTinh" id="female" value="2" checked = {dataU[0]?.gioiTinh === 2} />
                    <label htmlFor="female">Nữ</label>

                    <input type="radio" name="gioiTinh" id="other" value="0" checked = {dataU[0]?.gioiTinh === 0} />
                    <label htmlFor="other">Không xác định</label>
                </div>

                <label>Avatar</label>
                <input type="file" name="avatarND"  />

                <button type="submit" className="btn-update">CẬP NHẬT</button>
            </form>
        </div>
    );
}

export default ProfileContent;