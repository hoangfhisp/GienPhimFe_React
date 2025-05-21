
import LoginContainer from '../../components/Login-container/Login-container';


import '../../components/Login-container/Login.scss';
import ThanhToan from "../../components/Layouts/PhuongThucThanhToan/ThanhToan.jsx"
import PhuongThucThanhToan from '../../components/Layouts/PhuongThucThanhToan/PhuongThucThanhToan';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function () {
    const{phuongthuc} = useParams();
    const[typePayment,setTypePayment] = useState("");

    useEffect(() => {
        setTypePayment(phuongthuc.toLowerCase());
    },[phuongthuc])

    console.log(phuongthuc);
    return (
        <div className="login-container">
            <LoginContainer />
            {typePayment === "home" && <PhuongThucThanhToan/>}
            {typePayment === "vnpay" && <ThanhToan>Thanh toán bằng tài khoản VNPay</ThanhToan>}
        </div>
    );
}
