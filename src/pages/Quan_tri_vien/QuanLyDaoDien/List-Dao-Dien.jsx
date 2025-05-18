import React, { useState } from 'react';
import AdminBoard from '../../../components/Layouts/Admin-board/Admin-board';
import ListDaoDien from '../../../components/Layouts/AdminList/ListDaoDien';
import Search from '../../../components/Layouts/SearchAdmin/Search';
import RenderPagination from '../../../components/Commons/RenderPagination';

export default function DaoDienList() {
    const [paginations, setPaginations] = useState([]);
    const [currentPage, setCurrentPage] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearchResult = (data) => {
        setSearchResult(data);
        setIsSearching(true);
    };

    const handleClearSearch = () => {
        setSearchResult([]);
        setIsSearching(false);
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
                    onPagination={setPaginations}
                    page={currentPage}
                    limit={10}
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
                    page={currentPage}
                    limit={10}
                    onPageChange={setPaginations}
                    pagination={paginations}
                />

                <RenderPagination data={paginations} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
}
