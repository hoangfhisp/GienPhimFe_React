import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Table from "../../../components/Table/Table";
import * as movieServices from "../../../services/Admin/MovieService";
import Card from '../../../components/Table/Card';
import LocPhim from "../LocPhim/LocPhim";

export default function ListPhim({ page, limit, data, pagination, onPageChange }) {
    const [listPhimResult, setListPhimResult] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentMovie, setCurrentMovie] = useState(null);
    const [cardAction, setCardAction] = useState(null);
    const [formFields, setFormFields] = useState([]);

    const [viewFull, setViewFull] = useState(false);

    const normalizeMovieForForm = (listPhimResult) => {
        const extractIds = (arr, idField) =>
            Array.isArray(arr) ? arr.map(item => item[idField]?.toString()) : [];

        return {
            ...listPhimResult,
            theLoaiIds: extractIds(listPhimResult.theLoai, 'theLoaiId'),
            ngonNguId: listPhimResult.ngonNgu?.[0]?.ngonNguId?.toString() || "",
            quocGiaId: listPhimResult.quocGia?.[0]?.quocGiaId?.toString() || "",
            daoDienIds: extractIds(listPhimResult.daoDien, 'daoDienId'),
            dienVienIds: extractIds(listPhimResult.dienVien, 'dienVienId'),
            theTagIds: extractIds(listPhimResult.theTag, 'theTagId')
        };
    };

    // Hàm chuyển dữ liệu JS object sang đúng định dạng backend (JSON)
    const mapToBackendFormat = (data) => {
        if (data instanceof FormData) return data;

        return {
            TenP: data.tenP || "",
            NguonP: data.nguonP || "",
            AvatarP: data.avatarP || "",
            AvatarPoster: data.avatarPoster || "",
            TenCTSXP: data.tenCTSXP || "",
            ThoiLuongP: data.thoiLuongP || "",
            MoTaP: data.moTaP || "",
            SoTapP: data.soTapP || "",
            NgayPhatHanhP: data.ngayPhatHanhP || null,
            TraiLerP: data.traiLerP || "",
            NgonNguId: data.ngonNguId || "",
            QuocGiaId: data.quocGiaId || "",
            TheLoaiIds: data.theLoaiIds || [],
            DaoDienIds: data.daoDienIds || [],
            DienVienIds: data.dienVienIds || [],
            TheTagIds: data.theTagIds || [],
            ThoiGianTao: data.thoiGianTao || "",
            ThoiGianCapNhat: data.thoiGianCapNhat || "",
            PhimId: data.phimId || null
        };
    };

    // Hàm tạo FormData nếu có file upload
    const mapToFormData = (data) => {
        const formData = new FormData();

        formData.append("TenP", data.tenP || "");
        formData.append("NguonP", data.nguonP || "");
        formData.append("TenCTSXP", data.tenCTSXP || "");
        formData.append("ThoiLuongP", data.thoiLuongP || "");
        formData.append("MoTaP", data.moTaP || "");
        formData.append("SoTapP", data.soTapP || "");
        formData.append("NgayPhatHanhP", data.ngayPhatHanhP || "");
        formData.append("TraiLerP", data.traiLerP || "");

        formData.append("NgonNguId", parseInt(data.ngonNguId) || 0);
        formData.append("QuocGiaId", parseInt(data.quocGiaId) || 0);

        (data.theLoaiIds || []).forEach(id => formData.append("TheLoaiIds", id));
        (data.daoDienIds || []).forEach(id => formData.append("DaoDienIds", id));
        (data.dienVienIds || []).forEach(id => formData.append("DienVienIds", id));
        (data.theTagIds || []).forEach(id => formData.append("TheTagIds", id));

        if (data.avatarP instanceof File) {
            formData.append("AvatarP", data.avatarP);
        } else {
            formData.append("AvatarP", data.avatarP || "");
        }

        if (data.avatarPoster instanceof File) {
            formData.append("AvatarPoster", data.avatarPoster);
        } else {
            formData.append("AvatarPoster", data.avatarPoster || "");
        }

        formData.append("ThoiGianTao", data.thoiGianTao || "");
        formData.append("ThoiGianCapNhat", data.thoiGianCapNhat || "");
        if (data.phimId) formData.append("PhimId", data.phimId);

        return formData;
    };


    const fetchApi = async (currentPage = page, currentLimit = limit) => {
        setLoading(true);
        try {
            const result = await movieServices.fetchMovies(currentPage, currentLimit);
            setListPhimResult(result.data);
        } catch (error) {
            console.error("Lỗi khi tải phim:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApi();
    }, [page, limit]);

    useEffect(() => {
        if (!data) return;
        setListPhimResult(data);
    }, [data])

    useEffect(() => {
        const fetchFormFields = async () => {
            try {
                const fields = await movieServices.getPhimFormFields();
                setFormFields(fields);
            } catch (error) {
                console.error("Lỗi khi tải trường form:", error);
            }
        };

        fetchFormFields();
    }, []);

    const handleAction = (action, listPhimResult) => {
        if (action === 'view') {
            setViewFull(true);
        }
        setCurrentMovie(normalizeMovieForForm(listPhimResult));
        setCardAction(action);
    };

    const handleCloseCard = () => {
        setViewFull(false);
        setCardAction(null);
        setCurrentMovie(null);
    };

    const handleSave = async (movieData) => {
        try {
            setLoading(true);

            let backendData;
            if (movieData.avatarP instanceof File || movieData.avatarPoster instanceof File) {
                backendData = mapToFormData(movieData);
            } else {
                backendData = mapToBackendFormat(movieData);
            }

            console.log("Dữ liệu gửi lên API:", backendData);

            if (cardAction === 'create') {
                await movieServices.createMovie(backendData);
            } else {
                const id = backendData.get ? backendData.get("PhimId") : backendData.PhimId || backendData.phimId || movieData.id;
                await movieServices.updateMovie(id, backendData);
            }

            fetchApi(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi lưu phim:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (movie) => {
        if (!window.confirm(`Bạn chắc chắn muốn xóa phim "${movie.tenP}"?`)) return;
        try {
            setLoading(true);
            await movieServices.deleteMovie(movie.id);
            fetchApi(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi xóa phim:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: "Tên phim",
            accessor: "tenP",
            render: row => <div className="ten-phim-cell">{row.tenP}</div>
        },
        {
            header: "Mô tả",
            accessor: "moTaP",
            render: row => <div className="ten-phim-cell" style={{ display: `${viewFull ? "block" : "-webkit-box"}` }}>{row.moTaP}</div>
        },
        {
            header: "Thời lượng",
            accessor: "thoiLuongP",
            render: (row) => row.thoiLuongP
        },
        {
            header: "Avatar",
            accessor: "avatarP",
            render: (row) => <img src={row.avatarP} width={100} alt="avatar" />
        },
        {
            header: "Poster",
            accessor: "avatarPoster",
            render: (row) => <img src={row.avatarPoster} width={100} alt="poster" />
        },
        {
            header: "Tạo lúc",
            accessor: "thoiGianTao",
            render: (row) => new Date(row.thoiGianTao).toLocaleString()
        },
        {
            header: "Cập nhật",
            accessor: "thoiGianCapNhat",
            render: (row) => new Date(row.thoiGianCapNhat).toLocaleString()
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
                        <i className="fas fa-plus me-2"></i>Thêm phim mới
                    </button>
                    <Link to="/quanly/daodien" className="btn btn-outline-secondary">
                        <i className="fas fa-film me-2"></i>Quản lý đạo diễn của phim
                    </Link>
                    <Link to="/quanly/dienvien" className="btn btn-outline-secondary">
                        <i className="fas fa-users me-2"></i>Quản lý diễn viên của phim
                    </Link>
                    <Link to="/quanly/theloai" className="btn btn-outline-secondary">
                        <i className="fas fa-tags me-2"></i>Quản lý thể loại của phim
                    </Link>
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
                        data={listPhimResult}
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
                    data={currentMovie}
                    columns={columns}
                    formFields={formFields}
                    onClose={handleCloseCard}
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            )}

        </>
    );
}
