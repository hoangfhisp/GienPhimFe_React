import React, { useEffect, useState } from 'react';
import AdminBoard from '../../../components/Admin-board/Admin-board';
import Table from '../../../components/Table/Table';
import '../../../components/Admin-board/Admin-board.scss';
import Card from '../../../components/Table/Card'; // Đảm bảo Card được import đúng

const NgonNguList = () => {
    const [ngonNguList, setNgonNguList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentNgonNgu, setCurrentNgonNgu] = useState(null); // Lưu ngôn ngữ hiện tại khi click
    const [tenNgonNgu, setTenNgonNgu] = useState('');

    // Lấy danh sách ngôn ngữ
    const fetchData = () => {
        setLoading(true);
        fetch('/api/ngonnguapi') // Thay '/api/ngonnguapi' bằng API thực tế của bạn
            .then(res => res.json())
            .then(data => {
                setNgonNguList(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi tải ngôn ngữ:", err);
                setLoading(false);
            });
    };

    // Tìm kiếm ngôn ngữ theo tên
    const handleTimKiem = e => {
        e.preventDefault();
        fetch(`/api/ngonnguapi/timkiem?tenNgonNgu=${tenNgonNgu}`) // Thay '/api/ngonnguapi/timkiem' bằng API thực tế
            .then(res => res.json())
            .then(setNgonNguList);
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
        { header: "Tên ngôn ngữ", accessor: "TenNN" },
        { header: "Mô tả", accessor: "MoTaNN" },
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
                    <button onClick={() => setCurrentNgonNgu({ ...row, action: 'view' })}>Xem chi tiết</button> |{' '}
                    <button onClick={() => setCurrentNgonNgu({ ...row, action: 'edit' })}>Chỉnh sửa</button> |{' '}
                    <button onClick={() => setCurrentNgonNgu({ ...row, action: 'delete' })}>Xóa</button>
                </>
            ),
        }
    ];

    return (
        <div className="wrapper d-flex">
            <AdminBoard username="Admin" />
            <div id="content" className="content p-4 p-md-5 pt-5">
                <h1>Danh sách ngôn ngữ</h1>
                <hr />

                {/* Thêm ngôn ngữ mới */}
                <div className="mb-4">
                    <button onClick={() => setCurrentNgonNgu({ action: 'create' })} className="title me-3">
                        Thêm ngôn ngữ mới
                    </button>
                </div>

                {/* Bộ lọc & Tìm kiếm */}
                <div className="d-flex flex-wrap justify-content-between align-items-center filter-container mb-4">
                    <form className="d-flex timkiemB mb-2" onSubmit={handleTimKiem}>
                        <input
                            className="form-control searchbar me-2"
                            name="tenNgonNgu"
                            type="search"
                            placeholder="Nhập tên ngôn ngữ..."
                            value={tenNgonNgu}
                            onChange={e => setTenNgonNgu(e.target.value)}
                        />
                        <button className="title" type="submit">Tìm</button>
                    </form>
                </div>

                {/* Hiển thị bảng ngôn ngữ */}
                <Table columns={columns} data={ngonNguList} loading={loading} />

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
            {currentNgonNgu && (
                <Card
                    action={currentNgonNgu.action} // Thực hiện hành động create, edit, view, delete
                    ngonNgu={currentNgonNgu}
                    columns={columns}
                    onClose={() => setCurrentNgonNgu(null)} // Đóng overlay khi không cần
                    onSave={(ngonNgu) => {
                        if (currentNgonNgu && currentNgonNgu.action === 'edit') {
                            // Cập nhật ngôn ngữ
                            fetch(`/api/ngonnguapi/${currentNgonNgu.NgonNguId}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(ngonNgu),
                            }).then(() => fetchData());
                        } else if (currentNgonNgu && currentNgonNgu.action === 'create') {
                            // Thêm mới ngôn ngữ
                            fetch('/api/ngonnguapi', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(ngonNgu),
                            }).then(() => fetchData());
                        }
                        setCurrentNgonNgu(null); // Đóng overlay sau khi lưu
                    }}
                    onDelete={(ngonNgu) => {
                        // Hàm xử lý xóa
                        fetch(`/api/ngonnguapi/${ngonNgu.NgonNguId}`, {
                            method: 'DELETE',
                        }).then(() => fetchData());
                        setCurrentNgonNgu(null); // Đóng overlay sau khi xóa
                    }}
                />
            )}
        </div>
    );
};

export default NgonNguList;
