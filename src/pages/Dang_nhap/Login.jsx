import React, { useState } from 'react';
import LoginContainer from '../../components/Login-container/Login-container';
import { Link } from 'react-router-dom';
import '../../components/Login-container/Login.scss';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Remember Me:', rememberMe);
  };

  return (
    <div className="login-container">
      <LoginContainer />

      <div className="login-body">
        <div className="login-form-container">
          <div className="login-form-header">
            <h4 style={{ textAlign: 'center' }}>Đăng nhập</h4>
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
            {/* Error message cho Password */}
            {/* (Ở đây bạn có thể thêm logic để hiển thị thông báo lỗi nếu cần) */}

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