import { useEffect, useState } from "react";
import Table from "../../../components/Table/Table";
import * as movieServices from "../../../services/Admin/MovieService";
import Card from '../../../components/Table/Card';

export default function ListNgonNgu({ page, limit, data, pagination, onPageChange }) {
    const [listNgonNguResult, setListNgonNguResult] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentNgonNgu, setCurrentNgonNgu] = useState(null);
    const [cardAction, setCardAction] = useState(null);
    const [formFields, setFormFields] = useState([]);

    //Dùng để tái sử dụng fetchApi
    const fetchApi = async (currentPage = page, currentLimit = limit) => {
        setLoading(true);
        try {
            const result = await movieServices.fetchNgonNgus(currentPage, currentLimit);
            setListNgonNguResult(result.data);
            onPageChange(result.pagination);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu ngôn ngữ:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (data && data.length > 0) {
            setListNgonNguResult(data);
        } else {
            fetchApi();
        }
    }, [data, limit, page]);

    // Lấy các trường form
    useEffect(() => {
        const fetchFormFields = async () => {
            try {
                const fields = await movieServices.getNgonNguFormFields();
                setFormFields(fields);
            } catch (error) {
                console.error("Lỗi khi tải trường form:", error);
            }
        };

        fetchFormFields();
    }, []);

    // Thực hiện thao tác CRUD (Xem, chỉnh sửa, xóa)
    const handleAction = (action, listNgonNguResult) => {
        setCurrentNgonNgu(listNgonNguResult);
        setCardAction(action);
    };

    //Đóng thẻ card
    const handleCloseCard = () => {
        setCardAction(null);
        setCurrentNgonNgu(null);
    };

    // Hàm xử lý lưu ngôn ngữ (Tạo mới hoặc Cập nhật)
    const handleSave = async (ngonNguData) => {
        try {
            setLoading(true);

            // Nếu thao tác là 'create', thêm thời gian tạo và cập nhật
            if (cardAction === 'create') {
                ngonNguData.thoiGianTao = new Date().toISOString(); // Thêm thời gian tạo
                ngonNguData.thoiGianCapNhat = new Date().toISOString(); // Thêm thời gian cập nhật
                await movieServices.createNgonNgu(ngonNguData); // Tạo mới ngôn ngữ
            } else {
                // Nếu là 'edit', giữ nguyên thời gian cập nhật, không thay đổi thoiGianTao
                const id = ngonNguData.get ? ngonNguData.get("ngonNguId") : ngonNguData.ngonNguId;
                await movieServices.updateNgonNgu(id, ngonNguData); // Cập nhật ngôn ngữ
            }

            // Sau khi lưu xong, gọi lại dữ liệu để cập nhật
            fetchApi(pagination.currentPage);
            handleCloseCard(); // Đóng thẻ card sau khi lưu
        } catch (error) {
            console.error("Lỗi khi lưu ngôn ngữ:", error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý xóa quốc gia
    const handleDelete = async (ngonNgu) => {
        if (!window.confirm(`Bạn chắc chắn muốn xóa quốc gia "${ngonNgu.tenNN}"?`)) return;

        try {
            setLoading(true);
            // Chú ý sử dụng quocGia.quocGiaId thay vì quocGia.id
            await movieServices.deleteNgonNgu(ngonNgu.ngonNguId); // Xóa quốc gia
            // Sau khi xóa xong, gọi lại dữ liệu để cập nhật
            fetchApi(pagination.currentPage);
            handleCloseCard(); // Đóng thẻ card sau khi xóa
        } catch (error) {
            console.error("Lỗi khi xóa ngôn ngữ:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: "Tên ngôn ngữ", accessor: "tenNN" },
        { header: "Mô tả", accessor: "moTaNN" },
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
                        <i className="fas fa-plus me-2"></i>Thêm ngôn ngữ mới
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">Danh sách ngôn ngữ</h5>
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
                        data={listNgonNguResult}
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
                    data={currentNgonNgu}
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