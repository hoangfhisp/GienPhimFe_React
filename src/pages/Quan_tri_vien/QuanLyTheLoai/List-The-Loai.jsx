import React, { useState } from 'react';
import AdminBoard from '../../../components/Layouts/Admin-board/Admin-board';
import ListTheLoai from '../../../components/Layouts/AdminList/ListTheLoai';
import Search from '../../../components/Layouts/SearchAdmin/Search';
import * as movieServices from "../../../services/Admin/MovieService";

export default function TheLoaiList() {
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
                    <h1 className="mb-0">Danh sách thể loại</h1>
                </div>
                <hr />
                <Search
                    searchType="theLoai"
                    onResult={handleSearchResult}
                    onClear={handleClearSearch}
                    placeholder="Tìm kiếm thể loại..."
                >
                    Tìm kiếm thể loại
                </Search>

                <ListTheLoai
                    searchType="theLoai"
                    data={isSearching ? searchResult : null}
                    pagination={pagination} onPageChange={handlePageChange}
                />

            </div>
        </div>
    );
}
