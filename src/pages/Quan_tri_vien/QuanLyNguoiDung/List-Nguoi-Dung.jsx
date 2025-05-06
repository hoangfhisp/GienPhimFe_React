import React, { useEffect, useState } from 'react';
import AdminBoard from '../../../components/Admin-board/Admin-board';
import Table from '../../../components/Table/Table';
import Card from '../../../components/Table/Card';
import '../../../components/Admin-board/Admin-board.scss';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';
import {
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    searchNguoiDungs
} from '../../../services/Admin/UserService';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
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

        fetchUsers(page, limit)
            .then(result => {
                setUsers(Array.isArray(result.data) ? result.data : []);
                setPagination(prev => ({
                    ...prev,
                    currentPage: page,
                    totalItems: result.pagination?.total || 0,
                    itemsPerPage: result.pagination?.limit || limit
                }));
            })
            .catch(err => {
                console.error("Lỗi tải người dùng:", err);
                setUsers([]);
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
        searchNguoiDungs(searchTerm, 1, pagination.itemsPerPage)
            .then(response => {
                setUsers(response?.data || []);
                setPagination(prev => ({
                    ...prev,
                    totalItems: response?.totalItems || 0
                }));
            })
            .catch(err => console.error("Lỗi tìm kiếm người dùng:", err));
    };

    // Hàm debounce
    const debouncedSearch = debounce(() => {
        if (searchTerm.trim() === '') {
            fetchData(1);  // Nếu không có từ khóa tìm kiếm, tải lại danh sách người dùng
        } else {
            handleSearch();  // Nếu có từ khóa tìm kiếm, gọi hàm tìm kiếm
        }
    }, 500);

    // Thực hiện debounce khi searchTerm thay đổi
    useEffect(() => {
        debouncedSearch();
        return () => debouncedSearch.cancel();  // Hủy debounce khi component unmount
    }, [searchTerm, pagination.itemsPerPage]);

    useEffect(() => {
        fetchData(1);  // Lần đầu tiên gọi để tải dữ liệu
    }, []);

    const columns = [
        { header: "Tên người dùng", accessor: "userName" },
        { header: "Email", accessor: "email" },
        {
            header: "Vai trò",
            accessor: "roles",
            render: row => {
                const roles = row.roles;
                return roles && roles.length > 0 ? roles.join(", ") : "Null";
            }
        },
        {
            header: "Ngày tạo",
            accessor: "thoiGianTao",
            render: row => new Date(row.thoiGianTao).toLocaleString()
        },
        {
            header: "Ngày cập nhật",
            accessor: "thoiGianCapNhat",
            render: row => new Date(row.thoiGianCapNhat).toLocaleString()
        }
    ];

    const handleAction = (action, user) => {
        setCurrentUser(user);
        setCardAction(action);
    };

    const handleCloseCard = () => {
        setCardAction(null);
        setCurrentUser(null);
    };

    const handleSave = async (userData) => {
        try {
            setLoading(true);
            if (cardAction === 'create') {
                await createUser(userData);
            } else {
                await updateUser(userData.id, userData);
            }
            fetchData(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi lưu người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (user) => {
        if (!window.confirm(`Bạn chắc chắn muốn xóa người dùng "${user.username}"?`)) return;
        try {
            setLoading(true);
            await deleteUser(user.id);
            fetchData(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="wrapper d-flex">
            <AdminBoard username="Admin" />
            <div id="content" className="content p-4 p-md-5 pt-5">
                <div className="d-flex justify-content-center align-items-center mb-4">
                    <h1 className="mb-0">Danh sách người dùng</h1>
                </div>
                <hr />

                {/* Navigation links */}
                <div className="mb-4">
                    <div className="d-flex flex-wrap gap-3">
                        <button
                            onClick={() => handleAction('create', {})}
                            className="btn btn-primary"
                        >
                            <i className="fas fa-plus me-2"></i>Thêm người dùng mới
                        </button>
                    </div>
                </div>

                {/* Search Section */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Tìm kiếm người dùng</h5>
                        <form onSubmit={e => e.preventDefault()} className="input-group">
                            <input
                                className="form-control"
                                name="searchTerm"
                                type="search"
                                placeholder="Nhập tên người dùng..."
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

                {/* Table Section */}
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="card-title mb-0">Danh sách người dùng</h5>
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
                            data={users}
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
                    data={currentUser}
                    columns={columns}
                    onClose={handleCloseCard}
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default UserList;
