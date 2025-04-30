import React, { useEffect, useState } from 'react';
import AdminBoard from '../../../components/Admin-board/Admin-board';
import Table from '../../../components/Table/Table';
import '../../../components/Admin-board/Admin-board.scss';
import Card from '../../../components/Table/Card';

const DienVienList = () => {
    const [dienVienList, setDienVienList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDienVien, setCurrentDienVien] = useState(null); // Lưu diễn viên hiện tại khi click
    const [tenDienVien, setTenDienVien] = useState('');

    // Lấy danh sách diễn viên
    const fetchData = () => {
        setLoading(true);
        fetch('/api/dienvienapi') // Thay '/api/dienvienapi' bằng API thực tế của bạn
            .then(res => res.json())
            .then(data => {
                setDienVienList(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi tải diễn viên:", err);
                setLoading(false);
            });
    };

    // Tìm kiếm diễn viên theo tên
    const handleTimKiem = e => {
        e.preventDefault();
        fetch(`/api/dienvienapi/timkiem?tenDienVien=${tenDienVien}`) // Thay '/api/dienvienapi/timkiem' bằng API thực tế
            .then(res => res.json())
            .then(setDienVienList);
    };

    // Cập nhật dữ liệu tự động mỗi 30s
    useEffect(() => {
        fetchData();
        const refreshInterval = setInterval(() => {
            fetchData();
        }, 30000);
        return () => {
            clearInterval(refreshInterval);
        };
    }, []);

    // Định dạng thời gian
    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleString();
    };

    const columns = [
        { header: "Tên diễn viên", accessor: "TenDV" },
        { header: "Mô tả", accessor: "MoTaDV" },
        {
            header: "Thời gian tạo",
            render: row => formatDate(row.ThoiGianTao),
        },
        {
            header: "Thời gian cập nhật",
            render: row => formatDate(row.ThoiGianCapNhat),
        },
        {
            header: "Thao tác",
            render: row => (
                <>
                    <button onClick={() => setCurrentDienVien({ ...row, action: 'view' })}>Xem chi tiết</button> |{' '}
                    <button onClick={() => setCurrentDienVien({ ...row, action: 'edit' })}>Chỉnh sửa</button> |{' '}
                    <button onClick={() => setCurrentDienVien({ ...row, action: 'delete' })}>Xóa</button>
                </>
            ),
        }
    ];

    return (
        <div className="wrapper d-flex">
            <AdminBoard username="Admin" />
            <div id="content" className="content p-4 p-md-5 pt-5">
                <h1>Danh sách diễn viên</h1>
                <hr />

                {/* Thêm diễn viên mới */}
                <div className="mb-4">
                    <button onClick={() => setCurrentDienVien({ action: 'create' })} className="title me-3">
                        Thêm diễn viên mới
                    </button>
                </div>

                {/* Bộ lọc & Tìm kiếm */}
                <div className="d-flex flex-wrap justify-content-between align-items-center filter-container mb-4">
                    <form className="d-flex timkiemB mb-2" onSubmit={handleTimKiem}>
                        <input
                            className="form-control searchbar me-2"
                            name="tenDienVien"
                            type="search"
                            placeholder="Nhập tên diễn viên..."
                            value={tenDienVien}
                            onChange={e => setTenDienVien(e.target.value)}
                        />
                        <button className="title" type="submit">Tìm</button>
                    </form>
                </div>

                {/* Hiển thị bảng diễn viên */}
                <Table columns={columns} data={dienVienList} loading={loading} />

                {/* Hiển thị spinner nếu đang tải dữ liệu */}
                {loading && (
                    <div className="spinner-container">
                        <div className="spinner"></div>
                        <p>Đang tải dữ liệu...</p>
                    </div>
                )}

                {/* Nút làm mới bảng */}
                <button className="btn btn-primary" onClick={fetchData}>Làm mới bảng</button>
            </div>

            {/* Hiển thị thẻ Card (Overlay) nếu trạng thái overlayVisible là true */}
            {currentDienVien && (
                <Card
                    action={currentDienVien.action} // Thực hiện hành động create, edit, view, delete
                    dienVien={currentDienVien}
                    columns={columns}
                    onClose={() => setCurrentDienVien(null)} // Đóng overlay khi không cần
                    onSave={(dienVien) => {
                        if (currentDienVien && currentDienVien.action === 'edit') {
                            // Cập nhật diễn viên
                            fetch(`/api/dienvienapi/${currentDienVien.DienVienId}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(dienVien),
                            }).then(() => fetchData());
                        } else if (currentDienVien && currentDienVien.action === 'create') {
                            // Thêm mới diễn viên
                            fetch('/api/dienvienapi', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(dienVien),
                            }).then(() => fetchData());
                        }
                        setCurrentDienVien(null); // Đóng overlay sau khi lưu
                    }}
                    onDelete={(dienVien) => {
                        // Hàm xử lý xóa
                        fetch(`/api/dienvienapi/${dienVien.DienVienId}`, {
                            method: 'DELETE',
                        }).then(() => fetchData());
                        setCurrentDienVien(null); // Đóng overlay sau khi xóa
                    }}
                />
            )}
        </div>
    );
};

export default DienVienList;
