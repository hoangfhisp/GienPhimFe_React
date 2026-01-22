import { useEffect, useRef, useState } from 'react';

import './PhimBanner.scss'
import * as phimServices from '../../../services/User/FilmService.jsx'
import { Link, useLocation } from 'react-router-dom';
import WatchTogetherButton from "../../Commons/WatchTogetherButton";
import CreateChatGroupModal from "../../Modal/CreateChatGroupModal";
import { formatURLImage, formatYearVN } from '../../../untils/Format.jsx';
import * as authHook from '../../../hooks/auth.jsx'
import ThongBao from '../ThongBao/ThongBao.jsx';
import useScrollTo from '../../../hooks/useScrollTo.jsx';
import useIsMobile from '../../../hooks/useIsMobile.jsx';

function PhimBanner({ id }) {
    const [rating, setRating] = useState("0");
    const [dataPhim, setDataPhim] = useState([]);
    const [dataTap, setDataTap] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [showThongBao, setShowThongBao] = useState(false);

    const location = useLocation();
    const bannerPhimRef = useRef(null);

    const userId = authHook.getUserIdFromToken();
    const { scrollToRef } = useScrollTo();
    const isMobile = useIsMobile();

    useEffect(() => {
        if (!isMobile) return;
        if (location.state?.scroll === "banner-phim" && bannerPhimRef.current) {
            setTimeout(() => {
                scrollToRef(bannerPhimRef, 80);
            }, 100);
        }
    }, [isMobile, location.state]);

    useEffect(() => {
        if (id == null) {
            return;
        }

        const fetchApi = async () => {
            const resultPhim = await phimServices.phim(id);
            const resultTapPhim = await phimServices.tapPhims(id);
            setDataPhim(resultPhim.data);
            setDataTap(resultTapPhim.data);
        }
        fetchApi();
    }, [id])

    useEffect(() => {
        if (!dataPhim) {
            return;
        }

        const rate = ((dataPhim.luotThichP / (dataPhim.luotThichP + dataPhim.luotDislikeP)) * 10).toFixed(1);
        if (isNaN(rate)) {
            setRating("0")
        } else {
            setRating(rate);
        }

    }, [dataPhim])

    const handleWatchTogether = () => {
        setShowThongBao(true);
    }

    return (
        <>
            <div className="banner-phim"
                style={{
                    background: `url(${dataPhim.avatarP ? formatURLImage(dataPhim.avatarP) : null}) center/cover no-repeat`,

                }}
                ref={bannerPhimRef}
            >
                <div className="background-overlay" ></div>
                <div className="container-phim">
                    <div className="phim-info-banner">
                        <div className="phim-poster">
                            <img src={dataPhim.avatarPoster ? formatURLImage(dataPhim.avatarPoster) : null} alt={dataPhim.tenP} />
                            <Link to={`/XemPhim/${dataPhim.phimId}/${dataTap?.[0]?.slugTap ?? ''}`} className="phim-watch-btn">XEM PHIM</Link>
                        </div>
                        {userId && (
                            <>
                                <WatchTogetherButton onClick={() => handleWatchTogether()} />

                                <CreateChatGroupModal
                                    open={openModal}
                                    onClose={() => setOpenModal(false)}
                                    phimId={dataPhim.phimId}
                                />
                            </>
                        )}
                        <div className="phim-details">
                            <h1>{dataPhim.tenP}</h1>
                            <p className="phim-subtitle">{dataPhim.tenP}</p>
                            <p className="phim-description">{dataPhim.moTaP}</p>
                            <div className="rating">
                                <span className="rating-score">{rating}</span>
                                <span className="stars">☆☆☆☆☆</span>
                                <span className="reviews"> {`( ${dataPhim.luotThichP + dataPhim.luotDislikeP} )`} Đánh giá</span>
                            </div>
                            <div className="phim-stats">
                                <span>⏳ {dataPhim.thuoiLuongP}</span>
                                <span>📅 {formatYearVN(dataPhim.ngayPhatHanhP)}</span>
                                <span>👁️ {dataPhim.luotXemP} Lượt xem</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showThongBao && <ThongBao show={showThongBao} type={"warning"} title={"Chức năng đang hoàn thiện"} message={"Chức năng xem chung với bạn bè đang được đội ngũ Giền Phim phát triển, xin vui lòng đợi."} onClose={() => setShowThongBao(false)} />}
        </>
    );
}

export default PhimBanner;