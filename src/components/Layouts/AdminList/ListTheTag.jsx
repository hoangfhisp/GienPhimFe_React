import { useEffect, useState } from "react";
import Table from "../../../components/Table/Table";
import * as movieServices from "../../../services/Admin/MovieService";
import Card from '../../../components/Table/Card';

export default function ListTheTag({ page, limit, data, pagination, onPageChange }) {
    const [listTheTagResult, setListTheTagResult] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentTheTag, setCurrentTheTag] = useState(null);
    const [cardAction, setCardAction] = useState(null);
    const [formFields, setFormFields] = useState([]);

    //Dùng để tái sử dụng fetchApi
    const fetchApi = async (currentPage = page, currentLimit = limit) => {
        setLoading(true);
        try {
            const result = await movieServices.fetchTheTags(currentPage, currentLimit);
            setListTheTagResult(result.data);
            onPageChange(result.pagination);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu thẻ tag:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (data && data.length > 0) {
            setListTheTagResult(data);
        } else if (!data) {
            fetchApi();
        }
    }, [data, limit, page]);


    // Lấy các trường form
    useEffect(() => {
        const fetchFormFields = async () => {
            try {
                const fields = await movieServices.getTheTagFormFields();
                setFormFields(fields);
            } catch (error) {
                console.error("Lỗi khi tải trường form:", error);
            }
        };

        fetchFormFields();
    }, []);

    // Thực hiện thao tác CRUD (Xem, chỉnh sửa, xóa)
    const handleAction = (action, listTheTagResult) => {
        setCurrentTheTag(listTheTagResult);
        setCardAction(action);
    };

    //Đóng thẻ card
    const handleCloseCard = () => {
        setCardAction(null);
        setCurrentTheTag(null);
    };

    // Hàm xử lý lưu thể loại (Tạo mới hoặc Cập nhật)
    const handleSave = async (theTagData) => {
        try {
            setLoading(true);

            // Nếu thao tác là 'create', thêm thoiGianTao và thoiGianCapNhat
            if (cardAction === 'create') {
                theTagData.thoiGianTao = new Date().toISOString();
                theTagData.thoiGianCapNhat = new Date().toISOString();
                await movieServices.createTheTag(theTagData);
            } else {
                // Nếu là 'edit', giữ nguyên thời gian tạo
                const id = theTagData.get ? theTagData.get("theTagId") : theTagData.theTagId;
                await movieServices.updateTheTag(id, theTagData);
            }

            // Sau khi lưu, gọi lại dữ liệu và đóng form
            fetchApi(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi lưu thẻ tag:", error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý xóa thể loại
    const handleDelete = async (theTag) => {
        if (!window.confirm(`Bạn chắc chắn muốn xóa thẻ tag "${theTag.tenT}"?`)) return;

        try {
            setLoading(true);
            await movieServices.deleteTheTag(theTag.theTagId); // dùng đúng key
            fetchApi(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi xóa thẻ tag:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: "Tên thẻ", accessor: "tenT" },
        { header: "Mô tả", accessor: "moTaT" },
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
                        <i className="fas fa-plus me-2"></i>Thêm thẻ tag mới
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">Danh sách thẻ tag</h5>
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
                        data={listTheTagResult}
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
                    data={currentTheTag}
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