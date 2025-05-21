import React, { useState } from 'react';
import LoginContainer from './src/components/Login-container/Login-container';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as AuthenticationService from "./src/services/Admin/AuthenticationService";
import '../../components/Login-container/Login.scss';

export default function TaoGiaoDichVIB() {
    const navigate = useNavigate();
    const location = useLocation();
    const giaoDich = location.state?.giaoDich;

    const [loading, setLoading] = useState(!giaoDich?.maQRBase64);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleHuyGiaoDich = async () => {
        try {
            await AuthenticationService.huyGiaoDich();
            navigate('/PhuongThucNapTien'); // Quay lại bước chọn phương thức
        } catch (err) {
            setErrorMsg("Không thể huỷ giao dịch. Vui lòng thử lại.");
        }
    };

    const handleXacNhan = async () => {
        try {
            const result = await AuthenticationService.xacNhanChuyenTien();
            setSuccessMsg("Xác nhận chuyển tiền thành công.");
            // Optional: chuyển đến trang cảm ơn hoặc reload
        } catch (err) {
            setErrorMsg("Không thể xác nhận giao dịch. Vui lòng thử lại.");
        }
    };

    return (
        <div className="login-container">
            <LoginContainer />
            <div className="trogiup-body">
                <div className="login-form-container">
                    <div className="login-title">
                        <h4 style={{ textAlign: 'center', fontSize: '28px', color: 'white' }}>
                            Chờ Thanh Toán
                        </h4>
                    </div>

                    <div className="trogiup-question">
                        <div className="qr-section">
                            <div className="qr-container">
                                {loading ? (
                                    <p>Đang tạo giao dịch...</p>
                                ) : (
                                    <img src={giaoDich.maQRBase64} alt="QR Code" className="qr-code" />
                                )}
                            </div>

                            {giaoDich ? (
                                <div className="transaction-info">
                                    <p className="transaction-label">
                                        <strong>Tên ngân hàng:</strong>
                                        <span className="transaction-value">{giaoDich.tenNganHang}</span>
                                    </p>
                                    <p className="transaction-label">
                                        <strong>Số tài khoản:</strong>
                                        <span className="transaction-value">{giaoDich.soTaiKhoan}</span>
                                    </p>
                                    <p className="transaction-label">
                                        <strong>Tên tài khoản:</strong>
                                        <span className="transaction-value">{giaoDich.tenChuTaiKhoan}</span>
                                    </p>
                                    <p className="transaction-label">
                                        <strong>Số tiền:</strong>
                                        <span className="transaction-value">{Number(giaoDich.soTien).toLocaleString()} VNĐ</span>
                                    </p>
                                    <p className="transaction-label">
                                        <strong>Thời gian:</strong>
                                        <span className="transaction-value">
                                            {new Date(giaoDich.thoiGianGD).toLocaleString('vi-VN')}
                                        </span>
                                    </p>
                                </div>
                            ) : (
                                <p style={{ color: 'red' }}>Không tìm thấy thông tin giao dịch.</p>
                            )}

                            <div className="transaction-buttons">
                                <div className="button-container">
                                    <button onClick={handleHuyGiaoDich} className="submit-GiaoDich-btn cancel-GiaoDich-btn">
                                        Huỷ giao dịch
                                    </button>
                                    <button onClick={handleXacNhan} className="submit-GiaoDich-btn confirm-GiaoDich-btn">
                                        Xác nhận đã chuyển tiền
                                    </button>
                                </div>

                                {successMsg && (
                                    <div className="alert alert-success">{successMsg}</div>
                                )}
                                {errorMsg && (
                                    <div className="alert alert-danger">{errorMsg}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}