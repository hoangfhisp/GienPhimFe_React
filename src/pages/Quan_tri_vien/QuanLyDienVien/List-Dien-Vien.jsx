import React, { useState } from 'react';
import AdminBoard from '../../../components/Layouts/Admin-board/Admin-board';
import ListDienVien from '../../../components/Layouts/AdminList/ListDienVien';
import Search from '../../../components/Layouts/SearchAdmin/Search';

export default function DienVienList() {
    const [searchResult, setSearchResult] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [pagination, setPagination] = useState({ currentPage: 1, itemsPerPage: 10, totalItems: 0 });

    const handleSearchResult = (data) => {
        setSearchResult(data);
        setIsSearching(true);
    };

    const handleClearSearch = () => {
        setSearchResult([]);
        setIsSearching(false);
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    return (
        <div className="wrapper d-flex">
            <AdminBoard username="Admin" />
            <div id="content" className="content p-4 p-md-5 pt-5">
                <div className="d-flex justify-content-center align-items-center mb-4">
                    <h1 className="mb-0">Danh sách diễn viên</h1>
                </div>
                <hr />
                <Search
                    searchType="dienVien"
                    onResult={handleSearchResult}
                    onClear={handleClearSearch}
                    placeholder="Tìm kiếm diễn viên..."
                >
                    Tìm kiếm diễn viên
                </Search>

                <ListDienVien
                    searchType="dienVien"
                    data={isSearching ? searchResult : null}
                    pagination={pagination} onPageChange={handlePageChange}
                />

            </div>
        </div>
    );
}
