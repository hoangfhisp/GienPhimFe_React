import { useEffect, useState } from "react";
import Table from "../../../components/Table/Table";
import Card from "../../../components/Table/Card";
import AdminBoard from '../../../components/Layouts/Admin-board/Admin-board';
import * as movieServices from "../../../services/Admin/MovieService";

export default function GoiThanhVienList() {
    const [listGoiThanhVienResult, setListGoiThanhVienResult] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentGoiThanhVien, setCurrentGoiThanhVien] = useState(null);
    const [cardAction, setCardAction] = useState(null);

    // Tách riêng 2 bộ formFields cho 2 loại tạo
    const [formFieldsGoiThanhVien, setFormFieldsGoiThanhVien] = useState([]);
    const [formFieldsLuaChonGoiTV, setFormFieldsLuaChonGoiTV] = useState([]);

    // Biến phân biệt loại tạo (goiThanhVien hoặc luaChonGoiTV)
    const [creationType, setCreationType] = useState(null);

    const fetchApi = async () => {
        setLoading(true);
        try {
            const result = await movieServices.fetchAllLuaChonGoiTV();
            setListGoiThanhVienResult(result.data || []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu gói thành viên:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    // Load form fields cho cả 2 loại 1 lần khi component mount
    useEffect(() => {
        async function fetchAllFormFields() {
            try {
                const [fieldsGoiThanhVien, fieldsLuaChon] = await Promise.all([
                    movieServices.getGoiThanhVienFormFields(),
                    movieServices.getLuaChonGoiTVFormFields()
                ]);
                setFormFieldsGoiThanhVien(fieldsGoiThanhVien);
                setFormFieldsLuaChonGoiTV(fieldsLuaChon);
            } catch (error) {
                console.error("Lỗi khi tải trường form:", error);
            }
        }
        fetchAllFormFields();
    }, []);

    const handleAction = (action, goiTV, creationTypeParam = null) => {
        setCurrentGoiThanhVien(goiTV);
        setCardAction(action);

        // Nếu đã truyền creationType rõ ràng thì dùng, nếu không thì đoán theo dữ liệu
        if (creationTypeParam) {
            setCreationType(creationTypeParam);
        } else {
            // Phân biệt dựa vào dữ liệu
            if (goiTV?.goiThanhVien) {
                setCreationType('luaChonGoiTV');
            } else {
                setCreationType('goiThanhVien');
            }
        }
    };


    const handleCloseCard = () => {
        setCardAction(null);
        setCurrentGoiThanhVien(null);
        setCreationType(null);
    };

    const handleSave = async (goiTVData) => {
        try {
            setLoading(true);

            const isCreate = cardAction === 'create';

            if (isCreate) {
                goiTVData.thoiGianTao = new Date().toISOString();
                goiTVData.thoiGianCapNhat = new Date().toISOString();

                if (creationType === 'goiThanhVien') {
                    await movieServices.createGoiThanhVien(goiTVData);
                } else if (creationType === 'luaChonGoiTV') {
                    await movieServices.createLuaChonGoiTV(goiTVData);
                } else {
                    console.warn("Unknown creationType:", creationType);
                }
            } else {
                // Update
                if (creationType === 'goiThanhVien') {
                    const id = goiTVData.get ? goiTVData.get("goiTVId") : goiTVData.goiTVId;
                    await movieServices.updateGoiThanhVien(id, goiTVData);
                } else if (creationType === 'luaChonGoiTV') {
                    const id = goiTVData.get ? goiTVData.get("luaChonGoiTVId") : goiTVData.luaChonGoiTVId;
                    await movieServices.updateLuaChonGoiTV(id, goiTVData);
                } else {
                    console.warn("Unknown update creationType:", creationType);
                }
            }

            fetchApi();
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi lưu gói thành viên:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (goiTV) => {
        if (!window.confirm(`Bạn chắc chắn muốn xóa mục này?`)) return;

        try {
            setLoading(true);

            if (goiTV.luaChonGoiTVId) {
                // Là LuaChonGoiTV
                await movieServices.deleteLuaChonGoiTV(goiTV.luaChonGoiTVId);
            } else if (goiTV.goiTVId) {
                // Là GoiThanhVien
                await movieServices.deleteGoiThanhVien(goiTV.goiTVId);
            } else {
                console.warn("Không xác định được loại dữ liệu cần xóa.");
            }

            fetchApi();
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi xóa gói thành viên:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: "Tên gói",
            render: row => row.goiThanhVien?.tenGoiTV || "-"
        },
        {
            header: "Slug",
            render: row => row.goiThanhVien?.slugGoiTV || "-"
        },
        {
            header: "Mô tả",
            render: row => row.goiThanhVien?.moTaGoiTV || "-"
        },
        {
            header: "Thời gian sử dụng (ngày)",
            accessor: "thoiGianSuDung"
        },
        {
            header: "Giá gói (VNĐ)",
            render: row => row.giaGoiTV?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "-"
        }
    ];

    // Lấy formFields phù hợp theo creationType
    const getFormFields = () => {
        if (creationType === 'goiThanhVien') return formFieldsGoiThanhVien;
        if (creationType === 'luaChonGoiTV') return formFieldsLuaChonGoiTV;
        return [];
    };

    return (
        <>
            <div className="wrapper d-flex">
                <AdminBoard username="Admin" />
                <div id="content" className="content p-4 p-md-5 pt-5">
                    <div className="d-flex justify-content-center align-items-center mb-4">
                        <h1 className="mb-0">Danh sách gói thành viên</h1>
                    </div>
                    <hr />
                    <div className="mb-4">
                        <div className="d-flex flex-wrap gap-3">
                            <button
                                onClick={() => handleAction('create', {}, 'goiThanhVien')}
                                className="btn btn-primary">
                                <i className="fas fa-plus me-2"></i>Thêm gói thành viên mới
                            </button>
                            <button
                                onClick={() => handleAction('create', {}, 'luaChonGoiTV')}
                                className="btn btn-primary">
                                <i className="fas fa-plus me-2"></i>Thêm lựa gói thành viên mới
                            </button>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="card-title mb-0">Danh sách gói thành viên</h5>
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
                                data={listGoiThanhVienResult}
                                loading={loading}
                                actions={['view', 'edit', 'delete']}
                                onAction={handleAction}
                                sortable={false}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {cardAction && (
                <Card
                    action={cardAction}
                    data={currentGoiThanhVien}
                    columns={columns}
                    formFields={getFormFields()}
                    onClose={handleCloseCard}
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            )}
        </>
    );
}
