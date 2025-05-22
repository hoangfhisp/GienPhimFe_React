import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import NotePayMent from "../../Commons/NotePayment";
import * as authServices from "../../../services/Admin/AuthenticationService.jsx"


function ThanhToan({ children, phuongthuc }) {
    const [soTienNap, setSoTienNap] = useState();
    const [moTaNap, setMoTaNap] = useState("");
    const [error, setError] = useState('');
    const [urlPayment, setUrlPayment] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event) => {

        event.preventDefault();

        if (soTienNap < 5000) {
            window.alert("Số tiền không được nhỏ hơn 5.000 VNĐ");
            return
        }

        const fetchApiPaymentVnPay = async () => {
            const result = await authServices.CreatePaymentVnPay(soTienNap, moTaNap);
            setUrlPayment(result.data);
            handleOpenUrl(result.data);
        }

        const fetchApiPaymentVIB = async () => {
            try {
                const napTienDto = { SoTien: Number(soTienNap) };
                const result = await authServices.taoGiaoDich(napTienDto);

                console.log("Kết quả trả về từ API:", result);

                if (result && result.giaoDichId) {
                    console.log("Giao dịch thành công với ID:", result.giaoDichId);
                    navigate('/TaoGiaoDichVIB', { state: { giaoDich: result } });
                } else {
                    setError("Không nhận được thông tin giao dịch.");
                }
            } catch (err) {
                console.error("Lỗi khi tạo giao dịch:", err);
                setError("Có lỗi xảy ra khi tạo giao dịch.");
            }
        };

        const fetchApiPaymentMomo = async () => {
            try {
                const napTienDto = {
                    SoTien: Number(soTienNap), // Cần kiểm tra giá trị này
                    MoTa: moTaNap
                };

                console.log("Dữ liệu gửi đến API:", napTienDto);

                const result = await authServices.taoGiaoDichMomo(napTienDto);
                console.log("Kết quả từ API:", result); // Thêm dòng này để debug

                if (result?.data?.PayUrl) {
                    handleOpenUrl(result.data.PayUrl);
                } else {
                    setError("Không nhận được URL thanh toán MoMo.");
                }
            } catch (err) {
                console.error("Chi tiết lỗi:", { // Log chi tiết hơn
                    message: err.message,
                    response: err.response,
                    stack: err.stack
                });
                setError(err.response?.data || err.message);
            }
        };

        if (phuongthuc === "vnpay")
            fetchApiPaymentVnPay();

        else if (phuongthuc === "vib")
            fetchApiPaymentVIB();

        else if (phuongthuc === "momo")
            fetchApiPaymentMomo();

    }

    const handleOpenUrl = (url) => {
        window.open(`${url}`, "_blank");
    }

    return (
        <div class="trogiup-body">
            <div class="login-form-container">
                <div class="login-title">
                    <h4 style={{ textAlign: 'center', fontSize: '28px', color: 'white' }}>
                        {children}
                    </h4>
                    <NotePayMent />
                    <form onSubmit={handleSubmit} className="payment-form" style={{ marginTop: '24px' }}>
                        {phuongthuc === "vnpay" && <>
                            <InPutInfoPaymMent isrequired type={"number"} onChange={(e) => setSoTienNap(e.target.value)} goiy={"Nhập số tiền cần nạp"}>VNĐ</InPutInfoPaymMent>
                            <InPutInfoPaymMent isrequired type={"text"} onChange={(e) => setMoTaNap(e.target.value)} goiy={"Bạn hãy nhập mô tả đơn hàng"}></InPutInfoPaymMent></>}

                        {phuongthuc === "vib" &&
                            <InPutInfoPaymMent isrequired type={"number"} onChange={(e) => setSoTienNap(e.target.value)} goiy={"Nhập số tiền cần nạp"}>VNĐ</InPutInfoPaymMent>}

                        {phuongthuc === "momo" &&
                            <InPutInfoPaymMent isrequired type={"number"} onChange={(e) => setSoTienNap(e.target.value)} goiy={"Nhập số tiền cần nạp"}>VNĐ</InPutInfoPaymMent>}

                        <button type="submit" className="submit-btn">Nạp tiền</button>
                    </form>
                    <div class="back-link-container">
                        <Link to="/NapTien/Home" className="back-link">
                            <i className="fas fa-arrow-left"></i> Trở về
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InPutInfoPaymMent({ type, goiy, result, onChange, children, isrequired }) {
    return (
        <div className="input-group">
            <input
                type={type}
                className="amount-input"
                placeholder={goiy}
                value={result}
                onChange={onChange}
                required={isrequired}
            />
            <span className="currency">{children}</span>
        </div>
    );
}


export default ThanhToan;