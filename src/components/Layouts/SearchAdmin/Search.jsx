import React, { useState, useEffect } from 'react';
import * as movieServices from "../../../services/Admin/MovieService";
import useDebounce from "../../../hooks/useDebounce";
import * as AuthenticationService from "../../../services/Admin/AuthenticationService";

export default function Search({ searchType, page, limit, onClear, children, placeholder, onResult, onPagination }) {
    const [inputValue, setInputValue] = useState("");
    const [searchTheloais, setSearchTheloais] = useState([]);
    const [searchQuocgias, setSearchQuocgias] = useState([]);
    const [searchNgonNgus, setSearchNgonNgus] = useState([]);
    const [searchDaoDiens, setSearchDaoDiens] = useState([]);
    const [searchDienViens, setSearchDienViens] = useState([]);
    const [searchTheTags, setSearchTheTags] = useState([]);
    const [searchRoles, setSearchRoles] = useState([]);

    const debounce = useDebounce(inputValue, 600);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const searchValue = debounce.trim();

        // Nếu input rỗng → reset kết quả
        if (!searchValue) {
            onResult?.([], 0); // Reset kết quả tìm kiếm
            onPagination?.({ currentPage: 1, totalPages: 1, totalItems: 0 }); // Reset phân trang
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                let result;

                if (searchType === 'theLoai') {
                    result = await movieServices.searchTheLoais(searchValue, page, limit);
                } else if (searchType === 'quocGia') {
                    result = await movieServices.searchQuocGias(searchValue, page, limit);
                } else if (searchType === 'ngonNgu') {
                    result = await movieServices.searchNgonNgus(searchValue, page, limit);
                } else if (searchType === 'daoDien') {
                    result = await movieServices.searchDaoDiens(searchValue, page, limit);
                } else if (searchType === 'dienVien') {
                    result = await movieServices.searchDienViens(searchValue, page, limit);
                } else if (searchType === 'theTag') {
                    result = await movieServices.searchTheTags(searchValue, page, limit);
                } else if (searchType === 'vaiTro') {
                    result = await AuthenticationService.searchRoles(searchValue, page, limit);
                } else {
                    throw new Error("Loại tìm kiếm không hỗ trợ");
                }

                onResult?.(result.data, result.totalItems);
                onPagination(result.pagination);
            } catch (err) {
                console.error(`Lỗi tìm kiếm ${searchType}:`, err);
                onResult?.([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [debounce, searchType, page, limit]);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleClear = () => {
        setInputValue('');
        onClear?.();
        setSearchTheloais([]);
        setSearchQuocgias([]);
        setSearchNgonNgus([]);
        setSearchDaoDiens([]);
        setSearchDienViens([]);
        setSearchTheTags([]);
        setSearchRoles([]);
    };

    return (
        <>
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">{children}</h5>
                    <form onSubmit={handleSubmit} className="input-group">
                        <input
                            className="form-control"
                            type="search"
                            placeholder={placeholder}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button className="btn btn-primary" type="submit" disabled={loading}>
                            <i className="fas fa-search me-2"></i>Tìm kiếm
                        </button>
                        <button
                            onClick={handleClear}
                            className="btn btn-outline-secondary"
                            type="button"
                        >
                            <i className="fas fa-times me-2"></i>Xóa
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
