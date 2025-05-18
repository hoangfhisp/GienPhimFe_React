import React, { useState } from 'react';
import LoginContainer from '../../components/Login-container/Login-container';
import { Link, useNavigate } from 'react-router-dom';  // Dùng useNavigate để chuyển hướng sau khi đăng ký thành công
import * as AuthenticationService from "../../services/Admin/AuthenticationService";
import '../../components/Login-container/Login.scss';

export default function Register() {
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agree, setAgree] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState(''); // Để lưu thông báo lỗi từ API khi đăng ký không thành công
    const navigate = useNavigate(); // Dùng navigate để chuyển hướng

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        // Kiểm tra các lỗi đầu vào
        if (!email) newErrors.email = 'Email không được để trống.';
        if (!phoneNumber) newErrors.phoneNumber = 'Số điện thoại không được để trống.';
        if (!password) newErrors.password = 'Mật khẩu không được để trống.';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
        if (!agree) newErrors.agree = 'Bạn cần đồng ý với điều khoản.';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // Gửi dữ liệu đăng ký nếu không có lỗi
            const userData = { email, phoneNumber, password };

            try {
                const response = await AuthenticationService.register(userData); // Gọi API đăng ký

                // Kiểm tra phản hồi từ API
                console.log('API Response:', response);

                if (response.status) {
                    // Đăng ký thành công, chuyển hướng đến trang đăng nhập
                    navigate('/login'); // Sử dụng navigate để chuyển hướng đến trang login
                } else {
                    // Nếu đăng ký thất bại, hiển thị thông báo lỗi
                    setErrorMessage(response.msg);
                }
            } catch (error) {
                console.error('Lỗi đăng ký:', error);
                setErrorMessage('Đã có lỗi xảy ra, vui lòng thử lại.');
            }
        }
    };

    return (
        <div className="login-container">
            <LoginContainer />

            <div className="login-body">
                <div className="login-form-container">
                    <div className="login-title">
                        <h4 style={{ textAlign: 'center' }}>Đăng ký tài khoản</h4>
                    </div>

                    <form className="login-form" id="registerForm" onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="form-group">
                            <input
                                type="email"
                                className={`login-form-input ${email ? 'filled' : ''}`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="username"
                                required
                            />
                            <label className="floating-label">Email</label>
                            {errors.email && <span className="text-danger">{errors.email}</span>}
                        </div>

                        {/* Số điện thoại */}
                        <div className="form-group">
                            <input
                                type="tel"
                                className={`login-form-input ${phoneNumber ? 'filled' : ''}`}
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                autoComplete="tel"
                                required
                            />
                            <label className="floating-label">Số điện thoại</label>
                            {errors.phoneNumber && <span className="text-danger">{errors.phoneNumber}</span>}
                        </div>

                        {/* Mật khẩu */}
                        <div className="form-group">
                            <input
                                type="password"
                                className={`login-form-input ${password ? 'filled' : ''}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="off"
                                required
                            />
                            <label className="floating-label">Mật khẩu</label>
                            {errors.password && <span className="text-danger">{errors.password}</span>}
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
                            {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword}</span>}
                        </div>

                        {/* Đồng ý điều khoản */}
                        <div className="login-form-help">
                            <div className="signup-form-agree">
                                <input
                                    type="checkbox"
                                    className="agree-cbx"
                                    id="agree_checkbox"
                                    checked={agree}
                                    onChange={() => setAgree(!agree)}
                                />
                                {errors.agree && <span className="text-danger">{errors.agree}</span>}
                                <label className="agree-lbl" htmlFor="agree_checkbox">
                                    Tôi đồng ý với{' '}
                                    <a href="https://policies.google.com/terms?hl=vi" target="_blank" rel="noreferrer">
                                        Điều khoản sử dụng
                                    </a>{' '}
                                    và{' '}
                                    <a href="https://policies.google.com/privacy?hl=vi" target="_blank" rel="noreferrer">
                                        Chính sách bảo mật
                                    </a>
                                </label>
                            </div>
                        </div>

                        {/* Nút đăng ký */}
                        <button id="registerSubmit" type="submit" className="login-form-button">
                            Đăng Ký
                        </button>
                    </form>


                    {/* Hiển thị thông báo lỗi từ API */}
                    {errorMessage && <div className="login-error-message">{errorMessage}</div>}

                    <div className="signup-form-other">
                        <div className="signup-form-login">
                            Đã có tài khoản?
                            <Link to="/login" className="signup-form-login-link">Đăng nhập ngay.</Link>
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
