import { useEffect, useState } from "react";
import Table from "../../Table/Table";
import * as AuthenticationService from "../../../services/Admin/AuthenticationService";
import Card from '../../Table/Card';

export default function ListRole({ page, limit, data, pagination, onPageChange }) {
    const [listRoleResult, setListRoleResult] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentRole, setCurrentRole] = useState(null);
    const [cardAction, setCardAction] = useState(null);
    const [formFields, setFormFields] = useState([]);

    //Dùng để tái sử dụng fetchApi
    const fetchApi = async (currentPage = page, currentLimit = limit) => {
        setLoading(true);
        try {
            const result = await AuthenticationService.fetchRoles(currentPage, currentLimit);
            setListRoleResult(result.data);
            onPageChange(result.pagination);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu vai trò:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (data && data.length > 0) {
            setListRoleResult(data);
        } else {
            fetchApi();
        }
    }, [data, limit, page]);

    // Lấy các trường form
    useEffect(() => {
        const fetchFormFields = async () => {
            try {
                const fields = await AuthenticationService.getRoleFormFields();
                setFormFields(fields);
            } catch (error) {
                console.error("Lỗi khi tải trường form:", error);
            }
        };

        fetchFormFields();
    }, []);

    // Thực hiện thao tác CRUD (Xem, chỉnh sửa, xóa)
    const handleAction = (action, listRoleResult) => {
        setCurrentRole(listRoleResult);
        setCardAction(action);
    };

    //Đóng thẻ card
    const handleCloseCard = () => {
        setCardAction(null);
        setCurrentRole(null);
    };

    // Hàm xử lý lưu vai trò (Tạo mới hoặc Cập nhật)
    const handleSave = async (roleData) => {
        try {
            setLoading(true);

            // Nếu thao tác là 'create', thêm thoiGianTao và thoiGianCapNhat
            if (cardAction === 'create') {
                roleData.thoiGianTao = new Date().toISOString(); // Thêm thời gian tạo
                roleData.thoiGianCapNhat = new Date().toISOString(); // Thêm thời gian cập nhật
                await AuthenticationService.createRole(roleData); // Tạo mới vai trò
            } else {
                // Nếu là 'edit', giữ nguyên thời gian cập nhật, không thay đổi thoiGianTao
                const id = roleData.get ? roleData.get("roleId") : roleData.roleId;
                await AuthenticationService.updateRole(id, roleData); // Cập nhật vai trò
            }

            // Sau khi lưu xong, gọi lại dữ liệu để cập nhật
            fetchApi(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi lưu vai trò:", error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý xóa vai trò
    const handleDelete = async (role) => {
        if (!window.confirm(`Bạn chắc chắn muốn xóa vai trò "${role.roleName}"?`)) return;

        try {
            setLoading(true);
            // Chú ý sử dụng role.roleId thay vì role.id
            await AuthenticationService.deleteRole(role.roleId); // Xóa vai trò
            // Sau khi xóa xong, gọi lại dữ liệu để cập nhật
            fetchApi(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi xóa vai trò:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: "Tên vai trò", accessor: "roleName" },
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
                        <i className="fas fa-plus me-2"></i>Thêm vai trò mới
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">Danh sách vai trò</h5>
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
                        data={listRoleResult}
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
                    data={currentRole}
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