import { useEffect, useState } from "react";
import Table from "../../../components/Table/Table";
import * as movieServices from "../../../services/Admin/MovieService";
import Card from '../../../components/Table/Card';

export default function ListQuocGia({ page, limit, data, pagination, onPageChange }) {
    const [listQuocGiaResult, setListQuocGiaResult] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentQuocGia, setCurrentQuocGia] = useState(null);
    const [cardAction, setCardAction] = useState(null);
    const [formFields, setFormFields] = useState([]);

    const fetchApi = async (currentPage = page, currentLimit = limit) => {
        setLoading(true);
        try {
            const result = await movieServices.fetchQuocGias(currentPage, currentLimit);
            setListQuocGiaResult(result.data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu quốc gia:", error);
        } finally {
            setLoading(false);
        }
    };

    //Dùng để tái sử dụng fetchApi
    useEffect(() => {
        fetchApi();
        console.log(data);
    }, [page, limit]);

    useEffect(() => {
        console.log('Dữ liệu truyền vào ListQuocGia:', data);
        if (!data) {
            return;
        }
        setListQuocGiaResult(data);
    }, [data])

    useEffect(() => {
        const fetchFormFields = async () => {
            try {
                const fields = await movieServices.getQuocGiaFormFields();
                setFormFields(fields);
            } catch (error) {
                console.error("Lỗi khi tải trường form:", error);
            }
        };

        fetchFormFields();
    }, []);

    // Thực hiện thao tác CRUD (Xem, chỉnh sửa, xóa)
    const handleAction = (action, listQuocGiaResult) => {
        setCurrentQuocGia(listQuocGiaResult);
        setCardAction(action);
    };

    //Đóng thẻ card
    const handleCloseCard = () => {
        setCardAction(null);
        setCurrentQuocGia(null);
    };

    // Hàm xử lý lưu quốc gia (Tạo mới hoặc Cập nhật)
    const handleSave = async (quocGiaData) => {
        try {
            setLoading(true);

            // Nếu thao tác là 'create', thêm thoiGianTao và thoiGianCapNhat
            if (cardAction === 'create') {
                quocGiaData.thoiGianTao = new Date().toISOString(); // Thêm thời gian tạo
                quocGiaData.thoiGianCapNhat = new Date().toISOString(); // Thêm thời gian cập nhật
                await movieServices.createQuocGia(quocGiaData); // Tạo mới quốc gia
            } else {
                // Nếu là 'edit', giữ nguyên thời gian cập nhật, không thay đổi thoiGianTao
                const id = quocGiaData.get ? quocGiaData.get("quocGiaId") : quocGiaData.quocGiaId;
                await movieServices.updateQuocGia(id, quocGiaData); // Cập nhật quốc gia
            }

            // Sau khi lưu xong, gọi lại dữ liệu để cập nhật
            fetchApi(pagination.currentPage);
            handleCloseCard(); // Đóng thẻ card sau khi lưu
        } catch (error) {
            console.error("Lỗi khi lưu quốc gia:", error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý xóa quốc gia
    const handleDelete = async (quocGia) => {
        if (!window.confirm(`Bạn chắc chắn muốn xóa quốc gia "${quocGia.tenQG}"?`)) return;

        try {
            setLoading(true);
            // Chú ý sử dụng quocGia.quocGiaId thay vì quocGia.id
            await movieServices.deleteQuocGia(quocGia.quocGiaId); // Xóa quốc gia
            // Sau khi xóa xong, gọi lại dữ liệu để cập nhật
            fetchApi(pagination.currentPage);
            handleCloseCard(); // Đóng thẻ card sau khi xóa
        } catch (error) {
            console.error("Lỗi khi xóa quốc gia:", error);
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <>
            <div className="mb-4">
                <div className="d-flex flex-wrap gap-3">
                    <button
                        onClick={() => handleAction('create', {})}
                        className="btn btn-primary"
                    >
                        <i className="fas fa-plus me-2"></i>Thêm quốc gia mới
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">Danh sách quốc gia</h5>
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
                        data={listQuocGiaResult}
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
                    data={currentQuocGia}
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