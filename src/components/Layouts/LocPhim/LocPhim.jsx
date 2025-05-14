import { useEffect, useState } from "react";
import * as requestTheLoai from '../../../services/Admin/MovieService.jsx';
import * as requestQuocGia from '../../../services/Admin/MovieService.jsx';
import * as requestNgonNgu from '../../../services/Admin/NgonNguService.jsx';

import { fetchFilterMovies, searchMovies } from '../../../services/Admin/MovieService';
import ListPhim from "../AdminList/ListPhim.jsx";

const LocPhim = () => {
    const [locPhim, setLocPhim] = useState('');
    const [selectedTheLoai, setSelectedTheLoai] = useState('');
    const [selectedQuocGia, setSelectedQuocGia] = useState('');
    const [selectedNgonNgu, setSelectedNgonNgu] = useState('');

    //
    const [theLoaiList, setTheLoaiList] = useState([]);
    const [quocGiaList, setQuocGiaList] = useState([]);
    const [ngonNguList, setNgonNguList] = useState([]);

    //
    const [movies, setMovies] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, itemsPerPage: 10, totalItems: 0 });
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const theLoai = await requestTheLoai.fetchTheLoais(1, 1000);
                const quocGia = await requestQuocGia.fetchQuocGias(1, 1000);
                const ngonNgu = await requestNgonNgu.fetchNgonNgus(1, 1000);
                setTheLoaiList(theLoai.data || []);
                setQuocGiaList(quocGia.data || []);
                setNgonNguList(ngonNgu.data || []);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu lọc:", error);
            }
        };
        fetchOptions();
    }, []);

    const handleTimKiem = async (e) => {
        e.preventDefault();

        const result = await searchMovies(locPhim, 1, 10);

        setMovies(result.data);
        setPagination(result.pagination);
    };

    const fetchData = (page = 1) => {
        const limit = pagination.itemsPerPage;

        setLoading(true);

        fetchFilterMovies(
            selectedTheLoai,
            selectedQuocGia,
            selectedNgonNgu,
            page,
            limit
        )
            .then(response => {
                setMovies(Array.isArray(response.data) ? response.data : []);
                setPagination(prev => ({
                    ...prev,
                    currentPage: page,
                    totalItems: response.pagination.total,
                    itemsPerPage: response.pagination.limit
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

    const handleLocPhim = e => {
        e.preventDefault();

        setPagination(prev => ({ ...prev, currentPage: 1 }));

        const page = pagination?.currentPage || 1;
        const limit = pagination?.itemsPerPage || 10;

        fetchFilterMovies(
            selectedTheLoai,
            selectedQuocGia,
            selectedNgonNgu,
            page,
            limit
        )
            .then(response => {
                const dataArray = Array.isArray(response.data) ? response.data : [];
                setMovies(dataArray);
                setPagination(prev => ({
                    ...prev,
                    totalItems: response.pagination?.total || 0
                }));
            })
            .catch(err => {
                console.error("Lỗi lọc phim:", err);
                setMovies([]);
            });
    };

    const handleClearFilter = () => {
        setSelectedTheLoai('');
        setSelectedQuocGia('');
        setSelectedNgonNgu('');
        setLocPhim('');
        fetchData(1);
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    useEffect(() => {
        fetchData(pagination.currentPage);
    }, [pagination.currentPage]);

    return (
        <>
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Bộ lọc & Tìm kiếm</h5>

                    <form onSubmit={handleTimKiem} className="mb-3">
                        <div className="input-group">
                            <input
                                className="form-control"
                                name="locPhim"
                                type="search"
                                placeholder="Nhập tên phim..."
                                value={locPhim}
                                onChange={e => setLocPhim(e.target.value)}
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
                                    <option key={item.quocGiaId} value={item.tenQG}>{item.tenQG}</option>
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
                                    <option key={item.ngonNguId} value={item.tenNN}>{item.tenNN}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12">
                            <button onClick={handleLocPhim} className="btn btn-secondary me-2">
                                <i className="fas fa-filter me-2"></i>Lọc phim
                            </button>
                            <button onClick={handleClearFilter} className="btn btn-outline-secondary">
                                <i className="fas fa-times me-2"></i>Xóa bộ lọc
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ListPhim data={movies} pagination={pagination} onPageChange={handlePageChange} />
        </>

    );
};

export default LocPhim;