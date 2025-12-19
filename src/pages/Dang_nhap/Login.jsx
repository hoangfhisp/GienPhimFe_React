import React, { useEffect, useRef, useState } from "react";
import LoginContainer from "../../components/Login-container/Login-container";
import { Link, useNavigate } from "react-router-dom";
import * as AuthenticationService from "../../services/Admin/AuthenticationService";
import "../../components/Login-container/Login.scss";
import { Bold } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // nơi render nút Google
    const googleBtnRef = useRef(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const result = await AuthenticationService.login(email, password);

            if (result?.status) {
                localStorage.setItem("token", result.data.token);
                localStorage.setItem("rf_token", result.data.refreshToken);
                navigate("/Home");
            } else {
                setErrorMessage(result?.msg || "Đăng nhập thất bại");
            }
        } catch (error) {
            setErrorMessage(error?.message || "Đã có lỗi xảy ra, vui lòng thử lại");
        }
    };

    useEffect(() => {
        const scriptId = "google-gsi-client";

        const initGoogle = () => {
            if (!window.google || !googleBtnRef.current) return;

            window.google.accounts.id.initialize({
                client_id:
                    "645483323057-c6q3bkj13crooeo2mdofa271shf2h17s.apps.googleusercontent.com",
                callback: async (resp) => {
                    try {
                        setErrorMessage("");
                        const idToken = resp?.credential;
                        if (!idToken) {
                            setErrorMessage("Không lấy được Google ID Token");
                            return;
                        }

                        const result = await AuthenticationService.loginGoogle(idToken);

                        if (result?.status) {
                            localStorage.setItem("token", result.data.token);
                            localStorage.setItem("rf_token", result.data.refreshToken);
                            navigate("/Home");
                        } else {
                            setErrorMessage(result?.msg || "Đăng nhập Google thất bại");
                        }
                    } catch (err) {
                        setErrorMessage(err?.message || "Đăng nhập Google thất bại");
                    }
                },
            });

            // Render nút Google
            window.google.accounts.id.renderButton(googleBtnRef.current, {
                theme: "outline",
                size: "large",
                width: 309,
                text: "continue_with",
            });

            // Optional: bật One Tap
            // window.google.accounts.id.prompt();
        };

        // Load script 1 lần
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = initGoogle;
            document.body.appendChild(script);
        } else {
            initGoogle();
        }

        return () => {
            if (window.google?.accounts?.id) {
                window.google.accounts.id.cancel();
            }
        };
    }, [navigate]);

    return (
        <div className="login-container">
            <LoginContainer />

            <div className="login-body">
                <div className="login-form-container">
                    <div className="login-title">
                        <h4 style={{ textAlign: "center", fontSize: "40px" }}>Đăng Nhập</h4>
                    </div>

                    <form className="login-form" id="account" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="email"
                                className={`login-form-input ${email ? "filled" : ""}`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label className="floating-label">Tên Đăng Nhập</label>
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                className={`login-form-input ${password ? "filled" : ""}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label className="floating-label">Mật khẩu</label>
                        </div>

                        {errorMessage && (
                            <div className="login-error-message">{errorMessage}</div>
                        )}

                        <button id="login-submit" type="submit" className="login-form-button">
                            Đăng Nhập
                        </button>

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
                        <Link to="/login-phone" className="login-form-button login-phone-button">
                            <i className="fas fa-phone-alt"></i>
                            <span className="login-phone-text">Đăng Nhập Với Số Điện Thoại</span>
                        </Link>

                        {/* Nút đăng nhập Google */}
                        <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
                            <div ref={googleBtnRef} />
                        </div>

                        {/* <Link to="/login-email" className="login-form-button login-email-button">
                            <i className="fas fa-envelope"></i>
                            <span className="login-email-text">Đăng Nhập Với Email</span>
                        </Link> */}

                        <div className="login-form-signupnow">
                            Mới sử dụng GIENPHIM?
                            <Link to="/register" className="login-form-signupnow-link">
                                Đăng Ký Ngay.
                            </Link>
                        </div>

                        <div className="login-term">
                            <p>Trang này được bảo vệ bởi Google reCAPTCHA để đảm bảo bạn không phải là bot.</p>
                            <a
                                href="https://www.google.com/recaptcha"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Tìm Hiểu Thêm.
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}