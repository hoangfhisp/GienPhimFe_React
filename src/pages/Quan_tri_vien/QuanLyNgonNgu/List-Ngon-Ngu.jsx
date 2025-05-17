import React, { useState } from 'react';
import AdminBoard from '../../../components/Layouts/Admin-board/Admin-board';
import ListNgonNgu from '../../../components/Layouts/AdminList/ListNgonNgu';
import Search from '../../../components/Layouts/SearchAdmin/Search';
import RenderPagination from '../../../components/Commons/RenderPagination';

export default function NgonNguList() {
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
                    <h1 className="mb-0">Danh sách ngôn ngữ</h1>
                </div>
                <hr />
                <Search
                    onPagination={setPaginations}
                    page={currentPage}
                    limit={10}
                    searchType="ngonNgu"
                    onResult={handleSearchResult}
                    onClear={handleClearSearch}
                    placeholder="Tìm kiếm ngôn ngữ..."
                >
                    Tìm kiếm ngôn ngữ
                </Search>

                <ListNgonNgu
                    searchType="ngonNgu"
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