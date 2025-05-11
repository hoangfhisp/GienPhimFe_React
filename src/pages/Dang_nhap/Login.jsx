import React, { useState } from 'react';
import LoginContainer from '../../components/Login-container/Login-container';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate thay vì useHistory
import { loginUser } from '../../services/User/UserService'; // Import hàm loginUser từ UserService
import '../../components/Login-container/Login.scss';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Để lưu thông báo lỗi khi đăng nhập không thành công
    const navigate = useNavigate(); // Thay vì useHistory, bạn sử dụng useNavigate để chuyển hướng

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Gọi hàm loginUser để đăng nhập
        const credentials = { email, password, rememberMe };
        try {
            const response = await loginUser(credentials);

            if (response.status) {
                // Đăng nhập thành công, chuyển hướng đến trang khác
                navigate('/Home'); // Sử dụng navigate thay vì history.push
            } else {
                // Nếu đăng nhập thất bại, hiển thị thông báo lỗi
                setErrorMessage(response.msg);
            }
        } catch (error) {
            console.error('Đăng nhập thất bại:', error);
            setErrorMessage('Đăng nhập thất bại, vui lòng thử lại!');
        }
    };

    return (
        <div className="login-container">
            <LoginContainer />

            <div className="login-body">
                <div className="login-form-container">
                    <div className="login-form-header">
                        <h4 style={{ textAlign: 'center', fontSize: "40px"}}>Đăng nhập</h4>
                    </div>

                    <form className="login-form" id="account" onSubmit={handleSubmit}>
                        {/* Input cho Email */}
                        <input
                            type="email"
                            className="login-form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="username"
                            placeholder="name@example.com"
                            required
                        />

                        <input
                            type="password"
                            className="login-form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            placeholder="password"
                            required
                        />
                        {/* Hiển thị thông báo lỗi nếu có */}
                        {errorMessage && <div className="login-error-message">{errorMessage}</div>}

                        {/* Nút submit */}
                        <button id="login-submit" type="submit" className="login-form-button">
                            Đăng nhập
                        </button>

                        {/* Liên kết quên mật khẩu */}
                        <Link to="/forgot-password" className="forgot-password-link" id="forgot-password">
                            Bạn quên mật khẩu?
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
                                    Nhớ tôi
                                </label>
                            </div>
                            <Link to="/help" className="help-link">
                                Cần trợ giúp?
                            </Link>
                        </div>
                    </form>

                    <div className="login-form-other">
                        {/* Đăng nhập với số điện thoại */}
                        <Link to="/login-phone" className="login-form-button login-phone-button">
                            <i className="fas fa-phone-alt"></i>
                            <span className="login-phone-text">Đăng nhập với số điện thoại</span>
                        </Link>

                        {/* Đăng nhập với Email */}
                        <Link to="/login-email" className="login-form-button login-email-button">
                            <i className="fas fa-envelope"></i>
                            <span className="login-email-text">Đăng nhập với Email</span>
                        </Link>

                        <div className="login-form-signupnow">
                            Mới sử dụng GIENPHIM?
                            <Link to="/register" className="login-form-signupnow-link">
                                Đăng ký ngay.
                            </Link>
                        </div>

                        <div className="login-term">
                            <p>Trang này được bảo vệ bởi Google reCAPTCHA để đảm bảo bạn không phải là bot.</p>
                            <a href="https://www.google.com/recaptcha" target="_blank" rel="noopener noreferrer">
                                Tìm hiểu thêm.
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
