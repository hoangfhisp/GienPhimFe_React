import React, { useState } from 'react';
import AdminBoard from '../../../components/Layouts/Admin-board/Admin-board';
import ListTapPhim from '../../../components/Layouts/AdminList/ListTapPhim';
import Search from '../../../components/Layouts/SearchAdmin/Search';
import RenderPagination from '../../../components/Commons/RenderPagination';

export default function TapPhimList() {
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
                    <h1 className="mb-0">Danh sách tập của phim</h1>
                </div>
                <hr />
                <Search
                    onPagination={setPaginations}
                    page={currentPage}
                    limit={10}
                    searchType="tapPhim"
                    onResult={handleSearchResult}
                    onClear={handleClearSearch}
                    placeholder="Tìm kiếm tập của phim..."
                >
                    Tìm kiếm tập của phim
                </Search>

                <ListTapPhim
                    searchType="tapPhim"
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
