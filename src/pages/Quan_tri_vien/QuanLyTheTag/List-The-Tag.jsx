import React, { useEffect, useState } from 'react';
import AdminBoard from '../../../components/Admin-board/Admin-board';
import Table from '../../../components/Table/Table';
import '../../../components/Admin-board/Admin-board.scss';
import Card from '../../../components/Table/Card';

const TheTagList = () => {
    const [theTagList, setTheTagList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTheTag, setCurrentTheTag] = useState(null); // Lưu thẻ tag hiện tại khi click
    const [tenTheTag, setTenTheTag] = useState('');

    // Lấy danh sách thẻ tag
    const fetchData = () => {
        setLoading(true);
        fetch('/api/thetagapi') // Thay '/api/thetagapi' bằng API thực tế của bạn
            .then(res => res.json())
            .then(data => {
                setTheTagList(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi tải thẻ tag:", err);
                setLoading(false);
            });
    };

    // Tìm kiếm thẻ tag theo tên
    const handleTimKiem = e => {
        e.preventDefault();
        fetch(`/api/thetagapi/timkiem?tenTheTag=${tenTheTag}`) // Thay '/api/thetagapi/timkiem' bằng API thực tế
            .then(res => res.json())
            .then(setTheTagList);
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
        { header: "Tên thẻ tag", accessor: "TenT" },
        { header: "Mô tả", accessor: "MoTaT" },
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
                    <button onClick={() => setCurrentTheTag({ ...row, action: 'view' })}>Xem chi tiết</button> |{' '}
                    <button onClick={() => setCurrentTheTag({ ...row, action: 'edit' })}>Chỉnh sửa</button> |{' '}
                    <button onClick={() => setCurrentTheTag({ ...row, action: 'delete' })}>Xóa</button>
                </>
            ),
        }
    ];

    return (
        <div className="wrapper d-flex">
            <AdminBoard username="Admin" />
            <div id="content" className="content p-4 p-md-5 pt-5">
                <h1>Danh sách thẻ tag</h1>
                <hr />

                {/* Thêm thẻ tag mới */}
                <div className="mb-4">
                    <button onClick={() => setCurrentTheTag({ action: 'create' })} className="title me-3">
                        Thêm thẻ tag mới
                    </button>
                </div>

                {/* Bộ lọc & Tìm kiếm */}
                <div className="d-flex flex-wrap justify-content-between align-items-center filter-container mb-4">
                    <form className="d-flex timkiemB mb-2" onSubmit={handleTimKiem}>
                        <input
                            className="form-control searchbar me-2"
                            name="tenTheTag"
                            type="search"
                            placeholder="Nhập tên thẻ tag..."
                            value={tenTheTag}
                            onChange={e => setTenTheTag(e.target.value)}
                        />
                        <button className="title" type="submit">Tìm</button>
                    </form>
                </div>

                {/* Hiển thị bảng thẻ tag */}
                <Table columns={columns} data={theTagList} loading={loading} />

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
            {currentTheTag && (
                <Card
                    action={currentTheTag.action} // Thực hiện hành động create, edit, view, delete
                    theTag={currentTheTag}
                    columns={columns}
                    onClose={() => setCurrentTheTag(null)} // Đóng overlay khi không cần
                    onSave={(theTag) => {
                        if (currentTheTag && currentTheTag.action === 'edit') {
                            // Cập nhật thẻ tag
                            fetch(`/api/thetagapi/${currentTheTag.TheTagId}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(theTag),
                            }).then(() => fetchData());
                        } else if (currentTheTag && currentTheTag.action === 'create') {
                            // Thêm mới thẻ tag
                            fetch('/api/thetagapi', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(theTag),
                            }).then(() => fetchData());
                        }
                        setCurrentTheTag(null); // Đóng overlay sau khi lưu
                    }}
                    onDelete={(theTag) => {
                        // Hàm xử lý xóa
                        fetch(`/api/thetagapi/${theTag.TheTagId}`, {
                            method: 'DELETE',
                        }).then(() => fetchData());
                        setCurrentTheTag(null); // Đóng overlay sau khi xóa
                    }}
                />
            )}
        </div>
    );
};

export default TheTagList;
