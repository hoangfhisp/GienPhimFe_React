import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as AuthenticationService from "../../services/Admin/AuthenticationService";
import LoginContainer from "../../components/Login-container/Login-container";
import "../../components/Login-container/Login.scss";

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email"); // chỉ cần email

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (!email) {
            setError("Thiếu email trong đường dẫn. Vui lòng quay lại bước 'Quên mật khẩu'.");
        }
    }, [email]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) return;

        if (!otp.trim()) {
            setError("Vui lòng nhập mã OTP.");
            return;
        }
        if (!newPassword || !confirmNewPassword) {
            setError("Mật khẩu không được để trống.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setError("Mật khẩu mới và xác nhận mật khẩu không trùng khớp.");
            return;
        }

        setError("");
        setSuccessMessage("");

        try {
            const payload = {
                email: String(email).trim(),
                otp: String(otp).trim(),
                type: "fg_password",
                newPassword,
                confirmNewPassword,
            };

            const data = await AuthenticationService.resetPassword(payload);


            if (data?.status === true) {
                setError("");
                setSuccessMessage(data?.msg || "Đổi mật khẩu thành công.");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                setSuccessMessage("");
                setError(data?.msg || "Đổi mật khẩu thất bại.");
            }
        } catch (err) {
            console.error(err);
            setError("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    return (
        <div className="login-container">
            <LoginContainer />
            <div className="login-body">
                <div className="login-form-container">
                    <div className="login-title">
                        <h4 style={{ textAlign: "center" }}>Đổi lại mật khẩu</h4>
                    </div>

                    <form className="login-form" id="changePasswordForm" onSubmit={handleSubmit}>
                        {error && (
                            <div className="text-danger" role="alert">
                                {error}
                            </div>
                        )}
                        {successMessage && (
                            <div className="text-success" role="alert">
                                {successMessage}
                            </div>
                        )}

                        {/* Email (readonly) */}
                        <div className="form-group">
                            <input
                                type="email"
                                className={`login-form-input ${email ? "filled" : ""}`}
                                value={email || ""}
                                readOnly
                            />
                            <label className="floating-label">Email</label>
                        </div>

                        {/* OTP */}
                        <div className="form-group">
                            <input
                                type="text"
                                className={`login-form-input ${otp ? "filled" : ""}`}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                autoComplete="one-time-code"
                                required
                            />
                            <label className="floating-label">Mã OTP</label>
                        </div>

                        {/* New password */}
                        <div className="form-group">
                            <input
                                type="password"
                                className={`login-form-input ${newPassword ? "filled" : ""}`}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                            <label className="floating-label">Mật khẩu mới</label>
                        </div>

                        {/* Confirm new password */}
                        <div className="form-group">
                            <input
                                type="password"
                                className={`login-form-input ${confirmNewPassword ? "filled" : ""}`}
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                            <label className="floating-label">Xác nhận mật khẩu mới</label>
                        </div>

                        <button type="submit" className="login-form-button" disabled={!email}>
                            Thay đổi mật khẩu
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;