import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as AuthenticationService from "../../services/Admin/AuthenticationService";
import LoginContainer from '../../components/Login-container/Login-container';
import '../../components/Login-container/Login.scss';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const email = queryParams.get('email');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Kiểm tra nếu không có token hoặc email trong URL
        if (!token || !email) {
            setError('Thông tin không hợp lệ hoặc thiếu.');
        }
    }, [token, email]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra nếu mật khẩu hoặc xác nhận mật khẩu không hợp lệ
        if (!newPassword || !confirmPassword) {
            setError('Mật khẩu không được để trống.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu mới và xác nhận mật khẩu không trùng khớp.');
            return;
        }

        setError('');
        setSuccessMessage('');

        try {
            // Gọi API reset password từ service
            const response = await AuthenticationService.resetPassword(token, email, newPassword);
            setSuccessMessage(response.message || 'Mật khẩu đã được thay đổi thành công.');

            // Redirect về trang login sau khi reset thành công
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <div className="login-container">
            <LoginContainer />
            <div className="login-body">
                <div className="login-form-container">
                    <div className="login-title">
                        <h4 style={{ textAlign: 'center' }}>Đổi lại mật khẩu</h4>
                    </div>

                    <form className="login-form" id="changePasswordForm" onSubmit={handleSubmit}>
                        {/* Hiển thị lỗi nếu có */}
                        {error && <div className="text-danger" role="alert">{error}</div>}

                        {/* Hiển thị thông báo thành công nếu có */}
                        {successMessage && <div className="text-success" role="alert">{successMessage}</div>}

                        {/* Mật khẩu mới */}
                        <div className="form-group">
                            <input
                                type="password"
                                className={`login-form-input ${newPassword ? 'filled' : ''}`}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                autoComplete="off"
                                required
                            />
                            <label className="floating-label">Mật khẩu mới</label>
                        </div>

                        {/* Xác nhận mật khẩu */}
                        <div className="form-group">
                            <input
                                type="password"
                                className={`login-form-input ${confirmPassword ? 'filled' : ''}`}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="off"
                                required
                            />
                            <label className="floating-label">Xác nhận mật khẩu</label>
                        </div>

                        {/* Nút submit */}
                        <button type="submit" className="login-form-button">
                            Thay đổi mật khẩu
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
