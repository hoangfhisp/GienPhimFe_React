import React, { useEffect, useState } from 'react';
import AdminBoard from '../../../components/Admin-board/Admin-board';
import Table from '../../../components/Table/Table';
import '../../../components/Admin-board/Admin-board.scss';
import Card from '../../../components/Table/Card';

const TaiKhoanList = () => {
    const [taiKhoanList, setTaiKhoanList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTaiKhoan, setCurrentTaiKhoan] = useState(null); // Lưu tài khoản hiện tại khi click
    const [tenNguoiDung, setTenNguoiDung] = useState('');

    // Lấy danh sách tài khoản
    const fetchData = () => {
        setLoading(true);
        fetch('/api/taikhoanapi') // Thay '/api/taikhoanapi' bằng API thực tế của bạn
            .then(res => res.json())
            .then(data => {
                setTaiKhoanList(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi tải tài khoản:", err);
                setLoading(false);
            });
    };

    // Tìm kiếm tài khoản theo tên người dùng
    const handleTimKiem = e => {
        e.preventDefault();
        fetch(`/api/taikhoanapi/timkiem?tenNguoiDung=${tenNguoiDung}`) // Thay '/api/taikhoanapi/timkiem' bằng API thực tế
            .then(res => res.json())
            .then(setTaiKhoanList);
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
        { header: "Email", accessor: "Email" },
        {
            header: "Email Xác Nhận",
            render: row => row.EmailConfirmed ? "✔️" : "❌",
        },
        { header: "Tên Đăng Nhập", accessor: "UserName" },
        {
            header: "Giới Tính",
            render: row => {
                switch (row.GioiTinh) {
                    case 1: return "Nam";
                    case 2: return "Nữ";
                    default: return "Không xác định";
                }
            },
        },
        { header: "Mô Tả", accessor: "MoTa" },
        { header: "Số Điện Thoại", accessor: "PhoneNumber" },
        {
            header: "Xác Nhận SĐT",
            render: row => row.PhoneNumberConfirmed ? "✔️" : "❌",
        },
        {
            header: "2FA",
            render: row => row.TwoFactorEnabled ? "✔️" : "❌",
        },
        {
            header: "Khóa Tài Khoản",
            render: row => (
                <>
                    {row.LockoutEnabled ? (
                        <span className="badge bg-danger">Bị Khóa</span>
                    ) : (
                        <span className="badge bg-success">Hoạt Động</span>
                    )}
                </>
            ),
        },
        {
            header: "Thao Tác",
            render: row => (
                <>
                    <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleUnlock(row.Id)}
                    >
                        Mở khóa
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleLock(row.Id)}
                    >
                        Khóa
                    </button>
                </>
            ),
        }
    ];

    const handleLock = (id) => {
        fetch(`/api/taikhoanapi/lock/${id}`, { method: 'POST' }) // Thay '/api/taikhoanapi/lock' bằng API thực tế
            .then(() => fetchData());
    };

    const handleUnlock = (id) => {
        fetch(`/api/taikhoanapi/unlock/${id}`, { method: 'POST' }) // Thay '/api/taikhoanapi/unlock' bằng API thực tế
            .then(() => fetchData());
    };

    return (
        <div className="wrapper d-flex">
            <AdminBoard username="Admin" />
            <div id="content" className="content p-4 p-md-5 pt-5">
                <h1>Danh sách tài khoản</h1>
                <hr />

                {/* Thêm tài khoản mới */}
                <div className="mb-4">
                    <button onClick={() => setCurrentTaiKhoan({ action: 'create' })} className="title me-3">
                        Thêm tài khoản mới
                    </button>
                </div>

                {/* Bộ lọc & Tìm kiếm */}
                <div className="d-flex flex-wrap justify-content-between align-items-center filter-container mb-4">
                    <form className="d-flex timkiemB mb-2" onSubmit={handleTimKiem}>
                        <input
                            className="form-control searchbar me-2"
                            name="tenNguoiDung"
                            type="search"
                            placeholder="Nhập tên người dùng..."
                            value={tenNguoiDung}
                            onChange={e => setTenNguoiDung(e.target.value)}
                        />
                        <button className="title" type="submit">Tìm</button>
                    </form>
                </div>

                {/* Hiển thị bảng tài khoản */}
                <Table columns={columns} data={taiKhoanList} loading={loading} />

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
            {currentTaiKhoan && (
                <Card
                    action={currentTaiKhoan.action} // Thực hiện hành động create, edit, view, delete
                    taiKhoan={currentTaiKhoan}
                    columns={columns}
                    onClose={() => setCurrentTaiKhoan(null)} // Đóng overlay khi không cần
                    onSave={(taiKhoan) => {
                        if (currentTaiKhoan && currentTaiKhoan.action === 'edit') {
                            // Cập nhật tài khoản
                            fetch(`/api/taikhoanapi/${currentTaiKhoan.Id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(taiKhoan),
                            }).then(() => fetchData());
                        } else if (currentTaiKhoan && currentTaiKhoan.action === 'create') {
                            // Thêm mới tài khoản
                            fetch('/api/taikhoanapi', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(taiKhoan),
                            }).then(() => fetchData());
                        }
                        setCurrentTaiKhoan(null); // Đóng overlay sau khi lưu
                    }}
                    onDelete={(taiKhoan) => {
                        // Hàm xử lý xóa
                        fetch(`/api/taikhoanapi/${taiKhoan.Id}`, {
                            method: 'DELETE',
                        }).then(() => fetchData());
                        setCurrentTaiKhoan(null); // Đóng overlay sau khi xóa
                    }}
                />
            )}
        </div>
    );
};

export default TaiKhoanList;
