import React, { useEffect, useState } from 'react';
import AdminBoard from '../../../components/Admin-board/Admin-board';
import Table from '../../../components/Table/Table';
import '../../../components/Admin-board/Admin-board.scss';
import Card from '../../../components/Table/Card'; // Đảm bảo Card được import đúng

const TheLoaiList = () => {
    const [theLoaiList, setTheLoaiList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTheLoai, setCurrentTheLoai] = useState(null); // Lưu thể loại hiện tại khi click
    const [tenTheLoai, setTenTheLoai] = useState('');

    // Lấy danh sách thể loại
    const fetchData = () => {
        setLoading(true);
        fetch('/api/theloaiapi') // Thay '/api/theloaiapi' bằng API thực tế của bạn
            .then(res => res.json())
            .then(data => {
                setTheLoaiList(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi tải thể loại:", err);
                setLoading(false);
            });
    };

    // Tìm kiếm thể loại theo tên
    const handleTimKiem = e => {
        e.preventDefault();
        fetch(`/api/theloaiapi/timkiem?tenTheLoai=${tenTheLoai}`) // Thay /api/theloaiapi/timkiem bằng API thực tế
            .then(res => res.json())
            .then(setTheLoaiList);
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
        { header: "Tên thể loại", accessor: "TenTL" },
        { header: "Mô tả", accessor: "MoTa" },
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
                    <button onClick={() => setCurrentTheLoai({ ...row, action: 'view' })}>Xem chi tiết</button> |{' '}
                    <button onClick={() => setCurrentTheLoai({ ...row, action: 'edit' })}>Chỉnh sửa</button> |{' '}
                    <button onClick={() => setCurrentTheLoai({ ...row, action: 'delete' })}>Xóa</button>
                </>
            ),
        }
    ];

    return (
        <div className="wrapper d-flex">
            <AdminBoard username="Admin" />
            <div id="content" className="content p-4 p-md-5 pt-5">
                <h1>Danh sách thể loại</h1>
                <hr />

                {/* Thêm thể loại mới */}
                <div className="mb-4">
                    <button onClick={() => setCurrentTheLoai({ action: 'create' })} className="title me-3">
                        Thêm thể loại mới
                    </button>
                </div>

                {/* Bộ lọc & Tìm kiếm */}
                <div className="d-flex flex-wrap justify-content-between align-items-center filter-container mb-4">
                    <form className="d-flex timkiemB mb-2" onSubmit={handleTimKiem}>
                        <input
                            className="form-control searchbar me-2"
                            name="tenTheLoai"
                            type="search"
                            placeholder="Nhập tên thể loại..."
                            value={tenTheLoai}
                            onChange={e => setTenTheLoai(e.target.value)}
                        />
                        <button className="title" type="submit">Tìm</button>
                    </form>
                </div>

                {/* Hiển thị bảng thể loại */}
                <Table columns={columns} data={theLoaiList} loading={loading} />

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
            {currentTheLoai && (
                <Card
                    action={currentTheLoai.action} // Thực hiện hành động create, edit, view, delete
                    theLoai={currentTheLoai}
                    columns={columns}
                    onClose={() => setCurrentTheLoai(null)} // Đóng overlay khi không cần
                    onSave={(theLoai) => {
                        if (currentTheLoai && currentTheLoai.action === 'edit') {
                            // Cập nhật thể loại
                            fetch(`/api/theloaiapi/${currentTheLoai.TheLoaiId}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(theLoai),
                            }).then(() => fetchData());
                        } else if (currentTheLoai && currentTheLoai.action === 'create') {
                            // Thêm mới thể loại
                            fetch('/api/theloaiapi', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(theLoai),
                            }).then(() => fetchData());
                        }
                        setCurrentTheLoai(null); // Đóng overlay sau khi lưu
                    }}
                    onDelete={(theLoai) => {
                        // Hàm xử lý xóa
                        fetch(`/api/theloaiapi/${theLoai.TheLoaiId}`, {
                            method: 'DELETE',
                        }).then(() => fetchData());
                        setCurrentTheLoai(null); // Đóng overlay sau khi xóa
                    }}
                />
            )}
        </div>
    );
};

export default TheLoaiList;
