import React, { useState } from 'react';
import LoginContainer from '../../components/Login-container/Login-container';
import { Link } from 'react-router-dom';
import '../../components/Login-container/Login.scss';
import * as AuthenticationService from "../../services/Admin/AuthenticationService";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple validate
        if (!email) {
            setError('Email không được để trống.');
            return;
        }

        setError(''); // Clear any previous error messages
        setSuccessMessage(''); // Clear any previous success messages

        try {
            // Gọi API forgotPassword từ service
            const response = await AuthenticationService.forgotPassword(email);
            // Khi thành công, hiển thị thông báo thành công
            setSuccessMessage(response.message || 'Yêu cầu đổi mật khẩu đã được gửi.');
        } catch (err) {
            // Nếu có lỗi, hiển thị thông báo lỗi
            setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <div className="login-container">
            <LoginContainer />
            <div className="login-body">
                <div className="login-form-container">
                    <div className="login-title">
                        <h3 style={{ textAlign: 'center' }}>Quên / Đổi mật khẩu</h3>
                    </div>

                    <form className="login-form" id="passwordResetForm" onSubmit={handleSubmit}>
                        {/* Hiển thị lỗi nếu có */}
                        {error && <div className="text-danger" role="alert">{error}</div>}

                        {/* Hiển thị thông báo thành công nếu có */}
                        {successMessage && <div className="text-success" role="alert">{successMessage}</div>}

                        {/* Email input */}
                        <div className="form-group">
                            <input
                                type="email"
                                className={`login-form-input ${email ? 'filled' : ''}`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="username"
                                required
                            />
                            <label className="floating-label">name@example.com</label>
                        </div>

                        {/* Nút submit */}
                        <button type="submit" className="login-form-button">
                            Lấy / Đổi Mật Khẩu
                        </button>

                        {/* Liên kết trợ giúp */}
                        <div className="login-form-help">
                            <Link to="/help" className="help-link">Cần Trợ Giúp?</Link>
                        </div>
                    </form>

                    <div className="login-form-other">
                        <div className="login-form-signupnow">
                            Mới sử dụng GIENPHIM?
                            <Link to="/register" className="login-form-signupnow-link">Đăng ký ngay.</Link>
                        </div>

                        <div className="login-term">
                            <p>Trang này được bảo vệ bởi Google reCAPTCHA để đảm bảo bạn không phải là bot.</p>
                            <a href="https://www.google.com/recaptcha" target="_blank" rel="noreferrer">
                                Tìm hiểu thêm.
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
