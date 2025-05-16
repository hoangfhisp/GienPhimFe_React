import { useState } from "react";

import BoxTitle from "../../components/Commons/BoxTitle";
import AnimeList from "../../components/Layouts/AnimeList/AnimeList";
import Notice from "../../components/Layouts/Notice/Notice";
import RenderPagination from "../../components/Commons/RenderPagination.jsx"
function History(){
    const [pagination,setPagination] = useState([]);
    const [currentPage,setCurrentPage] = useState();
    return(
        <>
            <div className="container-main">
                <Notice/>

                <BoxTitle>Lịch sử xem gân đây của : </BoxTitle>

                <br /> <hr />   

                <AnimeList userId={"4b6d0384-5e73-411a-9c9a-5765aef56e9e"} page={currentPage} limit={12} webpage= {"History"} onPagination = {setPagination}/>

                <RenderPagination data={pagination} onPageChange={setCurrentPage}/>
                
            </div>
        </>
    );
}

export default History;