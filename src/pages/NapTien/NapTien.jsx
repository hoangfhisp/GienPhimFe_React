
import LoginContainer from '../../components/Login-container/Login-container';


import '../../components/Login-container/Login.scss';
import ThanhToan from "../../components/Layouts/PhuongThucThanhToan/ThanhToan.jsx"
import PhuongThucThanhToan from '../../components/Layouts/PhuongThucThanhToan/PhuongThucThanhToan';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function () {
    const { phuongthuc } = useParams();
    const [typePayment, setTypePayment] = useState("");

    useEffect(() => {
        setTypePayment(phuongthuc.toLowerCase());
    }, [phuongthuc])

    console.log(phuongthuc);
    return (
        <div className="login-container">
            <LoginContainer />
            {typePayment === "home" && <PhuongThucThanhToan/>}
            {typePayment === "vnpay" && <ThanhToan phuongthuc={typePayment}>Thanh toán bằng ví điện tử VNPay</ThanhToan>}
            {typePayment === "vib" && <ThanhToan phuongthuc={typePayment}>Thanh toán bằng tài khoản VIB</ThanhToan>}
            {typePayment === "momo" && <ThanhToan phuongthuc={typePayment}>Thanh toán bằng ví điện tử Momo</ThanhToan>}
        </div>
    );
}
