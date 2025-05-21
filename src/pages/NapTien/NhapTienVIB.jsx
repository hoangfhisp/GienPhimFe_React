import React, { useState } from 'react';
import LoginContainer from '../../components/Login-container/Login-container';
import { Link, useNavigate } from 'react-router-dom';
import * as AuthenticationService from "../../services/Admin/AuthenticationService";

import '../../components/Login-container/Login.scss';
import NotePayMent from '../../components/Commons/NotePayment';

export default function NhapTienVIB() {
    const [soTien, setSoTien] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!soTien || isNaN(soTien) || Number(soTien) <= 0) {
            setError('Vui lòng nhập số tiền hợp lệ.');
            return;
        }

        try {
            const napTienDto = { soTien: Number(soTien) };
            const result = await AuthenticationService.taoGiaoDich(napTienDto);

            // Xử lý sau khi tạo giao dịch thành công
            console.log("Giao dịch thành công:", result);

            // Ví dụ điều hướng sang trang hướng dẫn chuyển khoản:
            navigate('/HuongDanChuyenKhoan', { state: { giaoDich: result } });
        } catch (err) {
            setError('Có lỗi xảy ra khi tạo giao dịch. Vui lòng thử lại sau.');
        }
    };

    return (
        <div className="login-container">
            <LoginContainer />
            <div class="trogiup-body">
                <div class="login-form-container">
                    <div class="login-title">
                        <h4 style={{ textAlign: 'center', fontSize: '28px', color: 'white' }}>
                            Tài Khoản Ngân Hàng VIB
                        </h4>
                        <NotePayMent/>
                        <form onSubmit={handleSubmit} className="payment-form" style={{ marginTop: '24px' }}>
                            <div className="input-group">
                                <input
                                    type="number"
                                    className="amount-input"
                                    placeholder="Nhập số tiền cần nạp"
                                    value={soTien}
                                    onChange={(e) => setSoTien(e.target.value)}
                                    required
                                />
                                <span className="currency">VNĐ</span>
                            </div>
                            {error && <div className="text-danger" style={{ color: 'red', marginTop: '4px' }}>{error}</div>}
                            <button type="submit" className="submit-btn">Nạp tiền</button>
                        </form>
                        <div class="back-link-container">
                            <Link to="/PhuongThucNapTien" className="back-link">
                                <i className="fas fa-arrow-left"></i> Trở về
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}