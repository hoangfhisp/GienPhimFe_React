import { useParams } from "react-router-dom";
import BoxTitle from "../../components/Commons/BoxTitle";
import AnimeList from "../../components/Layouts/AnimeList/AnimeList";
import Notice from "../../components/Layouts/Notice/Notice";
import { useEffect, useState } from "react";
import RenderPagination from "../../components/Commons/RenderPagination";

function SearchPhim(){
    const {type,timtheo} = useParams();

    const [pagination,setPagination] = useState([]);
    const [currentPage,setCurrentPage] = useState();

    console.log(type)
    return(
        <>
            <div className="container-main">
                <Notice/>

                <BoxTitle>Bạn Đang tìm phim theo: {timtheo}</BoxTitle>
                <br /> <hr />
                
                <AnimeList typePhim = {type} timtheo = {timtheo} page={currentPage} limit={18} webpage={'SearchPhim'} onPagination={setPagination}/>
                
                <RenderPagination data={pagination} onPageChange={setCurrentPage}/>
            </div>
        </>
    );
}

export default SearchPhim;