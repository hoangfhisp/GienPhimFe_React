import React, { useState, useEffect } from 'react';
import * as movieServices from "../../../services/Admin/MovieService";
import useDebounce from "../../../hooks/useDebounce";

export default function Search({ searchType, onClear, children, placeholder, onResult }) {
    const [inputValue, setInputValue] = useState("");
    const [searchTheloais, setSearchTheloais] = useState([]);
    const [searchQuocgias, setSearchQuocgias] = useState([]);
    const [searchNgonNgus, setSearchNgonNgus] = useState([]);

    const debounce = useDebounce(inputValue, 600);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const searchValue = debounce.trim();

        if (!searchValue) {
            if (searchType === 'theLoai') {
                setSearchTheloais([]);
            } else if (searchType === 'quocGia') {
                setSearchQuocgias([]);
            } else if (searchType === 'ngonNgu') {
                setSearchNgonNgus([]);
            }
            return;
        }

        const fetchData = async (page = 1) => {
            const { currentPage, itemsPerPage } = pagination;
            setLoading(true);
            try {
                let result;

                if (searchType === 'theLoai') {
                    result = await movieServices.searchTheLoais(searchValue, currentPage, itemsPerPage);
                } else if (searchType === 'quocGia') {
                    result = await movieServices.searchQuocGias(searchValue, currentPage, itemsPerPage);
                } else if (searchType === 'ngonNgu') {
                    result = await movieServices.searchNgonNgus(searchValue, currentPage, itemsPerPage);
                } else {
                    throw new Error("Loại tìm kiếm không hỗ trợ");
                }

                onResult?.(result.data, result.totalItems);
                setPagination(prev => ({
                    ...prev,
                    currentPage: page,
                    totalItems: result.pagination.total,
                    itemsPerPage: result.pagination.limit
                }));
            } catch (err) {
                console.error(`Lỗi tìm kiếm ${searchType}:`, err);
                setPagination(prev => ({ ...prev, totalItems: 0 }));
                onResult?.([]); // Truyền mảng rỗng để reset kết quả nếu có lỗi
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [debounce, searchType, pagination.currentPage, pagination.itemsPerPage]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        // debounce sẽ tự động gọi useEffect
    };

    const handleClear = () => {
        setInputValue('');
        onClear?.();
        setSearchTheloais([]);
        setPagination({ currentPage: 1, itemsPerPage: 10, totalItems: 0 });
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
