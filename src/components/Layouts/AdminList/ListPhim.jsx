import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Table from "../../../components/Table/Table";
import * as movieServices from "../../../services/Admin/MovieService";
import Card from '../../../components/Table/Card';
import LocPhim from "../LocPhim/LocPhim";

export default function ListPhim({ page, limit, data, pagination, onPageChange }) {
    const [listPhimResult, setListPhimResult] = useState([]);
    const [loading, setLoading] = useState(true);

    //
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
            ngonNguIds: extractIds(listPhimResult.ngonNgu, 'ngonNguId'),
            quocGiaIds: extractIds(listPhimResult.quocGia, 'quocGiaId'),
            daoDienIds: extractIds(listPhimResult.daoDien, 'daoDienId'),
            dienVienIds: extractIds(listPhimResult.dienVien, 'dienVienId'),
            theTagIds: extractIds(listPhimResult.theTag, 'theTagId')

        };
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
        if (!data) {
            return;
        }
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
        if (action == 'view') {
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

            if (cardAction === 'create') {
                await movieServices.createMovie(movieData);
            } else {
                const id = movieData.get ? movieData.get("phimId") : movieData.id;
                await movieServices.updateMovie(id, movieData);
            }

            fetchApi(pagination.currentPage);
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi lưu phim:", error);
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
        { header: "Tên phim", accessor: "tenP", render: row => <div className="ten-phim-cell">{row.tenP}</div> },
        { header: "Mô tả", accessor: "moTaP", render: row => <div className="ten-phim-cell" style={{ display: `${viewFull ? "block" : "-webkit-box"}` }}>{row.moTaP}</div> },
        { header: "Thời lượng", accessor: "thoiLuongP", render: (row) => row.thoiLuongP },
        { header: "Avatar", accessor: "avatarP", render: (row) => <img src={row.avatarP} width={100} alt="avatar" /> },
        { header: "Poster", accessor: "avatarPoster", render: (row) => <img src={row.avatarPoster} width={100} alt="poster" /> },
        { header: "Tạo lúc", accessor: "thoiGianTao", render: (row) => new Date(row.thoiGianTao).toLocaleString() },
        { header: "Cập nhật", accessor: "thoiGianCapNhat", render: (row) => new Date(row.thoiGianCapNhat).toLocaleString() }
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