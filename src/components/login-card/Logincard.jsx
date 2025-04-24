import React, { useState } from 'react';
import './login-card.scss';  // Import file CSS vào đây

const LoginCard = () => {
    // State quản lý giá trị input của form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    // Hàm gửi form
    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý đăng nhập tại đây
        // Giả sử chúng ta sẽ gọi API đăng nhập và kiểm tra email, password
        console.log({ email, password, rememberMe });

        // Ví dụ nếu có lỗi:
        // setError('Đăng nhập không thành công!');
    };

    return (
        <div className="login-card">
            <form className="login-form" onSubmit={handleSubmit}>
                {/* Input Email */}
                <input
                    type="email"
                    className="login-form-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {error && <span className="text-danger">{error}</span>}

                {/* Input Password */}
                <input
                    type="password"
                    className="login-form-input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <span className="text-danger">{error}</span>}

                {/* Button Submit */}
                <button type="submit" className="login-form-button">
                    Đăng nhập
                </button>

                {/* Forgot Password Link */}
                <a href="/forgot-password" className="forgot-password-link">
                    Bạn quên mật khẩu?
                </a>

                <div className="login-form-help">
                    {/* Remember Me Checkbox */}
                    <div className="login-form-rememberMe">
                        <label className="remember-lbl">
                            <input
                                type="checkbox"
                                className="remberMe-cbx"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            Ghi nhớ tôi
                        </label>
                    </div>
                    {/* Help Link */}
                    <a href="/help" className="help-link">Cần trợ giúp?</a>
                </div>
            </form>

            <div className="login-form-other">
                {/* Login with Phone */}
                <a href="/login-phone" className="login-form-button login-phone-button">
                    <i className="fas fa-phone-alt"></i>
                    <span className="login-phone-text">Đăng nhập với số điện thoại</span>
                </a>

                {/* Login with Email */}
                <a href="/login-email" className="login-form-button login-email-button">
                    <i className="fas fa-envelope"></i>
                    <span className="login-email-text">Đăng nhập với Email</span>
                </a>

                <div className="login-form-signupnow">
                    Mới sử dụng GIENPHIM?
                    <a href="/register" className="login-form-signupnow-link">
                        Đăng ký ngay.
                    </a>
                </div>

                <div className="login-term">
                    <p>
                        Trang này được bảo vệ bởi Google reCAPTCHA để đảm bảo bạn không phải là bot.
                    </p>
                    <a href="https://www.google.com/recaptcha">Tìm hiểu thêm.</a>
                </div>
            </div>
        </div>
    );
}

export default LoginCard;