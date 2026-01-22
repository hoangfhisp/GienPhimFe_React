import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import './GoiThanhVien.scss';
import '../../components/Login-container/Login.scss';

import LoginContainer from '../../components/Login-container/Login-container';
import Plan from '../../components/Layouts/Plan/Plan.jsx';
import ThongBao from '../../components/Layouts/ThongBao/ThongBao.jsx';
import * as authHooks from '../../hooks/auth.jsx';
import * as authServices from '../../services/Admin/AuthenticationService.jsx';
import * as managerServices from '../../services/User/ManagerService';
import * as userService from '../../services/User/UserService.jsx';
import { formatDate, formatVND } from '../../untils/Format.jsx';

export default function GoiThanhVien() {
    const [dataUser, setDataUser] = useState([]);
    const [dataListGoi, setDataListGoi] = useState([]);
    const [dataCTGoiTVUser, setDataCTGoiTVUser] = useState([]);
    const [dataWallet, setDataWallet] = useState([]);
    const [dataGoiThang, setDataGoiThang] = useState({});
    const [dataGoiNam, setDataGoiNam] = useState({});
    const [selectedPlan, setSelectedPlan] = useState(null);
    const colorSchemes = ['green', 'yellow', 'red', 'blue'];
    const [formThongBao, setFormThongBao] = useState({
        show: false,
        type: null,
        title: '',
        message: '',
        soNgayOptions: null,
        btnLabel: '',
        onBTNClick: null,
        showButton: false,
        onclose: null
    });

    const soNgayMuaGoiRef = useRef(null); // để lưu thông tin khi chọn số ngày

    const userId = authHooks.getUserIdFromToken(); // Lấy id user từ token

    // Lấy info user từ userId
    useEffect(() => {
        if (!userId) {
            return;
        }

        const fetchApiUser = async () => {
            const resultU = await authServices.getUserById(userId)
            setDataUser(resultU.data);
            const resultWL = await userService.getWalletByUserId(userId);
            setDataWallet(resultWL.data);
            const resultLGTV = await managerServices.getListGoiThanhVien();
            setDataListGoi(Array.isArray(resultLGTV.data) ? resultLGTV.data : []);
            const resultCTGoiTVUser = await managerServices.GetChiTietGoiTVByUser(userId);
            setDataCTGoiTVUser(resultCTGoiTVUser);
        }

        fetchApiUser();

    }, [userId])



    //Click chọn gói thành viên
    const handleSelect = (planId) => {
        setSelectedPlan(planId);
        soNgayMuaGoiRef.current = null;
    };

    // Hiện thông báo khi chọn gói
    const handleThongBao = () => {
        if (!selectedPlan) {
            alert("Vui lòng chọn gói trước khi mua");
            return;
        }

        setFormThongBao({
            show: true,
            type: 'warning',
            title: `Hãy chọn số ngày bạn muốn mua cho gói "${dataListGoi.find(g => g.goiTVId === selectedPlan)?.tenPlan || ''}"`,
            message: 'Các gói đều có giá ưu đãi đặc biệt',
            soNgayOptions: [30, 365],
            btnLabel: 'Mua',
            onBTNClick: handleCheckGoiDaMua,
            showButton: true,
        });

    };


    const handleCheckGoiDaMua = () => {
        const selectedNgay = soNgayMuaGoiRef.current;
        const goi = selectedNgay === 30 ? dataGoiThang[selectedPlan] : dataGoiNam[selectedPlan];
        if (dataCTGoiTVUser?.data?.optionId !== goi[0]?.luaChonGoiTVId && dataCTGoiTVUser.status === true) {
            setFormThongBao({
                show: true,
                type: 'warning',
                title: `Bạn đã có gói ${dataCTGoiTVUser?.data?.tenPlan}.`,
                message: `Bạn có muốn mua gói ${goi[0].membershipPlans.tenPlan} này thay gói ${dataCTGoiTVUser?.data?.tenPlan} kia không `,
                btnLabel: 'Vẫn mua',
                onBTNClick: HandleMuaGoi,
                showButton: true,
            });
        } else {
            HandleMuaGoi();
        }
    }

    // Thống check xác nhận mua gói 
    const HandleMuaGoi = async () => {

        const selectedNgay = soNgayMuaGoiRef.current;

        if (!selectedPlan || !selectedNgay) {
            alert("Bạn chưa chọn gói hoặc số ngày mua");
            return;
        }

        const goi = selectedNgay === 30 ? dataGoiThang[selectedPlan] : dataGoiNam[selectedPlan];

        if (!goi || !goi[0]) {
            alert("Gói chưa có dữ liệu");
            return;
        }


        const fetchApiXuLyGoiTV = await managerServices.XuLyChiTietMuaGoiTVUser(goi[0]?.optionId || "", dataUser.userId);

        const updatedUser = await authServices.getUserById(dataUser.userId);
        setDataUser(updatedUser.data);
        const resultWL = await userService.getWalletByUserId(userId);
        setDataWallet(resultWL.data);
        const updatrCTGoiTVUser = await managerServices.GetChiTietGoiTVByUser(userId);
        setDataCTGoiTVUser(updatrCTGoiTVUser);


        if (fetchApiXuLyGoiTV.status === true) {

            setFormThongBao({
                show: true,
                type: 'success',
                title: `Bạn đã mua gói ${goi[0].membershipPlans.tenPlan || ""} thành công.`,
                message: `Cảm ơn bạn đã mua gói với số tiền ${formatVND(goi[0].giaOption || "")} .Tài khoản bạn còn ${formatVND(Number(resultWL.data.soDu))} `,
                buttons: null
            });
        } else {
            setFormThongBao({
                show: true,
                type: 'fail',
                title: `Bạn đã mua gói ${goi[0].membershipPlans.tenPlan || ""} thất bại.`,
                message: `${fetchApiXuLyGoiTV.msg} .Tài khoản bạn còn ${formatVND(Number(resultWL.data.soDu))} `,
                buttons: null
            });
        }
        soNgayMuaGoiRef.current = null;
    };

    // Chọn số ngày mua gói
    const handleChonSoNgay = (soNgay) => {
        soNgayMuaGoiRef.current = soNgay;
    };


    return (
        <>
            <div className="login-container">
                <LoginContainer />
                <div className="trogiup-body">
                    <div className="login-form-container">
                        <div className="login-title">
                            <h4 style={{ textAlign: 'center', fontSize: '28px', color: 'white' }}>
                                GÓI THÀNH VIÊN
                            </h4>
                        </div>
                        <div className="user-info">
                            <div className="user-name">Email: <strong>{dataUser.email}</strong></div>
                            <div className="balance">Số dư tài khoản: <strong>{formatVND(Number(dataWallet.soDu))}</strong></div>
                            <div className="current-plan">Loại gói hiện tại: <strong>{dataCTGoiTVUser.status ? dataCTGoiTVUser?.data?.tenPlan : "Chưa có gói"} {dataCTGoiTVUser.status ? dataCTGoiTVUser?.data?.thoiGianSuDung : ""} Ngày</strong></div>

                        </div>
                        <div className="user-info">
                            <div className="user-name">Ngày Mua:
                                <strong>
                                    {dataCTGoiTVUser.status
                                        ? formatDate(dataCTGoiTVUser?.data?.ngayBatDau)
                                        : "Chưa có"}
                                </strong></div>
                            <div className="balance">Hết Hạn:
                                <strong>
                                    {dataCTGoiTVUser.status
                                        ? formatDate(dataCTGoiTVUser.data.ngayKetThuc)
                                        : "Chưa có"}
                                </strong></div>
                            <div className="current-plan">Trạng thái gói:
                                <strong>
                                    {dataCTGoiTVUser.status
                                        ? dataCTGoiTVUser.data.trangThai
                                        : "Chưa có"}
                                </strong>
                            </div>
                        </div>

                        <div className={`plans ${dataListGoi.length === 1 ? 'single-plan' : ''}`}>
                            {dataListGoi.map((res, index) => (
                                <Plan
                                    key={res.planId}
                                    deXuat={true}
                                    isRecommended={selectedPlan === res.planId}
                                    onSelect={() => handleSelect(res.planId)}
                                    data={res}
                                    onDataGoiThang={(data) => setDataGoiThang(prev => ({ ...prev, [res.planId]: data }))}
                                    onDataGoiNam={(data) => setDataGoiNam(prev => ({ ...prev, [res.planId]: data }))}
                                    color={colorSchemes[index % colorSchemes.length]} // Gán màu cho button
                                >
                                    GienPhim {res.tenPlan}
                                </Plan>
                            ))}
                        </div>
                        <div className="buttons-container">
                            <Link to={"/Home"} className="back-btn">Trở về</Link>
                            {selectedPlan && (
                                <button onClick={handleThongBao} className="buy-btn">
                                    Mua
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ThongBao
                show={formThongBao.show}
                type={formThongBao.type}
                title={formThongBao.title}
                message={formThongBao.message}
                soNgayOptions={formThongBao.soNgayOptions}
                onChonSoNgay={(soNgay) => handleChonSoNgay(soNgay)}
                onClose={() => setFormThongBao({ ...formThongBao, show: false })}
                showButton={formThongBao.showButton}
                btnLabel={formThongBao.btnLabel}
                onBTNClick={formThongBao.onBTNClick}
            ></ThongBao>

        </>
    );
}
