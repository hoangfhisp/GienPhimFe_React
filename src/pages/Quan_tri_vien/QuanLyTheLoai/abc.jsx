import React, { useEffect, useState } from 'react';
import AdminBoard from '../../../components/Layouts/Admin-board/Admin-board';
import Table from '../../../components/Table/Table';
import Card from '../../../components/Table/Card';
import '../../../components/Layouts/Admin-board/Admin-board.scss';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';

import {
    fetchTheLoais,
    searchTheLoais,
    createTheLoai,
    updateTheLoai,
    deleteTheLoai
} from '../../../services/Admin/TheLoaiService';

const TheLoaiList = () => {
    const [theLoais, setTheLoais] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTheLoai, setCurrentTheLoai] = useState(null);
    const [cardAction, setCardAction] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = (page = 1) => {
        const limit = pagination.itemsPerPage || 10;
        setLoading(true);

        fetchTheLoais(page, limit)
            .then(result => {
                setTheLoais(Array.isArray(result.data) ? result.data : []);
                setPagination(prev => ({
                    ...prev,
                    currentPage: page,
                    totalItems: result.pagination?.total || 0,
                    itemsPerPage: result.pagination?.limit || limit
                }));
            })
            .catch(err => {
                console.error("Lỗi tải thể loại:", err);
                setTheLoais([]);
                setPagination(prev => ({ ...prev, totalItems: 0 }));
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0
    });

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > Math.ceil(pagination.totalItems / pagination.itemsPerPage)) return;
        fetchData(newPage);
    };

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        searchTheLoais(searchTerm, 1, pagination.itemsPerPage)
            .then(response => {
                setTheLoais(response.data);
                setPagination(prev => ({
                    ...prev,
                    totalItems: response.totalItems
                }));
            })
            .catch(err => console.error("Lỗi tìm kiếm thể loại:", err));
    };


    // Cập nhật searchTerm với debounce
    useEffect(() => {
        const debouncedSearch = debounce(() => {
            if (searchTerm.trim() === '') {
                fetchData(1);  // Nếu không có từ khóa tìm kiếm, tải lại tất cả dữ liệu.
                return;
            }

            handleSearch();  // Gọi trực tiếp `handleSearch` mà không cần sự kiện.
        }, 500);  // Thời gian debounce là 500ms

        debouncedSearch();

        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm, pagination.itemsPerPage]);  // Chạy lại khi `searchTerm` hoặc `itemsPerPage` thay đổi


    const columns = [
        { header: "Tên thể loại", accessor: "tenTL" },
        { header: "Mô tả", accessor: "moTa" },
        {
            header: "Tạo lúc",
            accessor: "thoiGianTao",
            render: row => new Date(row.thoiGianTao).toLocaleString()
        },
        {
            header: "Cập nhật",
            accessor: "thoiGianCapNhat",
            render: row => new Date(row.thoiGianCapNhat).toLocaleString()
        }
    ];

    const handleAction = (action, theLoai) => {
        setCurrentTheLoai(theLoai);
        setCardAction(action);
    };

    const handleCloseCard = () => {
        setCardAction(null);
        setCurrentTheLoai(null);
    };

    const handleSave = async (theLoaiData) => {
        try {
            setLoading(true);
            if (cardAction === 'create') {
                await createTheLoai(theLoaiData);
            } else {
                await updateTheLoai(theLoaiData.theLoaiId, theLoaiData);
            }
            fetchData(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi lưu thể loại:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (theLoai) => {
        if (!window.confirm(`Bạn chắc chắn muốn xóa thể loại "${theLoai.tenTL}"?`)) return;
        try {
            setLoading(true);
            await deleteTheLoai(theLoai.theLoaiId);
            fetchData(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi xóa thể loại:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="wrapper d-flex">
            <AdminBoard username="Admin" />
            <div id="content" className="content p-4 p-md-5 pt-5">
                <div className="d-flex justify-content-center align-items-center mb-4">
                    <h1 className="mb-0">Danh sách thể loại</h1>
                </div>
                <hr />

                {/* Navigation links */}
                <div className="mb-4">
                    <div className="d-flex flex-wrap gap-3">
                        <button
                            onClick={() => handleAction('create', {})}
                            className="btn btn-primary"
                        >
                            <i className="fas fa-plus me-2"></i>Thêm thể loại mới
                        </button>
                    </div>
                </div>

                {/* Search Section */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Tìm kiếm thể loại</h5>
                        <form onSubmit={handleSearch} className="input-group">
                            <input
                                className="form-control"
                                name="searchTerm"
                                type="search"
                                placeholder="Nhập tên thể loại..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <button className="btn btn-primary" type="submit">
                                <i className="fas fa-search me-2"></i>Tìm kiếm
                            </button>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    fetchData();
                                }}
                                className="btn btn-outline-secondary"
                                type="button"
                            >
                                <i className="fas fa-times me-2"></i>Xóa
                            </button>
                        </form>
                    </div>
                </div>

                {/* Table Section */}
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="card-title mb-0">Danh sách thể loại</h5>
                            <button
                                onClick={fetchData}
                                className="btn btn-sm btn-outline-primary"
                                disabled={loading}
                            >
                                <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''} me-2`}></i>
                                {loading ? 'Đang tải...' : 'Làm mới'}
                            </button>
                        </div>

                        <Table
                            columns={columns}
                            data={theLoais}
                            loading={loading}
                            totalItems={pagination.totalItems}
                            currentPage={pagination.currentPage}
                            itemsPerPage={pagination.itemsPerPage}
                            actions={['view', 'edit', 'delete']}
                            onAction={handleAction}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>

            {/* Card Overlay */}
            {cardAction && (
                <Card
                    action={cardAction}
                    data={currentTheLoai}
                    columns={columns}
                    onClose={handleCloseCard}
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default TheLoaiList;
