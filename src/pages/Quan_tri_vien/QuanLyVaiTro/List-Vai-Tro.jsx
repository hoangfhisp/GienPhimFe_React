import React, { useEffect, useState } from 'react';
import AdminBoard from '../../../components/Admin-board/Admin-board';
import Table from '../../../components/Table/Table';
import '../../../components/Admin-board/Admin-board.scss';
import Card from '../../../components/Table/Card';

const VaiTroList = () => {
    const [vaiTroList, setVaiTroList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentVaiTro, setCurrentVaiTro] = useState(null); // Lưu vai trò hiện tại khi click
    const [tenVaiTro, setTenVaiTro] = useState('');

    // Lấy danh sách vai trò
    const fetchData = () => {
        setLoading(true);
        fetch('/api/vaitroapi') // Thay '/api/vaitroapi' bằng API thực tế của bạn
            .then(res => res.json())
            .then(data => {
                setVaiTroList(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi tải vai trò:", err);
                setLoading(false);
            });
    };

    // Tìm kiếm vai trò theo tên
    const handleTimKiem = e => {
        e.preventDefault();
        fetch(`/api/vaitroapi/timkiem?tenVaiTro=${tenVaiTro}`) // Thay '/api/vaitroapi/timkiem' bằng API thực tế
            .then(res => res.json())
            .then(setVaiTroList);
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
        { header: "Tên vai trò", accessor: "RoleName" },
        { header: "Tên vai trò đã chuẩn hóa", accessor: "NormalizedRoleName" },
        {
            header: "Sync Stamp",
            render: row => row.SyncStamp,
        },
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
                    <button onClick={() => setCurrentVaiTro({ ...row, action: 'view' })}>Xem chi tiết</button> |{' '}
                    <button onClick={() => setCurrentVaiTro({ ...row, action: 'edit' })}>Chỉnh sửa</button> |{' '}
                    <button onClick={() => setCurrentVaiTro({ ...row, action: 'delete' })}>Xóa</button>
                </>
            ),
        }
    ];

    return (
        <div className="wrapper d-flex">
            <AdminBoard username="Admin" />
            <div id="content" className="content p-4 p-md-5 pt-5">
                <h1>Danh sách vai trò</h1>
                <hr />

                {/* Thêm vai trò mới */}
                <div className="mb-4">
                    <button onClick={() => setCurrentVaiTro({ action: 'create' })} className="title me-3">
                        Thêm vai trò mới
                    </button>
                </div>

                {/* Bộ lọc & Tìm kiếm */}
                <div className="d-flex flex-wrap justify-content-between align-items-center filter-container mb-4">
                    <form className="d-flex timkiemB mb-2" onSubmit={handleTimKiem}>
                        <input
                            className="form-control searchbar me-2"
                            name="tenVaiTro"
                            type="search"
                            placeholder="Nhập tên vai trò..."
                            value={tenVaiTro}
                            onChange={e => setTenVaiTro(e.target.value)}
                        />
                        <button className="title" type="submit">Tìm</button>
                    </form>
                </div>

                {/* Hiển thị bảng vai trò */}
                <Table columns={columns} data={vaiTroList} loading={loading} />

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
            {currentVaiTro && (
                <Card
                    action={currentVaiTro.action} // Thực hiện hành động create, edit, view, delete
                    vaiTro={currentVaiTro}
                    columns={columns}
                    onClose={() => setCurrentVaiTro(null)} // Đóng overlay khi không cần
                    onSave={(vaiTro) => {
                        if (currentVaiTro && currentVaiTro.action === 'edit') {
                            // Cập nhật vai trò
                            fetch(`/api/vaitroapi/${currentVaiTro.Id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(vaiTro),
                            }).then(() => fetchData());
                        } else if (currentVaiTro && currentVaiTro.action === 'create') {
                            // Thêm mới vai trò
                            fetch('/api/vaitroapi', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(vaiTro),
                            }).then(() => fetchData());
                        }
                        setCurrentVaiTro(null); // Đóng overlay sau khi lưu
                    }}
                    onDelete={(vaiTro) => {
                        // Hàm xử lý xóa
                        fetch(`/api/vaitroapi/${vaiTro.Id}`, {
                            method: 'DELETE',
                        }).then(() => fetchData());
                        setCurrentVaiTro(null); // Đóng overlay sau khi xóa
                    }}
                />
            )}
        </div>
    );
};

export default VaiTroList;
