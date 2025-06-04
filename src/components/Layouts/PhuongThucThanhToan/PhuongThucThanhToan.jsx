import { Link, useLocation,Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import bankingVNPAYImg from '../../../assets/img/vnpay.jpg';
import bankingVIBImg from '../../../assets/img/banking.png';
import momoImg from '../../../assets/img/momo.png';
import ThongBao from "../ThongBao/ThongBao";
import { formatVND } from "../../../untils/Format";
import * as authHook from '../../../hooks/auth.jsx'
import * as authServices from '../../../services/Admin/AuthenticationService.jsx'

function PhuongThucThanhToan() {
    const location = useLocation();

    const[dataUser,setDataUser] = useState([]);
    const[isThongBao,setIsThongBao] = useState(false);
    const[formThongBao,setFormThongBao] = useState({
        type: 'confirm',
        title: '',
        message: '',
    })

    var userIdLogin = authHook.getUserIdFromToken();

    const queryParams = new URLSearchParams(location.search);

    const status = queryParams.get("status") ; // trả về thông tin thanh toán thành công hay không (Thành công: success ; Thất bại: fail)
    const txnRef = queryParams.get("txnRef"); // mã đơn hàng thanh toán
    const code = queryParams.get("code"); // code để check lỗi ghì
    const amount = Number(queryParams.get("amount"));

    const handleThongBao = (status,data) => {
        if(status === 'success'){
            setFormThongBao({
                type: 'success',
                title: 'NẠP TIỀN THÀNH CÔNG',
                message: `Bạn đã nạp thành công ${formatVND(amount|| 0)} vào tài khoản. Tài khoản gốc ${formatVND(data?.soDuTaiKhoan || 0)}`,
            })
        } else if (status === 'fail'){
            setFormThongBao({
                type: 'fail',
                title: 'NẠP TIỀN THẤT BẠI',
                message: `Bạn đã nạp thất bại ${formatVND(amount|| 0)} vào tài khoản. Tài khoản gốc ${formatVND(data?.soDuTaiKhoan || 0)}`,
            })
        }
    }

   
    useEffect(() => {
        if(status === null || txnRef === null || code === null){
            setIsThongBao(false);
            return;
        }
        if(userIdLogin == null)
            return null;

        const fetchApiUser = async () => {
            const result = await authServices.getUserById(userIdLogin);

            setDataUser(result);
            handleThongBao(status,result);
            setIsThongBao(true);
            window.history.pushState({}, '', location.pathname); // load url không chuyển trang , chỉ dữ path
        }
        
        fetchApiUser();
    },[status,txnRef,code,userIdLogin])

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
                        <Link to="/LichSuGiaoDich" className="back-link">
                            <i className="fas fa-arrow-left"></i> Xem lịch sử giao dịch
                        </Link>
                    </div>
                    <div className="back-link-container">
                        <Link to="/Home" className="back-link">
                            <i className="fas fa-arrow-left"></i> Trở về
                        </Link>
                    </div>
                    
                </div>
            </div>
            {isThongBao &&  
                <ThongBao 
                    onClose ={() => setIsThongBao(false)}  
                    show={isThongBao} 
                    type={formThongBao.type} 
                    title={formThongBao.title}
                    message={formThongBao.message}
                >
                </ThongBao>
            }
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