import React, { useState } from 'react';
import LoginContainer from '../../components/Login-container/Login-container';
import { Link } from 'react-router-dom';
import '../../components/Login-container/Login.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!email) newErrors.email = 'Email không được để trống.';
    if (!phoneNumber) newErrors.phoneNumber = 'Số điện thoại không được để trống.';
    if (!password) newErrors.password = 'Mật khẩu không được để trống.';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    if (!agree) newErrors.agree = 'Bạn cần đồng ý với điều khoản.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Gửi dữ liệu đăng ký
      console.log({ email, phoneNumber, password, confirmPassword });
    }
  };

  return (
    <div className="login-container">
      <LoginContainer />
        <div className="login-body">
            <div className="login-form-container">
                <div className="login-form-header">
                <h4 style={{ textAlign: 'center' }}>Đăng ký tài khoản</h4>
                </div>

                <form className="login-form" id="registerForm" onSubmit={handleSubmit}>
                {/* Email */}
                <input
                    type="email"
                    className="login-form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    placeholder="name@example.com"
                    required
                />
                {errors.email && <span className="text-danger">{errors.email}</span>}

                {/* Số điện thoại */}
                <input
                    type="tel"
                    className="login-form-input"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    autoComplete="tel"
                    placeholder="phone number"
                    required
                />
                {errors.phoneNumber && <span className="text-danger">{errors.phoneNumber}</span>}

                {/* Mật khẩu */}
                <input
                    type="password"
                    className="login-form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="password"
                    required
                />
                {errors.password && <span className="text-danger">{errors.password}</span>}

                {/* Xác nhận mật khẩu */}
                <input
                    type="password"
                    className="login-form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="password"
                    required
                />
                {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword}</span>}

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

                <button id="registerSubmit" type="submit" className="login-form-button">
                    Đăng Ký
                </button>
                </form>

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

export default Register;
