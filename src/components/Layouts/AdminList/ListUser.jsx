import { useEffect, useState } from "react";
import Table from "../../Table/Table";
import * as AuthenticationService from "../../../services/Admin/AuthenticationService";
import Card from '../../Table/Card';

export default function ListUser({ page, limit, data, pagination, onPageChange }) {
    const [listUserResult, setListUserResult] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentUser, setCurrentUser] = useState(null);
    const [cardAction, setCardAction] = useState(null);
    const [formFields, setFormFields] = useState([]);

    const normalizeUserForForm = (user = {}) => {
        const {
            gioiTinh = 3,
            emailConfirmed = false,
            phoneNumberConfirmed = false,
            twoFactorEnabled = false,
            lockoutEnabled = false,
            accessFailedCount = 0,
            roles = [],
            ...rest
        } = user;

        const extractRoleIds = (roles) => {
            if (!Array.isArray(roles)) return [];
            return roles.map(role => {
                // role có thể là object hoặc string
                if (typeof role === 'object' && role !== null && 'value' in role) return role.value;
                if (typeof role === 'string') return role;
                return null;
            }).filter(Boolean);
        };

        return {
            ...rest,
            gioiTinh,
            emailConfirmed,
            phoneNumberConfirmed,
            twoFactorEnabled,
            lockoutEnabled,
            accessFailedCount,
            roles: extractRoleIds(roles),
        };
    };


    //Dùng để tái sử dụng fetchApi
    const fetchApi = async (currentPage = page, currentLimit = limit) => {
        setLoading(true);
        try {
            const result = await AuthenticationService.fetchUsers(currentPage, currentLimit);
            setListUserResult(result.data);
            onPageChange(result.pagination);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (data && data.length > 0) {
            setListUserResult(data);
        } else {
            fetchApi();
        }
    }, [data, limit, page]);

    // Lấy các trường form
    useEffect(() => {
        const fetchFormFields = async () => {
            try {
                const fields = await AuthenticationService.GetUserFormFields();
                setFormFields(fields);
            } catch (error) {
                console.error("Lỗi khi tải trường form:", error);
            }
        };

        fetchFormFields();
    }, []);

    // Thực hiện thao tác CRUD (Xem, chỉnh sửa, xóa)
    const handleAction = (action, listUserResult) => {
        console.log("Dữ liệu listUserResult trước khi normalize:", listUserResult); // Log 1
        const normalized = normalizeUserForForm(listUserResult);
        console.log("Dữ liệu sau khi normalize:", normalized); // Log 2
        setCurrentUser(normalized);
        setCardAction(action);
    };


    //Đóng thẻ card
    const handleCloseCard = () => {
        setCardAction(null);
        setCurrentUser(null);
    };

    // Hàm xử lý lưu người dùng (Cập nhật)
    const handleSave = async (userData) => {
        try {
            setLoading(true);

            if (cardAction === 'edit') {
                const id = userData.get ? userData.get("userId") : userData.userId;
                await AuthenticationService.updateUser(id, userData);  // Cập nhật người dùng
            }

            // Sau khi lưu xong, gọi lại dữ liệu để cập nhật
            fetchApi(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi lưu người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý xóa người dùng
    const handleDelete = async (user) => {
        if (!window.confirm(`Bạn chắc chắn muốn xóa người dùng "${user.userName}"?`)) return;

        try {
            setLoading(true);
            await AuthenticationService.deleteUser(user.userId);  // Xóa người dùng
            // Sau khi xóa xong, gọi lại dữ liệu để cập nhật
            fetchApi(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: "Tên người dùng", accessor: "userName" },
        { header: "Email", accessor: "email" },
        {
            header: "Vai trò",
            accessor: "roles",
            render: row => {
                const roleField = formFields.find(f => f.name === 'roles');
                const options = roleField?.options || [];

                const roles = row.roles || [];
                const roleNames = roles.map(id => {
                    const matched = options.find(opt => opt.value === id);
                    return matched?.label || id;
                });

                return roleNames.length > 0 ? roleNames.join(', ') : 'Null';
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

    return (
        <>
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

            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">Danh sách người dùng</h5>
                        <button
                            onClick={fetchApi}
                            className="btn btn-sm btn-outline-primary"
                            disabled={loading}
                        >
                            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''} me-2`}></i>
                            {loading ? 'Đang tải...' : 'Làm mới'}
                        </button>
                    </div>

                    <Table
                        columns={columns}
                        data={listUserResult}
                        loading={loading}
                        actions={['view', 'edit', 'delete']}
                        onAction={handleAction}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>

            {cardAction && (
                <Card
                    action={cardAction}
                    data={currentUser}
                    columns={columns}
                    formFields={formFields}
                    onClose={handleCloseCard}
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            )}
        </>
    );
};