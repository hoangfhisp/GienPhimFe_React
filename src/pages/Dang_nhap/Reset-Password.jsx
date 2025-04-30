import React, { useState } from 'react';
import LoginContainer from '../../components/Login-container/Login-container';
import { Link } from 'react-router-dom';
import '../../components/Login-container/Login.scss';


const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState(''); // Có thể lấy từ URL nếu cần
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation đơn giản
    if (!email || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    // Gửi dữ liệu đổi mật khẩu (giả lập)
    console.log('Đổi mật khẩu với:', { email, password, code });
    setError('');
    alert('Mật khẩu đã được đổi thành công!');
  };

  return (
    <div className="login-container">
      <LoginContainer />
        <div className="login-body">
            <div className="login-form-container">
                <div className="login-form-header">
                <h4 style={{ textAlign: 'center' }}>Đổi lại mật khẩu</h4>
                </div>
                <br />

                <form className="login-form" onSubmit={handleSubmit}>
                {error && <div className="text-danger" role="alert">{error}</div>}

                {/* Code ẩn nếu dùng */}
                <input type="hidden" value={code} onChange={(e) => setCode(e.target.value)} />

                {/* Email */}
                <input
                    type="email"
                    className="login-form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    placeholder="Nhập email"
                    required
                />

                {/* Mật khẩu */}
                <input
                    type="password"
                    className="login-form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Nhập mật khẩu."
                    required
                />

                {/* Xác nhận mật khẩu */}
                <input
                    type="password"
                    className="login-form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Xác nhận mật khẩu."
                    required
                />

                <button type="submit" className="login-form-button">Đổi mật khẩu</button>
                </form>

                <div className="login-form-other">
                <div className="login-term">
                    <p>Trang này được bảo vệ bởi Google reCAPTCHA để đảm bảo bạn không phải là bot.</p>
                    <a href="https://www.google.com/recaptcha" target="_blank" rel="noreferrer">Tìm hiểu thêm.</a>
                </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ResetPassword;
