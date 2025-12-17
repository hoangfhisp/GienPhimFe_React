import React, { useState } from 'react';
import LoginContainer from '../../components/Login-container/Login-container';
import { Link, useNavigate } from 'react-router-dom';
import * as AuthenticationService from "../../services/Admin/AuthenticationService";
import '../../components/Login-container/Login.scss';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Để lưu thông báo lỗi khi đăng nhập không thành công
    const navigate = useNavigate(); // Dùng useNavigate để điều hướng

    const handleSubmit = async (event) => {
        event.preventDefault(); // Ngừng hành động mặc định của form


        try {
            // Gọi API đăng nhập từ service
            const result = await AuthenticationService.login(email,password);

            // Kiểm tra kết quả trả về từ API
            if (result.status) {
                // Lưu token vào localStorage khi đăng nhập thành công
                localStorage.setItem('token', result.data.token);
                localStorage.setItem('rf_token', result.data.refreshToken);

                navigate('/Home');
            } else {
                setErrorMessage(result.msg);
            }
        } catch (error) {
            setErrorMessage(error.message || 'Đã có lỗi xảy ra, vui lòng thử lại');
        }
    };

    return (
        <div className="login-container">
            <LoginContainer />

            <div className="login-body">
                <div className="login-form-container">
                    <div className="login-title">
                        <h4 style={{ textAlign: 'center', fontSize: "40px" }}>Đăng Nhập</h4>
                    </div>

                    <form className="login-form" id="account" onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="form-group">
                            <input
                                type="email"
                                className={`login-form-input ${email ? 'filled' : ''}`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label className="floating-label">Tên Đăng Nhập</label>
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <input
                                type="password"
                                className={`login-form-input ${password ? 'filled' : ''}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label className="floating-label">Mật khẩu</label>
                        </div>

                        {/* Hiển thị thông báo lỗi nếu có */}
                        {errorMessage && <div className="login-error-message">{errorMessage}</div>}

                        {/* Nút submit */}
                        <button id="login-submit" type="submit" className="login-form-button">
                            Đăng Nhập
                        </button>

                        {/* Liên kết quên mật khẩu */}
                        <Link to="/forgot-password" className="forgot-password-link" id="forgot-password">
                            Bạn Quên Mật Khẩu?
                        </Link>

                        <div className="login-form-help">
                            <div className="login-form-rememberMe">
                                <label className="remember-lbl">
                                    <input
                                        className="remberMe-cbx"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
                                    />
                                    Nhớ Tôi
                                </label>
                            </div>
                            <Link to="/help" className="help-link">
                                Cần Trợ Giúp?
                            </Link>
                        </div>
                    </form>

                    <div className="login-form-other">
                        {/* Đăng nhập với số điện thoại */}
                        <Link to="/login-phone" className="login-form-button login-phone-button">
                            <i className="fas fa-phone-alt"></i>
                            <span className="login-phone-text">Đăng Nhập Với Số Điện Thoại</span>
                        </Link>

                        {/* Đăng nhập với Email */}
                        <Link to="/login-email" className="login-form-button login-email-button">
                            <i className="fas fa-envelope"></i>
                            <span className="login-email-text">Đăng Nhập Với Email</span>
                        </Link>

                        <div className="login-form-signupnow">
                            Mới sử dụng GIENPHIM?
                            <Link to="/register" className="login-form-signupnow-link">
                                Đăng Ký Ngay.
                            </Link>
                        </div>

                        <div className="login-term">
                            <p>Trang này được bảo vệ bởi Google reCAPTCHA để đảm bảo bạn không phải là bot.</p>
                            <a href="https://www.google.com/recaptcha" target="_blank" rel="noopener noreferrer">
                                Tìm Hiểu Thêm.
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
