import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Table from "../../components/Table/Table";
import * as AuthenticationService from "../../services/Admin/AuthenticationService";
import LoginContainer from '../../components/Login-container/Login-container';
import '../../components/Login-container/Login.scss';

export default function LichSuGiaoDich() {
    // Các state quản lý phân trang và dữ liệu
    const [listLichSuGiaoDichResult, setLichSuGiaoDichResult] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pagination, setPagination] = useState({});

    // Lấy nguoiDungId từ localStorage
    const nguoiDungId = localStorage.getItem('nguoiDungId');

    // Hàm gọi API và cập nhật dữ liệu
    const fetchApi = async (currentPage = page, currentLimit = limit) => {
        setLoading(true);
        console.log("Fetching data for page:", currentPage, "limit:", currentLimit); // Log để xem trang và limit
        try {
            // Kiểm tra xem nguoiDungId có tồn tại không
            if (!nguoiDungId) {
                throw new Error("Không tìm thấy nguoiDungId");
            }

            // Gọi API với nguoiDungId, page và limit
            const result = await AuthenticationService.fetchLichSuGiaoDichs(nguoiDungId, currentPage, currentLimit);
            console.log("API Response:", result); // Log kết quả API để kiểm tra dữ liệu
            setLichSuGiaoDichResult(result.data);
            setPagination(result.pagination);  // Cập nhật lại thông tin phân trang
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý thay đổi trang
    const handlePageChange = (newPage) => {
        setPage(newPage); // Cập nhật trang hiện tại
        fetchApi(newPage, limit); // Gọi lại API với trang mới
    };

    // Hàm xử lý thay đổi số bản ghi trên mỗi trang (limit)
    const handleLimitChange = (newLimit) => {
        setLimit(newLimit); // Cập nhật limit
        fetchApi(page, newLimit); // Gọi lại API với limit mới
    };

    // useEffect để gọi API khi trang hoặc limit thay đổi
    useEffect(() => {
        if (nguoiDungId) {
            fetchApi(page, limit);
        }
    }, [page, limit, nguoiDungId]);

    // Định nghĩa cột cho Table
    const columns = [
        {
            header: "Thời gian tạo",
            accessor: "thoiGianTao",
            render: row => new Date(row.thoiGianTao).toLocaleString()
        },
        { header: "Nội dung", accessor: "moTaGD" },
        {
            header: "Ngày cập nhật",
            accessor: "thoiGianCapNhat",
            render: row => new Date(row.thoiGianCapNhat).toLocaleString()
        }
    ];

    return (
        <div className="login-container">
            <LoginContainer />
            <div className="trogiup-body">
                <div className="login-form-container">
                    <div className="login-title">
                        <h4 style={{ textAlign: 'center', fontSize: '28px', color: 'white' }} >
                            Lịch Sử Giao Dịch
                        </h4>
                    </div>
                    <div className="trogiup-question">
                        <Table
                            columns={columns}
                            data={listLichSuGiaoDichResult}
                            loading={loading}
                            onPageChange={handlePageChange}  // Truyền hàm xử lý thay đổi trang vào
                            pagination={pagination}  // Truyền thông tin phân trang vào Table
                            hiddenColumns={['actions']}
                        />
                    </div>
                    <div className="buttons-container">
                        <Link to={"/Home"} className="btn back-btn">Trở về</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}