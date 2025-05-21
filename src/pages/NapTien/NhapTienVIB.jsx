import React, { useState } from 'react';
import LoginContainer from '../../components/Login-container/Login-container';
import { Link, useNavigate } from 'react-router-dom';
import * as AuthenticationService from "../../services/Admin/AuthenticationService";
import '../../components/Login-container/Login.scss';

export default function NhapTienVIB() {
    const [soTien, setSoTien] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra số tiền hợp lệ
        if (!soTien || isNaN(soTien) || Number(soTien) <= 0) {
            setError('Vui lòng nhập số tiền hợp lệ.');
            return;
        }

        try {
            const napTienDto = { soTien: Number(soTien) };
            const result = await AuthenticationService.taoGiaoDich(napTienDto);

            // In dữ liệu trả về để kiểm tra
            console.log("Kết quả trả về từ API:", result);

            // Kiểm tra nếu result có đối tượng giaoDichId
            if (result && result.giaoDichId) {
                console.log("Giao dịch thành công với ID:", result.giaoDichId);
                navigate('/TaoGiaoDichVIB', { state: { giaoDich: result } });
            } else {
                setError("Không nhận được thông tin giao dịch.");
            }
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
                        <div class="note-container">
                            <div class="note-header">
                                <div class="note-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 20 20" fill="none">
                                        <path d="M10 8.333h.008m-.842 2.5h.833v3.334h.834" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M8.533 3.297 1.515 15.014A1.658 1.658 0 0 0 2.932 17.5h14.037a1.658 1.658 0 0 0 1.417-2.486l-7.02-11.717a1.658 1.658 0 0 0-2.833 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </div>
                                <h2 class="note-title">Lưu ý</h2>
                            </div>
                            <div class="note-body">
                                <p class="note-text">Vui lòng chuyển tới tài khoản ngân hàng của chúng tôi bằng Internet Banking hoặc Ví điện tử.</p>
                                <p class="note-text">Chi tiết chuyển khoản sẽ được hướng dẫn sau khi bạn xác nhận số tiền. Thời gian chuyển khoản tối đa 60 phút.</p>
                            </div>
                        </div>
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