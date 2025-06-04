import { useEffect, useState } from "react";
import Table from "../../../components/Table/Table";
import * as movieServices from "../../../services/Admin/MovieService";

export default function ListLichSuGiaoDich({ page, limit, data, pagination, onPageChange }) {
    const [listLichSuGiaoDich, setListLichSuGiaoDich] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApi = async (currentPage = page, currentLimit = limit) => {
        setLoading(true);
        try {
            const result = await movieServices.fetchLichSuGiaoDichNguoiDung(currentPage, currentLimit);
            setListLichSuGiaoDich(result.data || []);
            onPageChange(result.pagination);
        } catch (error) {
            console.error("Lỗi khi tải lịch sử giao dịch:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (data && data.length > 0) {
            setListLichSuGiaoDich(data);
        } else {
            fetchApi();
        }
    }, [data, limit, page]);

    // Hiển thị thông tin tên người dùng từ chi tiết giao dịch (lấy người dùng đầu tiên)
    const getTenNguoiDung = (row) => {
        if (row.chiTietLichSuGiaoDichs && row.chiTietLichSuGiaoDichs.length > 0) {
            return row.chiTietLichSuGiaoDichs[0].tenNguoiDung;
        }
        return "Không rõ";
    };

    const columns = [
        { header: "Tên người dùng", accessor: "tenNguoiDung", render: row => getTenNguoiDung(row) },
        { header: "Số tiền", accessor: "soTienGD" },
        { header: "Nội dung", accessor: "noiDungGD" },
        { header: "Mô tả", accessor: "moTaGD" },
        { header: "Phương thức", accessor: "phuongThucGD" },
        {
            header: "Thời gian GD",
            accessor: "thoiGianGD",
            render: row => new Date(row.thoiGianGD).toLocaleString()
        },
        { header: "Trạng thái", accessor: "trangThaiGD" },
        { header: "Mã đơn hàng", accessor: "maDonHang" }
    ];

    return (
        <>
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">Danh sách lịch sử giao dịch</h5>
                        <button
                            onClick={fetchApi}
                            className="btn btn-sm btn-outline-primary"
                            disabled={loading}
                        >
                            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''} me-2`}></i>
                            {loading ? 'Đang tải...' : 'Làm mới'}
                        </button>
                    </div>

                    <Table
                        columns={columns}
                        data={listLichSuGiaoDich}
                        loading={loading}
                        actions={[]}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>
        </>
    );
}
