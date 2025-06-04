import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Table from "../../components/Table/Table";
import * as AuthenticationService from "../../services/Admin/AuthenticationService.jsx";
import LoginContainer from '../../components/Login-container/Login-container';
import * as authHook from "../../hooks/auth.jsx";
import '../../components/Login-container/Login.scss';
import RenderPagination from '../../components/Commons/RenderPagination.jsx';

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
            const result = await AuthenticationService.fetchLichSuGiaoDichs(nguoiDungId, currentPage, currentLimit);

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
        {
            header: "Thời gian giao dịch",
            accessor: "thoiGianGD",
            render: row => new Date(row.thoiGianGD).toLocaleString()
        },
        {
            header: "Số tiền",
            accessor: "soTienGD",
            render: row => row.soTienGD?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || ''
        },
        { header: "Nội dung", accessor: "noiDungGD" },
        { header: "Mô tả", accessor: "moTaGD" },
        { header: "Phương thức", accessor: "phuongThucGD" },
        { header: "Trạng thái", accessor: "trangThaiGD" },
        { header: "Mã đơn hàng", accessor: "maDonHang" }
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
