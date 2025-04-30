import React, { useEffect, useState } from 'react';
import AdminBoard from '../../../components/Admin-board/Admin-board';
import Table from '../../../components/Table/Table';
import '../../../components/Admin-board/Admin-board.scss';
import Card from '../../../components/Table/Card';

const DaoDienList = () => {
    const [daoDienList, setDaoDienList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDaoDien, setCurrentDaoDien] = useState(null); // Lưu đạo diễn hiện tại khi click
    const [tenDaoDien, setTenDaoDien] = useState('');

    // Lấy danh sách đạo diễn
    const fetchData = () => {
        setLoading(true);
        fetch('/api/daodienapi') // Thay '/api/daodienapi' bằng API thực tế của bạn
            .then(res => res.json())
            .then(data => {
                setDaoDienList(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi tải đạo diễn:", err);
                setLoading(false);
            });
    };

    // Tìm kiếm đạo diễn theo tên
    const handleTimKiem = e => {
        e.preventDefault();
        fetch(`/api/daodienapi/timkiem?tenDaoDien=${tenDaoDien}`) // Thay '/api/daodienapi/timkiem' bằng API thực tế
            .then(res => res.json())
            .then(setDaoDienList);
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
        { header: "Tên đạo diễn", accessor: "TenDG" },
        { header: "Mô tả", accessor: "MoTaDG" },
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
                    <button onClick={() => setCurrentDaoDien({ ...row, action: 'view' })}>Xem chi tiết</button> |{' '}
                    <button onClick={() => setCurrentDaoDien({ ...row, action: 'edit' })}>Chỉnh sửa</button> |{' '}
                    <button onClick={() => setCurrentDaoDien({ ...row, action: 'delete' })}>Xóa</button>
                </>
            ),
        }
    ];

    return (
        <div className="wrapper d-flex">
            <AdminBoard username="Admin" />
            <div id="content" className="content p-4 p-md-5 pt-5">
                <h1>Danh sách đạo diễn</h1>
                <hr />

                {/* Thêm đạo diễn mới */}
                <div className="mb-4">
                    <button onClick={() => setCurrentDaoDien({ action: 'create' })} className="title me-3">
                        Thêm đạo diễn mới
                    </button>
                </div>

                {/* Bộ lọc & Tìm kiếm */}
                <div className="d-flex flex-wrap justify-content-between align-items-center filter-container mb-4">
                    <form className="d-flex timkiemB mb-2" onSubmit={handleTimKiem}>
                        <input
                            className="form-control searchbar me-2"
                            name="tenDaoDien"
                            type="search"
                            placeholder="Nhập tên đạo diễn..."
                            value={tenDaoDien}
                            onChange={e => setTenDaoDien(e.target.value)}
                        />
                        <button className="title" type="submit">Tìm</button>
                    </form>
                </div>

                {/* Hiển thị bảng đạo diễn */}
                <Table columns={columns} data={daoDienList} loading={loading} />

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
            {currentDaoDien && (
                <Card
                    action={currentDaoDien.action} // Thực hiện hành động create, edit, view, delete
                    daoDien={currentDaoDien}
                    columns={columns}
                    onClose={() => setCurrentDaoDien(null)} // Đóng overlay khi không cần
                    onSave={(daoDien) => {
                        if (currentDaoDien && currentDaoDien.action === 'edit') {
                            // Cập nhật đạo diễn
                            fetch(`/api/daodienapi/${currentDaoDien.DaoDienId}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(daoDien),
                            }).then(() => fetchData());
                        } else if (currentDaoDien && currentDaoDien.action === 'create') {
                            // Thêm mới đạo diễn
                            fetch('/api/daodienapi', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(daoDien),
                            }).then(() => fetchData());
                        }
                        setCurrentDaoDien(null); // Đóng overlay sau khi lưu
                    }}
                    onDelete={(daoDien) => {
                        // Hàm xử lý xóa
                        fetch(`/api/daodienapi/${daoDien.DaoDienId}`, {
                            method: 'DELETE',
                        }).then(() => fetchData());
                        setCurrentDaoDien(null); // Đóng overlay sau khi xóa
                    }}
                />
            )}
        </div>
    );
};

export default DaoDienList;
