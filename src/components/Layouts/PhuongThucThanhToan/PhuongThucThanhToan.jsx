import { Link } from "react-router-dom";
import bankingVNPAYImg from '../../../assets/img/vnpay.jpg';
import bankingVIBImg from '../../../assets/img/banking.png';
import momoImg from '../../../assets/img/momo.png';

function PhuongThucThanhToan() {
    return (
        <>
            <div className="trogiup-body">
                <div className="login-form-container">
                    <div className="login-title">
                        <h4 style={{ textAlign: 'center', fontSize: '28px', color: 'white' }}>
                            Chọn Phương Thức Thanh Toán
                        </h4>
                    </div>
                    <div className="payment-methods-container">
                        <PhuongThuc link={"/NapTien/VnPay"} img={bankingVNPAYImg}>Tài khoản ví điện tử VNPAY</PhuongThuc>
                        <PhuongThuc link={"/NapTien/VIB"} img={bankingVIBImg}>Tài khoản ngân hàng VIB</PhuongThuc>
                        <PhuongThuc link={"/NapTien/Momo"} img={momoImg}>Tài khoản ví điện tử Momo</PhuongThuc>
                    </div>
                    <div className="back-link-container">
                        <Link to="/Home" className="back-link">
                            <i className="fas fa-arrow-left"></i> Trở về
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}


function PhuongThuc({ children, link, img }) {
    return (
        <div className="payment-method">
            <Link to={link} >
                <div className="payment-method-card">
                    <img
                        alt="Tài khoản ngân hàng vnpay"
                        className="payment-method-icon"
                        src={img}
                    />
                    <div className="payment-method-details">
                        <div className="payment-method-name">{children}</div>
                        <div className="payment-method-description">
                            <span className="no-fee">Không mất phí</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default PhuongThucThanhToan;