import React, { useState } from 'react';
import LoginContainer from '../../components/Login-container/Login-container';
import { Link, useNavigate } from 'react-router-dom';
import bankingVNPAYImg from '../../assets/img/vnpay.jpg';
import bankingVIBImg from '../../assets/img/banking.png';
import momoImg from '../../assets/img/momo.png';
import '../../components/Login-container/Login.scss';

export default function ChonPhuongThucNapTien() {
    return (
        <div className="login-container">
            <LoginContainer />
            <div class="trogiup-body">
                <div class="login-form-container">
                    <div class="login-title">
                        <h4 style={{ textAlign: 'center', fontSize: '28px', color: 'white' }}>
                            Chọn Phương Thức Thanh Toán
                        </h4>
                    </div>
                    <div class="payment-methods-container">
                        <div className="payment-methods-container">
                            {/* Tài khoản ngân hàng VNPay */}
                            <div className="payment-method">
                                <Link to="/NganHangVNPAY">
                                    <div className="payment-method-card">
                                        <img
                                            alt="Tài khoản ngân hàng vnpay"
                                            className="payment-method-icon"
                                            src={bankingVNPAYImg}
                                        />
                                        <div className="payment-method-details">
                                            <div className="payment-method-name">Tài khoản ngân hàng VNPAY</div>
                                            <div className="payment-method-description">
                                                <span className="no-fee">Không mất phí</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Tài khoản ngân hàng VIB */}
                            <div className="payment-method">
                                <Link to="/NganHangVIB">
                                    <div className="payment-method-card">
                                        <img
                                            alt="Tài khoản ngân hàng vib"
                                            className="payment-method-icon"
                                            src={bankingVIBImg}
                                        />
                                        <div className="payment-method-details">
                                            <div className="payment-method-name">Tài khoản ngân hàng VIB</div>
                                            <div className="payment-method-description">
                                                <span className="no-fee">Không mất phí</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Ví điện tử Momo */}
                            <div className="payment-method">
                                <Link to="/Momo">
                                    <div className="payment-method-card">
                                        <img
                                            alt="Ví điện tử Momo"
                                            className="payment-method-icon"
                                            src={momoImg}
                                        />
                                        <div className="payment-method-details">
                                            <div className="payment-method-name">Ví điện Tử Momo</div>
                                            <div className="payment-method-description">
                                                <span className="transaction-fee">Phí giao dịch: 3%</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div class="back-link-container">
                        <Link to="/Home" className="back-link">
                            <i className="fas fa-arrow-left"></i> Trở về
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
