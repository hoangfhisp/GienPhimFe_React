import React, { useState } from 'react';
import AdminBoard from '../../../components/Layouts/Admin-board/Admin-board';
import ListTheLoai from '../../../components/Layouts/AdminList/ListTheLoai';
import Search from '../../../components/Layouts/SearchAdmin/Search';
import * as movieServices from "../../../services/Admin/MovieService";
import RenderPagination from '../../../components/Commons/RenderPagination';

export default function TheLoaiList() {
    const [paginations,setPaginations] = useState([]);
    const [currentPage,setCurrentPage] = useState();
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
                    <h1 className="mb-0">Danh sách thể loại</h1>
                </div>
                <hr />
                <Search
                    onPagination={setPaginations}
                    page={currentPage}
                    limit={10}
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
                    page={currentPage }
                    limit={10}
                    onPageChange={setPaginations}
                />
                
                <RenderPagination data={paginations} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
}
