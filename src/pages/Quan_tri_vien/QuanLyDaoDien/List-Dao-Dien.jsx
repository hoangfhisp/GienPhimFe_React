import React, { useState } from 'react';
import AdminBoard from '../../../components/Layouts/Admin-board/Admin-board';
import ListDaoDien from '../../../components/Layouts/AdminList/ListDaoDien';
import Search from '../../../components/Layouts/SearchAdmin/Search';

export default function DaoDienList() {
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
                    <h1 className="mb-0">Danh sách đạo diễn</h1>
                </div>
                <hr />
                <Search
                    searchType="daoDien"
                    onResult={handleSearchResult}
                    onClear={handleClearSearch}
                    placeholder="Tìm kiếm đạo diễn..."
                >
                    Tìm kiếm đạo diễn
                </Search>

                <ListDaoDien
                    searchType="daoDien"
                    data={isSearching ? searchResult : null}
                    pagination={pagination} onPageChange={handlePageChange}
                />

            </div>
        </div>
    );
}
