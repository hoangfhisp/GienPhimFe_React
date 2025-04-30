import React, { useEffect, useState } from 'react';
import AdminBoard from '../../../components/Admin-board/Admin-board';
import Table from '../../../components/Table/Table';
import '../../../components/Admin-board/Admin-board.scss';
import Card from '../../../components/Table/Card'; // Đảm bảo Card được import đúng

const QuocGiaList = () => {
    const [quocGiaList, setQuocGiaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQuocGia, setCurrentQuocGia] = useState(null); // Lưu quốc gia hiện tại khi click
    const [tenQuocGia, setTenQuocGia] = useState('');

    // Lấy danh sách quốc gia
    const fetchData = () => {
        setLoading(true);
        fetch('/api/quocgiaapi') // Thay '/api/quocgiaapi' bằng API thực tế của bạn
            .then(res => res.json())
            .then(data => {
                setQuocGiaList(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi tải quốc gia:", err);
                setLoading(false);
            });
    };

    // Tìm kiếm quốc gia theo tên
    const handleTimKiem = e => {
        e.preventDefault();
        fetch(`/api/quocgiaapi/timkiem?tenQuocGia=${tenQuocGia}`) // Thay '/api/quocgiaapi/timkiem' bằng API thực tế
            .then(res => res.json())
            .then(setQuocGiaList);
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
        { header: "Tên quốc gia", accessor: "TenQG" },
        { header: "Mô tả", accessor: "MoTaQG" },
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
                    <button onClick={() => setCurrentQuocGia({ ...row, action: 'view' })}>Xem chi tiết</button> |{' '}
                    <button onClick={() => setCurrentQuocGia({ ...row, action: 'edit' })}>Chỉnh sửa</button> |{' '}
                    <button onClick={() => setCurrentQuocGia({ ...row, action: 'delete' })}>Xóa</button>
                </>
            ),
        }
    ];

    return (
        <div className="wrapper d-flex">
            <AdminBoard username="Admin" />
            <div id="content" className="content p-4 p-md-5 pt-5">
                <h1>Danh sách quốc gia</h1>
                <hr />

                {/* Thêm quốc gia mới */}
                <div className="mb-4">
                    <button onClick={() => setCurrentQuocGia({ action: 'create' })} className="title me-3">
                        Thêm quốc gia mới
                    </button>
                </div>

                {/* Bộ lọc & Tìm kiếm */}
                <div className="d-flex flex-wrap justify-content-between align-items-center filter-container mb-4">
                    <form className="d-flex timkiemB mb-2" onSubmit={handleTimKiem}>
                        <input
                            className="form-control searchbar me-2"
                            name="tenQuocGia"
                            type="search"
                            placeholder="Nhập tên quốc gia..."
                            value={tenQuocGia}
                            onChange={e => setTenQuocGia(e.target.value)}
                        />
                        <button className="title" type="submit">Tìm</button>
                    </form>
                </div>

                {/* Hiển thị bảng quốc gia */}
                <Table columns={columns} data={quocGiaList} loading={loading} />

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
            {currentQuocGia && (
                <Card
                    action={currentQuocGia.action} // Thực hiện hành động create, edit, view, delete
                    quocGia={currentQuocGia}
                    columns={columns}
                    onClose={() => setCurrentQuocGia(null)} // Đóng overlay khi không cần
                    onSave={(quocGia) => {
                        if (currentQuocGia && currentQuocGia.action === 'edit') {
                            // Cập nhật quốc gia
                            fetch(`/api/quocgiaapi/${currentQuocGia.QuocGiaId}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(quocGia),
                            }).then(() => fetchData());
                        } else if (currentQuocGia && currentQuocGia.action === 'create') {
                            // Thêm mới quốc gia
                            fetch('/api/quocgiaapi', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(quocGia),
                            }).then(() => fetchData());
                        }
                        setCurrentQuocGia(null); // Đóng overlay sau khi lưu
                    }}
                    onDelete={(quocGia) => {
                        // Hàm xử lý xóa
                        fetch(`/api/quocgiaapi/${quocGia.QuocGiaId}`, {
                            method: 'DELETE',
                        }).then(() => fetchData());
                        setCurrentQuocGia(null); // Đóng overlay sau khi xóa
                    }}
                />
            )}
        </div>
    );
};

export default QuocGiaList;
