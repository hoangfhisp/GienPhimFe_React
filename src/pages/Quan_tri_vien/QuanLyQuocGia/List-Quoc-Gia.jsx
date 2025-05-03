import React, { useEffect, useState } from 'react';
import AdminBoard from '../../../components/Admin-board/Admin-board';
import Table from '../../../components/Table/Table';
import Card from '../../../components/Table/Card';
import '../../../components/Admin-board/Admin-board.scss';
import { Link } from 'react-router-dom';

import {
    fetchQuocGias,
    searchQuocGias,
    createQuocGia,
    updateQuocGia,
    deleteQuocGia
} from '../../../services/Admin/QuocGiaService';

const QuocGiaList = () => {
    const [quocGias, setQuocGias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQuocGia, setCurrentQuocGia] = useState(null);
    const [cardAction, setCardAction] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = (page = 1) => {
        const limit = pagination.itemsPerPage || 10;
        setLoading(true);

        fetchQuocGias(page, limit)
            .then(result => {
                // Đảm bảo setQuocGias nhận đúng cấu trúc dữ liệu
                setQuocGias(Array.isArray(result.data) ? result.data : []);

                setPagination(prev => ({
                    ...prev,
                    currentPage: page,
                    totalItems: result.pagination?.total || 0,
                    itemsPerPage: result.pagination?.limit || limit
                }));
            })
            .catch(err => {
                console.error("Lỗi tải quốc gia:", err);
                setQuocGias([]);
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
        searchQuocGias(searchTerm, 1, pagination.itemsPerPage)
            .then(response => {
                setQuocGias(response.data);
                setPagination(prev => ({
                    ...prev,
                    totalItems: response.totalItems
                }));
            })
            .catch(err => console.error("Lỗi tìm kiếm quốc gia:", err));
    };

    useEffect(() => {
        fetchData(1);
    }, []);

    const columns = [
        { header: "Tên quốc gia", accessor: "tenQG" },
        { header: "Mô tả", accessor: "moTaQG" },
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

    const handleAction = (action, quocGia) => {
        setCurrentQuocGia(quocGia);
        setCardAction(action);
    };

    const handleCloseCard = () => {
        setCardAction(null);
        setCurrentQuocGia(null);
    };

    const handleSave = async (quocGiaData) => {
        try {
            setLoading(true);
            if (cardAction === 'create') {
                await createQuocGia(quocGiaData);
            } else {
                await updateQuocGia(quocGiaData.quocGiaId, quocGiaData);
            }
            fetchData(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi lưu quốc gia:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (quocGia) => {
        if (!window.confirm(`Bạn chắc chắn muốn xóa quốc gia "${quocGia.tenQuocGia}"?`)) return;
        try {
            setLoading(true);
            await deleteQuocGia(quocGia.quocGiaId);
            fetchData(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi xóa quốc gia:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="wrapper d-flex">
            <AdminBoard username="Admin" />
            <div id="content" className="content p-4 p-md-5 pt-5">
                <div className="d-flex justify-content-center align-items-center mb-4">
                    <h1 className="mb-0">Danh sách quốc gia</h1>
                </div>
                <hr />

                {/* Navigation links */}
                <div className="mb-4">
                    <div className="d-flex flex-wrap gap-3">
                        <button
                            onClick={() => handleAction('create', {})}
                            className="btn btn-primary"
                        >
                            <i className="fas fa-plus me-2"></i>Thêm quốc gia mới
                        </button>
                        <Link to="/quanly/phim" className="btn btn-outline-secondary">
                            <i className="fas fa-film me-2"></i>Quản lý phim
                        </Link>
                        <Link to="/quanly/daodien" className="btn btn-outline-secondary">
                            <i className="fas fa-user-tie me-2"></i>Quản lý đạo diễn
                        </Link>
                        <Link to="/quanly/dienvien" className="btn btn-outline-secondary">
                            <i className="fas fa-users me-2"></i>Quản lý diễn viên
                        </Link>
                    </div>
                </div>

                {/* Search Section */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Tìm kiếm quốc gia</h5>
                        <form onSubmit={handleSearch} className="input-group">
                            <input
                                className="form-control"
                                name="searchTerm"
                                type="search"
                                placeholder="Nhập tên quốc gia..."
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
                            <h5 className="card-title mb-0">Danh sách quốc gia</h5>
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
                            data={quocGias}
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
                    data={currentQuocGia}
                    columns={columns}
                    onClose={handleCloseCard}
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default QuocGiaList;
