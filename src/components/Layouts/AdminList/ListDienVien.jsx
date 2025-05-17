import { useEffect, useState } from "react";
import Table from "../../../components/Table/Table";
import * as movieServices from "../../../services/Admin/MovieService";
import Card from '../../../components/Table/Card';

export default function ListDienVien({ page, limit, data, pagination, onPageChange }) {
    const [listDienVienResult, setListDienVienResult] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentDienVien, setCurrentDienVien] = useState(null);
    const [cardAction, setCardAction] = useState(null);
    const [formFields, setFormFields] = useState([]);

    //Dùng để tái sử dụng fetchApi
    const fetchApi = async (currentPage = page, currentLimit = limit) => {
        setLoading(true);
        try {
            const result = await movieServices.fetchDienViens(currentPage, currentLimit);
            setListDienVienResult(result.data);
            onPageChange(result.pagination);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu đạo diễn:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (data && data.length > 0) {
            setListDienVienResult(data);
        } else {
            fetchApi();
        }
    }, [data, limit, page]);

    useEffect(() => {
        const fetchFormFields = async () => {
            try {
                const fields = await movieServices.getDienVienFormFields();
                setFormFields(fields);
            } catch (error) {
                console.error("Lỗi khi tải trường form:", error);
            }
        };

        fetchFormFields();
    }, []);

    // Thực hiện thao tác CRUD (Xem, chỉnh sửa, xóa)
    const handleAction = (action, listDienVienResult) => {
        setCurrentDienVien(listDienVienResult);
        setCardAction(action);
    };

    //Đóng thẻ card
    const handleCloseCard = () => {
        setCardAction(null);
        setCurrentDienVien(null);
    };

    // Hàm xử lý lưu diễn viên (Tạo mới hoặc Cập nhật)
    const handleSave = async (dienVienData) => {
        try {
            setLoading(true);

            if (cardAction === 'create') {
                dienVienData.thoiGianTao = new Date().toISOString();
                dienVienData.thoiGianCapNhat = new Date().toISOString();
                await movieServices.createDienVien(dienVienData); // Tạo mới diễn viên
            } else {
                const id = dienVienData.get ? dienVienData.get("dienVienId") : dienVienData.dienVienId;
                await movieServices.updateDienVien(id, dienVienData); // Cập nhật diễn viên
            }

            fetchApi(pagination.currentPage); // Gọi lại dữ liệu
            handleCloseCard(); // Đóng form sau khi lưu
        } catch (error) {
            console.error("Lỗi khi lưu diễn viên:", error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý xóa diễn viên
    const handleDelete = async (dienVien) => {
        if (!window.confirm(`Bạn chắc chắn muốn xóa diễn viên "${dienVien.tenDV}"?`)) return;

        try {
            setLoading(true);
            await movieServices.deleteDienVien(dienVien.dienVienId); // Xóa diễn viên
            fetchApi(pagination.currentPage); // Gọi lại dữ liệu
            handleCloseCard(); // Đóng form sau khi xóa
        } catch (error) {
            console.error("Lỗi khi xóa diễn viên:", error);
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <>
            <div className="mb-4">
                <div className="d-flex flex-wrap gap-3">
                    <button
                        onClick={() => handleAction('create', {})}
                        className="btn btn-primary"
                    >
                        <i className="fas fa-plus me-2"></i>Thêm diễn viên mới
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">Danh sách diễn viên</h5>
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
                        data={listDienVienResult}
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
                    data={currentDienVien}
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