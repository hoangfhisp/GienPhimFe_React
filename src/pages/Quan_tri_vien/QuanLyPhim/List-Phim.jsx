import React, { useEffect, useState } from 'react';
import AdminBoard from '../../../components/Admin-board/Admin-board';
import Table from '../../../components/Table/Table';
import Card from '../../../components/Table/Card';
import '../../../components/Admin-board/Admin-board.scss';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';

import {
    fetchMovies, searchMovies,
    filterMovies,
    addMovieFromAPI,
    createMovie,
    updateMovie,
    deleteMovie
} from '../../../services/Admin/MovieService';

import * as requestTheLoai from '../../../services/Admin/TheLoaiService.jsx';

const PhimList = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentMovie, setCurrentMovie] = useState(null);
    const [cardAction, setCardAction] = useState(null);

    const [theLoaiList, setTheLoaiList] = useState([]);
    const [quocGiaList, setQuocGiaList] = useState([]);
    const [ngonNguList, setNgonNguList] = useState([]);

    const [selectedTheLoai, setSelectedTheLoai] = useState('');
    const [selectedQuocGia, setSelectedQuocGia] = useState('');
    const [selectedNgonNgu, setSelectedNgonNgu] = useState('');
    const [tenPhim, setTenPhim] = useState('');
    const [apiLink, setApiLink] = useState('');

    const fetchData = (page = 1) => {
        const limit = pagination.itemsPerPage || 10;
        setLoading(true);

        fetchMovies(page, limit)
            .then(result => {
                // Sử dụng result.data (đã được chuẩn hóa)
                setMovies(Array.isArray(result.data) ? result.data : []);

                setPagination(prev => ({
                    ...prev,
                    currentPage: page,
                    totalItems: result.pagination.total, // Lấy từ result.pagination
                    itemsPerPage: result.pagination.limit
                }));
            })
            .catch(err => {
                console.error("Lỗi tải phim:", err);
                setMovies([]);
                setPagination(prev => ({ ...prev, totalItems: 0 }));
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0
    });

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.totalItems) return;
        fetchData(newPage);
    };

    const handleLocPhim = e => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        filterMovies({
            theLoai: selectedTheLoai,
            quocGia: selectedQuocGia,
            ngonNgu: selectedNgonNgu,
            page: 1,
            limit: pagination.itemsPerPage
        })
            .then(response => {
                setMovies(response.data);
                setPagination(prev => ({
                    ...prev,
                    totalItems: response.totalItems
                }));
            })
            .catch(err => console.error("Lỗi lọc phim:", err));
    };

    const handleTimKiem = e => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        searchMovies(tenPhim, 1, pagination.itemsPerPage)
            .then(response => {
                setMovies(response.data);
                setPagination(prev => ({
                    ...prev,
                    totalItems: response.pagination.total // Sửa thành response.pagination.total
                }));
            })
            .catch(err => console.error("Lỗi tìm kiếm phim:", err));
    };

    // Thêm phim thông qua API
    const handleInputAPI = e => {
        e.preventDefault();
        addMovieFromAPI(apiLink)
            .then(() => fetchData()) // Sử dụng lại hàm fetchData đã cập nhật
            .catch(err => {
                console.error("Lỗi thêm phim:", err);
            });
    };

    useEffect(() => {
        const fetchApi = async () => {
            const result = await requestTheLoai.fetchTheLoais(1, 1000);
            setTheLoaiList(result.data)
        }
        fetchApi();

    }, []);


    useEffect(() => {
        const debouncedSearch = debounce(() => {
            if (tenPhim.trim() === '') {
                fetchData(1);
                return;
            }

            searchMovies(tenPhim, 1, 2)
                .then(response => {
                    setMovies(response.data);
                    console.log(tenPhim)
                    console.log(response)
                    setPagination(prev => ({
                        ...prev,
                        totalItems: response.totalItems
                    }));
                })
                .catch(err => console.error("Lỗi tìm kiếm phim:", err));
        }, 500); // delay 500ms

        debouncedSearch(); // Gọi hàm debounce

        return () => {
            debouncedSearch.cancel(); // cleanup debounce mỗi lần unmount hoặc `tenPhim` thay đổi
        };
    }, [tenPhim, pagination.itemsPerPage]);

    const columns = [
        { header: "Tên phim", accessor: "tenP", render: row => <div className="ten-phim-cell">{row.tenP}</div> },
        //{ header: "Mô tả", accessor: "moTaP", render: row => <div className="ten-phim-cell">{row.moTaP}</div> },
        {
            header: "Thời lượng",
            accessor: "thoiLuongP",
            render: row => row.thoiLuongP
        },
        {
            header: "Avatar",
            accessor: "avatarP",
            render: row => <img src={row.avatarP} width={100} alt="avatar" />
        },
        {
            header: "Poster",
            accessor: "avatarPoster",
            render: row => <img src={row.avatarPoster} width={100} alt="poster" />
        },
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

    const handleAction = (action, movie) => {
        setCurrentMovie(movie);
        setCardAction(action);
    };

    const handleCloseCard = () => {
        setCardAction(null);
        setCurrentMovie(null);
    };

    const handleSave = async (movieData) => {
        try {
            setLoading(true);
            if (cardAction === 'create') {
                await createMovie(movieData);
            } else {
                await updateMovie(movieData.id, movieData);
            }
            fetchData(pagination.currentPage); // Giữ nguyên trang hiện tại
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
            await deleteMovie(movie.id);
            fetchData(pagination.currentPage); // Giữ nguyên trang hiện tại
            handleCloseCard();
        } catch (error) {
            console.error("Lỗi khi xóa phim:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="wrapper d-flex">
            <AdminBoard username="Admin" />
            <div id="content" className="content p-4 p-md-5 pt-5">
                <div className="d-flex justify-content-center align-items-center mb-4">
                    <h1 className="mb-0">Danh sách phim</h1>
                </div>
                <hr />

                {/* Navigation links */}
                <div className="mb-4">
                    <div className="d-flex flex-wrap gap-3">
                        <button
                            onClick={() => handleAction('create', {})}
                            className="btn btn-primary"
                        >
                            <i className="fas fa-plus me-2"></i>Thêm phim mới
                        </button>
                        <Link to="/quanly/daodien" className="btn btn-outline-secondary">
                            <i className="fas fa-film me-2"></i>Quản lý đạo diễn
                        </Link>
                        <Link to="/quanly/dienvien" className="btn btn-outline-secondary">
                            <i className="fas fa-users me-2"></i>Quản lý diễn viên
                        </Link>
                        <Link to="/quanly/theloai" className="btn btn-outline-secondary">
                            <i className="fas fa-tags me-2"></i>Quản lý thể loại
                        </Link>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Bộ lọc & Tìm kiếm</h5>

                        <form onSubmit={handleTimKiem} className="mb-3">
                            <div className="input-group">
                                <input
                                    className="form-control"
                                    name="tenPhim"
                                    type="search"
                                    placeholder="Nhập tên phim..."
                                    value={tenPhim}
                                    onChange={e => setTenPhim(e.target.value)}
                                />
                                <button className="btn btn-primary" type="submit">
                                    <i className="fas fa-search me-2"></i>Tìm kiếm
                                </button>
                            </div>
                        </form>

                        <div className="row g-3">
                            <div className="col-md-4">
                                <select
                                    className="form-select"
                                    value={selectedTheLoai}
                                    onChange={e => setSelectedTheLoai(e.target.value)}
                                >
                                    <option value="">Tất cả thể loại</option>
                                    {theLoaiList.map(item => (
                                        <option key={item.theLoaiId} value={item.tenTL}>{item.tenTL}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <select
                                    className="form-select"
                                    value={selectedQuocGia}
                                    onChange={e => setSelectedQuocGia(e.target.value)}
                                >
                                    <option value="">Tất cả quốc gia</option>
                                    {quocGiaList.map(item => (
                                        <option key={item.value} value={item.value}>{item.text}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <select
                                    className="form-select"
                                    value={selectedNgonNgu}
                                    onChange={e => setSelectedNgonNgu(e.target.value)}
                                >
                                    <option value="">Tất cả ngôn ngữ</option>
                                    {ngonNguList.map(item => (
                                        <option key={item.value} value={item.value}>{item.text}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12">
                                <button
                                    onClick={handleLocPhim}
                                    className="btn btn-secondary me-2"
                                >
                                    <i className="fas fa-filter me-2"></i>Lọc phim
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedTheLoai('');
                                        setSelectedQuocGia('');
                                        setSelectedNgonNgu('');
                                        fetchData();
                                    }}
                                    className="btn btn-outline-secondary"
                                >
                                    <i className="fas fa-times me-2"></i>Xóa bộ lọc
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* API Input Section */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Nhập phim từ API</h5>
                        <form onSubmit={handleInputAPI} className="input-group">
                            <input
                                className="form-control"
                                name="query"
                                type="search"
                                placeholder="Nhập link API phim..."
                                value={apiLink}
                                onChange={e => setApiLink(e.target.value)}
                            />
                            <button className="btn btn-success" type="submit">
                                <i className="fas fa-cloud-download-alt me-2"></i>Thêm từ API
                            </button>
                        </form>
                    </div>
                </div>

                {/* Table Section */}
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="card-title mb-0">Danh sách phim</h5>
                            <button
                                onClick={fetchData}
                                className="btn btn-sm btn-outline-primary"
                                disabled={loading}
                            >
                                <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''} me-2`}></i>
                                {loading ? 'Đang tải...' : 'Làm mới'}
                            </button>
                        </div>

                        <Table
                            columns={columns}
                            data={movies}
                            loading={loading}
                            totalItems={pagination.totalItems}
                            currentPage={pagination.currentPage}
                            itemsPerPage={pagination.itemsPerPage}
                            actions={['view', 'edit', 'delete']}
                            onAction={handleAction}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>

            {/* Card Overlay */}
            {cardAction && (
                <Card
                    action={cardAction}
                    data={currentMovie}
                    columns={columns}
                    onClose={handleCloseCard}
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default PhimList;