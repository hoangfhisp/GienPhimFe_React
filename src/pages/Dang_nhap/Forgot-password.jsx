import React, { useState } from 'react';
import LoginContainer from '../../components/Login-container/Login-container';
import { Link } from 'react-router-dom';
import '../../components/Login-container/Login.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validate
    if (!email) {
      setError('Email không được để trống.');
      return;
    }

    // Gửi email reset (giả lập)
    console.log('Gửi email reset mật khẩu cho:', email);
    setError(''); // Clear error nếu có
    alert('Yêu cầu đổi mật khẩu đã được gửi nếu email tồn tại trong hệ thống.');
  };

  return (
    <div className="login-container">
      <LoginContainer />
        <div className="login-body">
            <div className="login-form-container">
            <div className="login-form-header">
                <h4 style={{ textAlign: 'center' }}>Quên / Đổi mật khẩu</h4>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
                {/* Hiển thị lỗi nếu có */}
                {error && <div className="text-danger" role="alert">{error}</div>}

                {/* Email input */}
                <input
                type="email"
                className="login-form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                placeholder="name@example.com"
                required
                />

                <button type="submit" className="login-form-button">
                Lấy / Đổi Mật Khẩu
                </button>

                <div className="login-form-help">
                <Link to="/help" className="help-link">Cần trợ giúp?</Link>
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
