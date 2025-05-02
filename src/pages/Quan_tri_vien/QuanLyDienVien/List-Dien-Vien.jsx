import React, { useEffect, useState } from 'react';
import AdminBoard from '../../../components/Admin-board/Admin-board';
import Table from '../../../components/Table/Table';
import Card from '../../../components/Table/Card';
import '../../../components/Admin-board/Admin-board.scss';
import { Link } from 'react-router-dom';

import {
    fetchDienViens,
    searchDienViens,
    createDienVien,
    updateDienVien,
    deleteDienVien
} from '../../../services/Admin/DienVienService';

const DienVienList = () => {
    const [dienViens, setDienViens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDienVien, setCurrentDienVien] = useState(null);
    const [cardAction, setCardAction] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = (page = 1) => {
        const limit = pagination.itemsPerPage || 10;
        setLoading(true);

        fetchDienViens(page, limit)
            .then(result => {
                setDienViens(Array.isArray(result.data) ? result.data : []);

                setPagination(prev => ({
                    ...prev,
                    currentPage: page,
                    totalItems: result.pagination?.total || 0,
                    itemsPerPage: result.pagination?.limit || limit
                }));
            })
            .catch(err => {
                console.error("Lỗi tải diễn viên:", err);
                setDienViens([]);
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

    const handleSearch = e => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        searchDienViens(searchTerm, 1, pagination.itemsPerPage)
            .then(response => {
                setDienViens(response.data);
                setPagination(prev => ({
                    ...prev,
                    totalItems: response.totalItems
                }));
            })
            .catch(err => console.error("Lỗi tìm kiếm diễn viên:", err));
    };

    useEffect(() => {
        fetchData(1);
    }, []);

    const columns = [
        { header: "Tên diễn viên", accessor: "tenDV" },
        { header: "Mô tả", accessor: "moTaDV" },
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

    const handleAction = (action, dienVien) => {
        setCurrentDienVien(dienVien);
        setCardAction(action);
    };

    const handleCloseCard = () => {
        setCardAction(null);
        setCurrentDienVien(null);
    };

    const handleSave = async (dienVienData) => {
        try {
            setLoading(true);
            if (cardAction === 'create') {
                await createDienVien(dienVienData);
            } else {
                await updateDienVien(dienVienData.dienVienId, dienVienData);
            }
            fetchData(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi lưu diễn viên:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (dienVien) => {
        if (!window.confirm(`Bạn chắc chắn muốn xóa diễn viên "${dienVien.tenDV}"?`)) return;
        try {
            setLoading(true);
            await deleteDienVien(dienVien.dienVienId);
            fetchData(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi xóa diễn viên:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="wrapper d-flex">
            <AdminBoard username="Admin" />
            <div id="content" className="content p-4 p-md-5 pt-5">
                <div className="d-flex justify-content-center align-items-center mb-4">
                    <h1 className="mb-0">Danh sách diễn viên</h1>
                </div>
                <hr />

                {/* Navigation links */}
                <div className="mb-4">
                    <div className="d-flex flex-wrap gap-3">
                        <button
                            onClick={() => handleAction('create', {})}
                            className="btn btn-primary"
                        >
                            <i className="fas fa-plus me-2"></i>Thêm diễn viên mới
                        </button>
                        <Link to="/quanly/phim" className="btn btn-outline-secondary">
                            <i className="fas fa-film me-2"></i>Quản lý phim
                        </Link>
                        <Link to="/quanly/daodien" className="btn btn-outline-secondary">
                            <i className="fas fa-user-tie me-2"></i>Quản lý đạo diễn
                        </Link>
                        <Link to="/quanly/theloai" className="btn btn-outline-secondary">
                            <i className="fas fa-tags me-2"></i>Quản lý thể loại
                        </Link>
                    </div>
                </div>

                {/* Search Section */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Tìm kiếm diễn viên</h5>
                        <form onSubmit={handleSearch} className="input-group">
                            <input
                                className="form-control"
                                name="searchTerm"
                                type="search"
                                placeholder="Nhập tên diễn viên..."
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
                            <h5 className="card-title mb-0">Danh sách diễn viên</h5>
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
                            data={dienViens}
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
                    data={currentDienVien}
                    columns={columns}
                    onClose={handleCloseCard}
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default DienVienList;
