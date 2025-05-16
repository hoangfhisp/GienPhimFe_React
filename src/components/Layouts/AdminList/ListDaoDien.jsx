import { useEffect, useState } from "react";
import Table from "../../../components/Table/Table";
import * as movieServices from "../../../services/Admin/MovieService";
import Card from '../../../components/Table/Card';

export default function ListDaoDien({ page, limit, data, pagination, onPageChange }) {
    const [listDaoDienResult, setListDaoDienResult] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentDaoDien, setCurrentDaoDien] = useState(null);
    const [cardAction, setCardAction] = useState(null);
    const [formFields, setFormFields] = useState([]);

    //Dùng để tái sử dụng fetchApi
    const fetchApi = async (currentPage = page, currentLimit = limit) => {
        setLoading(true);
        try {
            const result = await movieServices.fetchDaoDiens(currentPage, currentLimit);
            setListDaoDienResult(result.data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu đạo diễn:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApi();
        console.log(data);
    }, [page, limit]);

    useEffect(() => {
        console.log('Dữ liệu truyền vào ListDaoDien:', data);
        if (!data) {
            return;
        }
        setListDaoDienResult(data);
    }, [data])

    useEffect(() => {
        const fetchFormFields = async () => {
            try {
                const fields = await movieServices.getDaoDienFormFields();
                setFormFields(fields);
            } catch (error) {
                console.error("Lỗi khi tải trường form:", error);
            }
        };

        fetchFormFields();
    }, []);

    // Thực hiện thao tác CRUD (Xem, chỉnh sửa, xóa)
    const handleAction = (action, listDaoDienResult) => {
        setCurrentDaoDien(listDaoDienResult);
        setCardAction(action);
    };

    //Đóng thẻ card
    const handleCloseCard = () => {
        setCardAction(null);
        setCurrentDaoDien(null);
    };

    // Hàm xử lý lưu đạo diễn (Tạo mới hoặc Cập nhật)
    const handleSave = async (daoDienData) => {
        try {
            setLoading(true);

            if (cardAction === 'create') {
                daoDienData.thoiGianTao = new Date().toISOString();
                daoDienData.thoiGianCapNhat = new Date().toISOString();
                await movieServices.createDaoDien(daoDienData); // Tạo mới đạo diễn
            } else {
                // Nếu là 'edit', giữ nguyên thời gian tạo
                const id = daoDienData.get ? daoDienData.get("daoDienId") : daoDienData.daoDienId;
                await movieServices.updateDaoDien(id, daoDienData); // Cập nhật đạo diễn
            }

            fetchApi(pagination.currentPage); // Gọi lại dữ liệu
            handleCloseCard(); // Đóng form sau khi lưu
        } catch (error) {
            console.error("Lỗi khi lưu đạo diễn:", error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý xóa đạo diễn
    const handleDelete = async (daoDien) => {
        if (!window.confirm(`Bạn chắc chắn muốn xóa đạo diễn "${daoDien.tenDG}"?`)) return;

        try {
            setLoading(true);
            await movieServices.deleteDaoDien(daoDien.daoDienId); // Xóa đạo diễn
            fetchApi(pagination.currentPage); // Gọi lại dữ liệu
            handleCloseCard(); // Đóng form sau khi xóa
        } catch (error) {
            console.error("Lỗi khi xóa đạo diễn:", error);
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <>
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

            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">Danh sách đạo diễn</h5>
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
                        data={listDaoDienResult}
                        loading={loading}
                        currentPage={pagination.currentPage}
                        totalItems={pagination.totalItems}
                        itemsPerPage={pagination.itemsPerPage}
                        actions={['view', 'edit', 'delete']}
                        onAction={handleAction}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>

            {cardAction && (
                <Card
                    action={cardAction}
                    data={currentDaoDien}
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