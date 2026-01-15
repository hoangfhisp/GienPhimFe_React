import { useEffect, useState } from "react";
import TippyHeadless from '@tippyjs/react/headless';
import { Link } from "react-router-dom";

import './AnimeList.scss'

import FilmCard from "../FilmCards/FilmCard.jsx";
import WrapperPopper from "../../Popper/Wrapper.jsx";
import * as phimServices from "../../../services/User/FilmService.jsx"
import * as searchServices from '../../../services/User/SearchSevice.jsx'
import { formatDateTimeVN, formatURLImage } from "../../../untils/Format.jsx";


export default function AnimeList({ userId, timtheo, page, limit, webpage, onPagination, typePhim }) {
    const [listPhimResult, setListPhimResult] = useState([]);

    const isMobile = window.innerWidth <= 768;
    useEffect(() => {
        const fetchApi = async () => {
            try {
                let result;
                const data = {
                    ngonNguSlug: null,
                    quocGiaSlug: null,
                    theLoaiSlug: null,
                    tenDienVien: null,
                    tenDaoDien: null,
                };
                if (userId && webpage === "History") { // trang histoty

                    result = await phimServices.LichSuXemUser(userId, page, limit);

                } else if (webpage === "SearchPhim") { // trang search

                    if (typePhim === "TheLoai") {
                        data.theLoaiSlug = timtheo;
                        result = await searchServices.searchFilterPhims(data, page, limit)
                    }
                    else if (typePhim === "QuocGia") {
                        data.quocGiaSlug = timtheo;
                        result = await searchServices.searchFilterPhims(data, page, limit)
                    }

                    else if (typePhim === "DangPhim") {

                        result = await searchServices.searchDangPhimSlug(timtheo, page, limit);
                    } else if (typePhim === "TopPhim") {
                        result = await searchServices.searchTopPhim(page, limit);
                    } else if (typePhim === "SearchNamePhim") {
                        result = await searchServices.searchphim(timtheo);
                    }
                }
                else {
                    result = await phimServices.listphim(page, limit);
                }
                if (result && result.data) {
                    setListPhimResult(result.data);
                    onPagination(result.pagination);
                }

            } catch (error) {
                console.error("Lỗi khi tải danh sách phim:", error);
            }
        };

        fetchApi();
    }, [webpage, userId, page, limit, timtheo, typePhim, onPagination]);


    return (
        <>
            <div className="anime-list" id="anime-list">
                {listPhimResult.map((result) => {

                    const content = (
                        <div className="anime-item">
                            <div className="episode-label">{result.soTapP} Tập</div>

                            <Link to={`/Phim/${result.phimId}`}>
                                <img
                                    src={formatURLImage(result.avatarPoster)}
                                    alt={result.tenP}
                                />
                                <p><strong>{result.tenP}</strong></p>
                            </Link>

                            {webpage === "History" ? (
                                <>
                                    <h6>Đã xem tập: {result.tapVuaXem}</h6>
                                    <h6>vào lúc {formatDateTimeVN(result.thoiGianXem)}</h6>
                                    <Link
                                        to={`/XemPhim/${result.phimId}/${result.tapVuaXem}`}
                                        className="history-xemtiep"
                                    >
                                        Xem tiếp
                                    </Link>
                                </>
                            ) : (
                                <h6>Lượt xem: {result.luotXemP}</h6>
                            )}
                        </div>
                    );

                    // 👉 MOBILE: KHÔNG TIPPY
                    if (isMobile) {
                        return (
                            <div key={result.phimId || result.lichSuXemId}>
                                {content}
                            </div>
                        );
                    }

                    // 👉 WEB: CÓ TIPPY
                    return (
                        <TippyHeadless
                            key={result.phimId || result.lichSuXemId}
                            interactive
                            placement="right"
                            render={attrs => (
                                <WrapperPopper>
                                    <div
                                        className="film-card-result"
                                        tabIndex={-1}
                                        {...attrs}
                                    >
                                        <FilmCard data={result} />
                                    </div>
                                </WrapperPopper>
                            )}
                        >
                            {content}
                        </TippyHeadless>
                    );
                })}
            </div>

        </>

    );
}