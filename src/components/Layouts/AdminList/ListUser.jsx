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
        console.log('=== NORMALIZE USER FOR FORM ===');
        console.log('Original user data:', user);

        // Đảm bảo tất cả các trường cần thiết đều có giá trị
        const normalized = {
            // Thông tin cơ bản
            id: user.id || user.userId || '',
            userId: user.userId || user.id || '',
            userName: user.userName || '',
            email: user.email || '',
            nameND: user.nameND || '',
            phoneNumber: user.phoneNumber || '',

            // Thông tin giới tính và trạng thái - FIX: Đảm bảo boolean được xử lý đúng
            gioiTinh: user.gioiTinh !== undefined ? String(user.gioiTinh) : '3',
            emailConfirmed: Boolean(user.emailConfirmed === true || user.emailConfirmed === 'true' || user.emailConfirmed === 1),
            phoneNumberConfirmed: Boolean(user.phoneNumberConfirmed === true || user.phoneNumberConfirmed === 'true' || user.phoneNumberConfirmed === 1),
            twoFactorEnabled: Boolean(user.twoFactorEnabled === true || user.twoFactorEnabled === 'true' || user.twoFactorEnabled === 1),
            lockoutEnabled: Boolean(user.lockoutEnabled === true || user.lockoutEnabled === 'true' || user.lockoutEnabled === 1),

            // Thông tin số
            accessFailedCount: user.accessFailedCount || 0,
            soDuTaiKhoan: user.soDuTaiKhoan || 0,

            // Thời gian
            lockoutEnd: user.lockoutEnd ? new Date(user.lockoutEnd).toISOString().slice(0, 16) : '',
            thoiGianTao: user.thoiGianTao || '',
            thoiGianCapNhat: user.thoiGianCapNhat || '',

            // Vai trò - xử lý đặc biệt
            roles: (() => {
                if (!user.roles) return [];
                if (Array.isArray(user.roles)) {
                    return user.roles.map(role => {
                        if (typeof role === 'object' && role !== null && 'value' in role) {
                            return role.value;
                        }
                        return String(role);
                    });
                }
                return [String(user.roles)];
            })(),

            // Các trường khác (nếu có)
            ...Object.keys(user).reduce((acc, key) => {
                if (![
                    'id', 'userId', 'userName', 'email', 'nameND', 'phoneNumber',
                    'gioiTinh', 'emailConfirmed', 'phoneNumberConfirmed',
                    'twoFactorEnabled', 'lockoutEnabled', 'accessFailedCount',
                    'soDuTaiKhoan', 'lockoutEnd', 'thoiGianTao', 'thoiGianCapNhat', 'roles'
                ].includes(key)) {
                    acc[key] = user[key];
                }
                return acc;
            }, {})
        };

        console.log('Normalized user data:', normalized);
        console.log('Boolean values check:', {
            emailConfirmed: normalized.emailConfirmed,
            type: typeof normalized.emailConfirmed,
            phoneNumberConfirmed: normalized.phoneNumberConfirmed,
            twoFactorEnabled: normalized.twoFactorEnabled,
            lockoutEnabled: normalized.lockoutEnabled
        });
        console.log('================================');

        return normalized;
    };

    // Dùng để tái sử dụng fetchApi
    const fetchApi = async (currentPage = page, currentLimit = limit) => {
        setLoading(true);
        try {
            const result = await AuthenticationService.fetchUsers(currentPage, currentLimit);
            console.log("Raw data from API:", result.data);

            // Đảm bảo dữ liệu được xử lý đúng cách
            const processedData = result.data.map(user => ({
                ...user,
                // Đảm bảo các trường quan trọng không bị undefined
                userName: user.userName || '',
                email: user.email || '',
                nameND: user.nameND || '',
                gioiTinh: user.gioiTinh !== undefined ? user.gioiTinh : 3,
                roles: Array.isArray(user.roles) ? user.roles : [],
                // FIX: Đảm bảo boolean fields được xử lý chính xác
                emailConfirmed: Boolean(user.emailConfirmed),
                phoneNumberConfirmed: Boolean(user.phoneNumberConfirmed),
                twoFactorEnabled: Boolean(user.twoFactorEnabled),
                lockoutEnabled: Boolean(user.lockoutEnabled),
                thoiGianTao: user.thoiGianTao || new Date().toISOString(),
                thoiGianCapNhat: user.thoiGianCapNhat || null
            }));

            console.log("Processed data:", processedData);
            setListUserResult(processedData);
            onPageChange(result.pagination);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu người dùng:", error);
            alert("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (data && data.length > 0) {
            console.log("Using provided data:", data);
            setListUserResult(data);
            setLoading(false);
        } else {
            fetchApi();
        }
    }, [data, limit, page]);

    // Lấy các trường form
    useEffect(() => {
        const fetchFormFields = async () => {
            try {
                const fields = await AuthenticationService.GetUserFormFields();
                console.log("=== FORM FIELDS LOADED ===");
                console.log("Form fields from API:", fields);

                // Đảm bảo form fields có đầy đủ thông tin cần thiết
                const processedFields = fields.map(field => {
                    console.log(`Processing field: ${field.name}`, field);

                    // Đảm bảo select fields có options
                    if (field.type === 'select' && !field.options) {
                        console.warn(`Select field ${field.name} missing options`);
                        field.options = [];
                    }

                    return field;
                });

                console.log("Processed form fields:", processedFields);
                console.log("===========================");

                setFormFields(processedFields);
            } catch (error) {
                console.error("Lỗi khi tải trường form:", error);
                // Tạo form fields mặc định nếu không load được từ API
                const defaultFields = [
                    { name: 'userName', label: 'Tên đăng nhập', type: 'text' },
                    { name: 'email', label: 'Email', type: 'email' },
                    { name: 'nameND', label: 'Họ tên', type: 'text' },
                    { name: 'phoneNumber', label: 'Số điện thoại', type: 'text' },
                    {
                        name: 'gioiTinh',
                        label: 'Giới tính',
                        type: 'select',
                        options: [
                            { value: '1', label: 'Nam' },
                            { value: '2', label: 'Nữ' },
                            { value: '3', label: 'Khác' }
                        ]
                    },
                    { name: 'emailConfirmed', label: 'Email đã xác thực', type: 'checkbox' },
                    { name: 'phoneNumberConfirmed', label: 'SĐT đã xác thực', type: 'checkbox' },
                    { name: 'twoFactorEnabled', label: 'Xác thực 2 bước', type: 'checkbox' },
                    { name: 'lockoutEnabled', label: 'Khóa tài khoản', type: 'checkbox' },
                    { name: 'soDuTaiKhoan', label: 'Số dư tài khoản', type: 'number' },
                    {
                        name: 'roles',
                        label: 'Vai trò',
                        type: 'select',
                        multiple: true,
                        options: []
                    }
                ];
                console.log("Using default form fields:", defaultFields);
                setFormFields(defaultFields);
            }
        };

        fetchFormFields();
    }, []);

    // Thực hiện thao tác CRUD (Xem, chỉnh sửa, xóa)
    const handleAction = (action, userResult) => {
        console.log('=== HANDLE ACTION ===');
        console.log('Action:', action);
        console.log('Raw user data received:', userResult);
        console.log('Form fields available:', formFields);

        // Normalize dữ liệu trước khi truyền vào Card
        const normalized = normalizeUserForForm(userResult);
        console.log('Normalized data to send to Card:', normalized);

        // Kiểm tra xem tất cả formFields có dữ liệu không
        formFields.forEach(field => {
            const fieldValue = normalized[field.name];
            console.log(`Field ${field.name}:`, fieldValue, typeof fieldValue);

            // Đảm bảo không có field nào bị thiếu
            if (fieldValue === undefined || fieldValue === null) {
                console.warn(`Field ${field.name} is missing or null, setting default value`);
                if (field.type === 'select' && field.multiple) {
                    normalized[field.name] = [];
                } else if (field.type === 'number') {
                    normalized[field.name] = 0;
                } else if (field.type === 'checkbox') {
                    normalized[field.name] = false;
                } else {
                    normalized[field.name] = '';
                }
            }
        });

        console.log('Final normalized data:', normalized);
        console.log('=====================');

        setCurrentUser(normalized);
        setCardAction(action);
    };

    // Đóng thẻ card
    const handleCloseCard = () => {
        setCardAction(null);
        setCurrentUser(null);
    };

    // Chuẩn bị dữ liệu trước khi gửi lên server
    const prepareUserDataForUpdate = (userData) => {
        const isFormData = userData instanceof FormData;

        if (isFormData) {
            const processedData = new FormData();
            for (let [key, value] of userData.entries()) {
                if (key === 'gioiTinh' && value) {
                    processedData.append(key, parseInt(value));
                } else if (key === 'roles' && value) {
                    if (Array.isArray(value)) {
                        value.forEach(role => processedData.append('roles', role));
                    } else {
                        processedData.append(key, value);
                    }
                } else if (key === 'lockoutEnd' && value) {
                    processedData.append(key, new Date(value).toISOString());
                } else if (['emailConfirmed', 'phoneNumberConfirmed', 'twoFactorEnabled', 'lockoutEnabled'].includes(key)) {
                    processedData.append(key, value === 'true' || value === true);
                } else if (key === 'soDuTaiKhoan' && value) {
                    processedData.append(key, parseFloat(value) || 0);
                } else {
                    processedData.append(key, value);
                }
            }
            return processedData;
        } else {
            return {
                ...userData,
                gioiTinh: userData.gioiTinh ? parseInt(userData.gioiTinh) : null,
                lockoutEnd: userData.lockoutEnd ? new Date(userData.lockoutEnd).toISOString() : null,
                soDuTaiKhoan: userData.soDuTaiKhoan ? parseFloat(userData.soDuTaiKhoan) : null,
                emailConfirmed: Boolean(userData.emailConfirmed),
                phoneNumberConfirmed: Boolean(userData.phoneNumberConfirmed),
                twoFactorEnabled: Boolean(userData.twoFactorEnabled),
                lockoutEnabled: Boolean(userData.lockoutEnabled),
                roles: Array.isArray(userData.roles) ? userData.roles : []
            };
        }
    };

    // Hàm xử lý lưu người dùng (Cập nhật và tạo mới)
    const handleSave = async (userData) => {
        try {
            setLoading(true);

            if (cardAction === 'edit') {
                const id = userData.get ? userData.get("id") || userData.get("userId") : userData.id || userData.userId;

                if (!id) {
                    throw new Error("Không tìm thấy ID người dùng");
                }

                const preparedData = prepareUserDataForUpdate(userData);
                console.log("Dữ liệu gửi lên server (edit):", preparedData);

                const response = await AuthenticationService.updateUser(id, preparedData);
                console.log("Phản hồi từ server (edit):", response);

                if (response.success) {
                    alert("Cập nhật người dùng thành công!");
                } else {
                    throw new Error(response.message || "Cập nhật thất bại");
                }
            } else if (cardAction === 'create') {
                const preparedData = prepareUserDataForUpdate(userData);
                console.log("Dữ liệu gửi lên server (create):", preparedData);

                const response = await AuthenticationService.createUser(preparedData);
                console.log("Phản hồi từ server (create):", response);

                if (response.success) {
                    alert("Tạo người dùng thành công!");
                } else {
                    throw new Error(response.message || "Tạo người dùng thất bại");
                }
            }

            await fetchApi(pagination?.currentPage || 1);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi lưu người dùng:", error);

            let errorMessage = "Có lỗi xảy ra khi xử lý người dùng";
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data.errors) {
                    errorMessage = Array.isArray(error.response.data.errors)
                        ? error.response.data.errors.join(', ')
                        : error.response.data.errors;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý xóa người dùng
    const handleDelete = async (user) => {
        const userId = user.id || user.userId;
        const userName = user.userName || user.nameND || "người dùng này";

        if (!window.confirm(`Bạn chắc chắn muốn xóa "${userName}"?`)) return;

        try {
            setLoading(true);
            const response = await AuthenticationService.deleteUser(userId);

            if (response.success) {
                alert("Xóa người dùng thành công!");
                await fetchApi(pagination?.currentPage || 1);
                handleCloseCard();
            } else {
                throw new Error(response.message || "Xóa thất bại");
            }
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);

            let errorMessage = "Có lỗi xảy ra khi xóa người dùng";
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: "Tên người dùng",
            accessor: "userName",
            render: (row) => row.userName || 'N/A'
        },
        {
            header: "Email",
            accessor: "email",
            render: (row) => row.email || 'N/A'
        },
        {
            header: "Họ tên",
            accessor: "nameND",
            render: (row) => row.nameND || 'Chưa cập nhật'
        },
        {
            header: "Số điện thoại",
            accessor: "phoneNumber",
            render: (row) => row.phoneNumber || 'Chưa cập nhật'
        },
        {
            header: "Giới tính",
            accessor: "gioiTinh",
            render: row => {
                const genderMap = { 1: "Nam", 2: "Nữ", 3: "Khác" };
                return genderMap[row.gioiTinh] || "Không xác định";
            }
        },
        {
            header: "Vai trò",
            accessor: "roles",
            render: row => {
                const roleField = formFields.find(f => f.name === 'roles');
                const options = roleField?.options || [];

                const roles = row.roles || [];
                if (roles.length === 0) return 'Chưa có vai trò';

                const roleNames = roles.map(roleId => {
                    const matched = options.find(opt =>
                        String(opt.value) === String(roleId) ||
                        opt.value === roleId
                    );
                    return matched?.label || `Role ${roleId}`;
                });

                return roleNames.join(', ');
            }
        },
        {
            header: "Email xác thực",
            accessor: "emailConfirmed",
            render: row => (
                <span className={`badge ${row.emailConfirmed ? 'bg-success' : 'bg-warning'}`}>
                    {row.emailConfirmed ? 'Đã xác thực' : 'Chưa xác thực'}
                </span>
            )
        },
        {
            header: "Trạng thái tài khoản",
            accessor: "lockoutEnabled",
            render: row => (
                <span className={`badge ${row.lockoutEnabled ? 'bg-danger' : 'bg-success'}`}>
                    {row.lockoutEnabled ? 'Bị khóa' : 'Hoạt động'}
                </span>
            )
        },
        {
            header: "Số dư tài khoản",
            accessor: "soDuTaiKhoan",
            render: row => {
                const balance = row.soDuTaiKhoan || 0;
                return new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                }).format(balance);
            }
        },
        {
            header: "Ngày tạo",
            accessor: "thoiGianTao",
            render: row => {
                if (!row.thoiGianTao) return 'N/A';
                try {
                    return new Date(row.thoiGianTao).toLocaleString('vi-VN');
                } catch (error) {
                    return 'Ngày không hợp lệ';
                }
            }
        },
        {
            header: "Ngày cập nhật",
            accessor: "thoiGianCapNhat",
            render: row => {
                if (!row.thoiGianCapNhat) return 'Chưa cập nhật';
                try {
                    return new Date(row.thoiGianCapNhat).toLocaleString('vi-VN');
                } catch (error) {
                    return 'Ngày không hợp lệ';
                }
            }
        }
    ];

    return (
        <>
            <div className="mb-4">
                <div className="d-flex flex-wrap gap-3">
                    <button
                        onClick={() => handleAction('create', {})}
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        <i className="fas fa-plus me-2"></i>Thêm người dùng mới
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <button
                            onClick={() => fetchApi()}
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
                        pagination={pagination}
                    />
                </div>
            </div>

            {cardAction && (
                <Card
                    action={cardAction}
                    data={currentUser}
                    formFields={formFields}
                    onClose={handleCloseCard}
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            )}
        </>
    );
}