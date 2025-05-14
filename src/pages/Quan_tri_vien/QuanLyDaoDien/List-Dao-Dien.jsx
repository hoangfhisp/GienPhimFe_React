import React, { useEffect, useState } from 'react';
import AdminBoard from '../../../components/Layouts/Admin-board/Admin-board';
import Table from '../../../components/Table/Table';
import Card from '../../../components/Table/Card';
import '../../../components/Layouts/Admin-board/Admin-board.scss';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';

import {
    fetchDaoDiens,
    searchDaoDiens,
    createDaoDien,
    updateDaoDien,
    deleteDaoDien
} from '../../../services/Admin/DaoDienService';

const DaoDienList = () => {
    const [daoDiens, setDaoDiens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDaoDien, setCurrentDaoDien] = useState(null);
    const [cardAction, setCardAction] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0
    });

    const fetchData = (page = 1) => {
        const limit = pagination.itemsPerPage || 10;
        setLoading(true);

        fetchDaoDiens(page, limit)
            .then(result => {
                setDaoDiens(Array.isArray(result.data) ? result.data : []);
                setPagination(prev => ({
                    ...prev,
                    currentPage: page,
                    totalItems: result.pagination?.total || 0,
                    itemsPerPage: result.pagination?.limit || limit
                }));
            })
            .catch(err => {
                console.error("Lỗi tải đạo diễn:", err);
                setDaoDiens([]);
                setPagination(prev => ({ ...prev, totalItems: 0 }));
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > Math.ceil(pagination.totalItems / pagination.itemsPerPage)) return;
        fetchData(newPage);
    };

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        searchDaoDiens(searchTerm, 1, pagination.itemsPerPage)
            .then(response => {
                setDaoDiens(response.data);
                setPagination(prev => ({
                    ...prev,
                    totalItems: response.totalItems
                }));
            })
            .catch(err => console.error("Lỗi tìm kiếm đạo diễn:", err));
    };

    useEffect(() => {
        const debouncedSearch = debounce(() => {
            if (searchTerm.trim() === '') {
                fetchData(1);
            } else {
                handleSearch();
            }
        }, 500);

        debouncedSearch();

        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm, pagination.itemsPerPage]);

    const columns = [
        { header: "Tên đạo diễn", accessor: "tenDG" },
        { header: "Mô tả", accessor: "moTaDG" },
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

    const handleAction = (action, daoDien) => {
        setCurrentDaoDien(daoDien);
        setCardAction(action);
    };

    const handleCloseCard = () => {
        setCardAction(null);
        setCurrentDaoDien(null);
    };

    const handleSave = async (daoDienData) => {
        try {
            setLoading(true);
            if (cardAction === 'create') {
                await createDaoDien(daoDienData);
            } else {
                await updateDaoDien(daoDienData.daoDienId, daoDienData);
            }
            fetchData(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi lưu đạo diễn:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (daoDien) => {
        if (!window.confirm(`Bạn chắc chắn muốn xóa đạo diễn "${daoDien.tenDG}"?`)) return;
        try {
            setLoading(true);
            await deleteDaoDien(daoDien.daoDienId);
            fetchData(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi xóa đạo diễn:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="wrapper d-flex">
            <AdminBoard username="Admin" />
            <div id="content" className="content p-4 p-md-5 pt-5">
                <div className="d-flex justify-content-center align-items-center mb-4">
                    <h1 className="mb-0">Danh sách đạo diễn</h1>
                </div>
                <hr />

                <div className="mb-4">
                    <div className="d-flex flex-wrap gap-3">
                        <button
                            onClick={() => handleAction('create', {})}
                            className="btn btn-primary"
                        >
                            <i className="fas fa-plus me-2"></i>Thêm đạo diễn mới
                        </button>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Tìm kiếm đạo diễn</h5>
                        <form onSubmit={e => e.preventDefault()} className="input-group">
                            <input
                                className="form-control"
                                name="searchTerm"
                                type="search"
                                placeholder="Nhập tên đạo diễn..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <button
                                className="btn btn-primary"
                                type="submit"
                                onClick={handleSearch}
                            >
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

                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="card-title mb-0">Danh sách đạo diễn</h5>
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
                            data={daoDiens}
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

            {cardAction && (
                <Card
                    action={cardAction}
                    data={currentDaoDien}
                    columns={columns}
                    onClose={handleCloseCard}
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default DaoDienList;
