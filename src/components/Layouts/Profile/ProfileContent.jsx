
import { useEffect, useState } from "react";

import * as authServices from "../../../services/Admin/AuthenticationService.jsx"

function ProfileContent({dataU}) {

    const[formData,setFormData] = useState({
        id: "",
        email: "",
        phoneNumber: "",
        nameND: "",
        gioiTinh: 0,
        moTa: "",
        avatarND: null
    })

    useEffect(() => {
        if(dataU == null)
            return;

        setFormData({
            id: dataU.id || "",
            email: dataU.email || "",
            phoneNumber: dataU?.phoneNumber || "",
            nameND: dataU?.nameND || "",
            gioiTinh: dataU?.gioiTinh || 0,
            moTa: dataU?.moTa || "",
            avatarND: null
        });


    },[dataU])

    // Handle để nhập dữ liêu input
    const HandleChange = (e) => {
        const {name,value, type, files} = e.target; // lấy giá trị 
        
        setFormData((prev) => ({ // prev giá trị hiện tại của state 
            ...prev, //  giử nguyên giá trị không thay đổi
            [name]: type === "file" ? files[0] : name === "gioiTinh"
                ? parseInt(value)
                : value,  // Cập nhật duy nhất thuộc tính "name" có giá trị input thay đổi
        }));

    }

    // Handle để gửi submit thay đổi lên sever
    const HandleSubmit = (e) => {
         // evernt giúp khi ấn submit không bị load lại trang

        const fomdata = new FormData();
        fomdata.append("id",formData.id)
        fomdata.append("nameND",formData.nameND)
        fomdata.append("gioiTinh",formData.gioiTinh)
        fomdata.append("moTa",formData.moTa)
        fomdata.append("avatarND",formData.avatarND)
        fomdata.append("phoneNumber",formData.phoneNumber)

        const fetchApiUpdate = async () => {
            var result = await authServices.UpdateUserInfo(fomdata);
            if(result == null){
                window.alert("Cập nhật Không Thành Công!");
                return;
            }else{
                window.alert("Cập nhật thành công!");
            }
        }
        
        fetchApiUpdate();
        
        
    }



    return (
        <div className="profile-content">
            <h2 className="profile-title">Thông Tin Tài Khoản</h2>
            <form className="profile-form" onSubmit={HandleSubmit} encType="multipart/form-data">
                <input type="hidden" name="id" value={formData.id} />

                <label>Email</label>
                <input type="email" name="email" value={formData.email}  disabled />

                <label>Số điện thoại</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} disabled />

                <label>Tên</label>
                <input type="text" name="nameND" placeholder="Bạn hãy nhập tên bản thân mình ..." value={formData.nameND} onChange={HandleChange} />

                <label>Giới tính</label>
                <div className="gender-options">
                    <input type="radio" name="gioiTinh" id="male" value={1} checked = {formData.gioiTinh === 1} onChange={HandleChange}/>
                    <label htmlFor="male">Nam</label>

                    <input type="radio" name="gioiTinh" id="female" value={2} checked = {formData.gioiTinh === 2} onChange={HandleChange}/>
                    <label htmlFor="female">Nữ</label>

                    <input type="radio" name="gioiTinh" id="other" value={0} checked = {formData.gioiTinh === 0} onChange={HandleChange}/>
                    <label htmlFor="other">Không xác định</label>
                </div>

                <label>Mô tả bản thân</label>
                <textarea rows="6" cols="50" placeholder="Bạn hãy nhập mô tả bản thân mình ..." name="moTa" value={formData.moTa} onChange={HandleChange} />

                <label>Avatar</label>
                <input type="file" name="avatarND" onChange={HandleChange} />

                <button type="submit" className="btn-update">CẬP NHẬT</button>
            </form>
        </div>
    );
}

export default ProfileContent;