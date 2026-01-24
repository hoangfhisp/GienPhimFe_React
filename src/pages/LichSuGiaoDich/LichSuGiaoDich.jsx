import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Table from "../../components/Table/Table";
import * as AuthenticationService from "../../services/Admin/AuthenticationService.jsx";
import LoginContainer from '../../components/Login-container/Login-container';
import * as authHook from "../../hooks/auth.jsx";
import * as userService from '../../services/User/UserService.jsx';
import '../../components/Login-container/Login.scss';
import RenderPagination from '../../components/Commons/RenderPagination/RenderPagination.jsx';
import './LichSuGiaoDich.scss';

export default function LichSuGiaoDich() {
    const [listLichSuGiaoDichResult, setLichSuGiaoDichResult] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pagination, setPagination] = useState({});

    const nguoiDungId = authHook.getUserIdFromToken();

    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchApi(newPage, limit);
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        fetchApi(page, newLimit);
    };

    useEffect(() => {
        if (nguoiDungId) {
            fetchApi(page, limit);
        }
    }, [page, limit, nguoiDungId]);

    const fetchApi = async (currentPage = page, currentLimit = limit) => {
        setLoading(true);
        try {
            if (!nguoiDungId) {
                throw new Error("Không tìm thấy nguoiDungId");
            }
            const walletResponse = await userService.getWalletByUserId(nguoiDungId);
            const walletId = walletResponse?.data.walletId;

            const result = await AuthenticationService.fetchLichSuGiaoDichs(walletId, currentPage, currentLimit);

            if (result.status) {
                setLichSuGiaoDichResult(result.data);
                setPagination(result.pagination || {});
            } else {
                setLichSuGiaoDichResult([]);
                setPagination({});
                console.warn('API trả về lỗi:', result.msg);
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu người dùng:", error);
        } finally {
            setLoading(false);
        }
    };



    const columns = [
        { header: "Loại Giao Dịch", accessor: "loaiGiaoDich" },
        { header: "Mô Tả", accessor: "moTa" },
        {
            header: "Thời Gian Giao Dịch",
            accessor: "ngayGiaoDich",
            render: row => new Date(row.ngayGiaoDich).toLocaleString()
        },
        {
            header: "Số Tiền Thay Đổi",
            accessor: "soTienThayDoi",
            render: row => row.soTienThayDoi?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || ''
        },
        {
            header: "Số Tiền Sau Giao Dịch",
            accessor: "soDuSauGiaoDich",
            render: row => row.soDuSauGiaoDich?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || ''
        },
        { header: "Trạng thái", accessor: "trangThai" },
    ];


    return (
        <div className="login-container">
            <LoginContainer />
            <div className="trogiup-body">
                <div className="login-form-container">
                    <div className="login-title">
                        <h4 style={{ textAlign: 'center', fontSize: '28px', color: 'white' }}>
                            Lịch Sử Giao Dịch
                        </h4>
                    </div>
                    <div className="trogiup-question">
                        <Table
                            columns={columns}
                            data={listLichSuGiaoDichResult ?? []}
                            loading={loading}
                            actions={[]}
                        />
                    </div>

                    <RenderPagination data={pagination} onPageChange={handlePageChange} />

                    <div className="buttons-container">
                        <Link to={"/Home"} className="btn back-btn">Trở về</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
