import { useEffect, useState } from "react";
import Table from "../../../components/Table/Table";
import * as movieServices from "../../../services/Admin/MovieService";
import Card from '../../../components/Table/Card';

export default function ListTheLoai({ page, limit, data, pagination, onPageChange }) {
    const [listTheLoaiResult, setListTheLoaiResult] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentTheLoai, setCurrentTheLoai] = useState(null);
    const [cardAction, setCardAction] = useState(null);
    const [formFields, setFormFields] = useState([]);

    const fetchApi = async (currentPage = page, currentLimit = limit) => {
        setLoading(true);
        try {
            const result = await movieServices.fetchTheLoais(currentPage, currentLimit);
            setListTheLoaiResult(result.data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu thể loại:", error);
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
        console.log('Dữ liệu truyền vào ListTheLoai:', data);
        if (!data) {
            return;
        }
        setListTheLoaiResult(data);
    }, [data])

    // Lấy các trường form
    useEffect(() => {
        const fetchFormFields = async () => {
            try {
                const fields = await movieServices.getTheLoaiFormFields();
                setFormFields(fields);
            } catch (error) {
                console.error("Lỗi khi tải trường form:", error);
            }
        };

        fetchFormFields();
    }, []);

    // Thực hiện thao tác CRUD (Xem, chỉnh sửa, xóa)
    const handleAction = (action, listTheLoaiResult) => {
        setCurrentTheLoai(listTheLoaiResult);
        setCardAction(action);
    };

    //Đóng thẻ card
    const handleCloseCard = () => {
        setCardAction(null);
        setCurrentTheLoai(null);
    };

    // Hàm xử lý lưu thể loại (Tạo mới hoặc Cập nhật)
    const handleSave = async (theLoaiData) => {
        try {
            setLoading(true);

            // Nếu thao tác là 'create', thêm thoiGianTao và thoiGianCapNhat
            if (cardAction === 'create') {
                theLoaiData.thoiGianTao = new Date().toISOString(); // Thêm thời gian tạo
                theLoaiData.thoiGianCapNhat = new Date().toISOString(); // Thêm thời gian cập nhật
                await movieServices.createTheLoai(theLoaiData);
            } else {
                // Nếu là 'edit', giữ nguyên thời gian cập nhật, không thay đổi thoiGianTao
                const id = theLoaiData.get ? theLoaiData.get("theLoaiId") : theLoaiData.theLoaiId;
                await movieServices.updateTheLoai(id, theLoaiData);
            }

            // Sau khi lưu xong, gọi lại dữ liệu để cập nhật
            fetchApi(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi lưu thể loại:", error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý xóa thể loại
    const handleDelete = async (theLoai) => {
        if (!window.confirm(`Bạn chắc chắn muốn xóa thể loại "${theLoai.tenTL}"?`)) return;

        try {
            setLoading(true);
            // Chú ý sử dụng theLoai.theLoaiId thay vì theLoai.id
            await movieServices.deleteTheLoai(theLoai.theLoaiId);
            // Sau khi xóa xong, gọi lại dữ liệu để cập nhật
            fetchApi(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi xóa thể loại:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: "Tên thể loại", accessor: "tenTL" },
        { header: "Mô tả", accessor: "moTa" },
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
                        <i className="fas fa-plus me-2"></i>Thêm thể loại mới
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">Danh sách thể loại</h5>
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
                        data={listTheLoaiResult}
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
                    data={currentTheLoai}
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