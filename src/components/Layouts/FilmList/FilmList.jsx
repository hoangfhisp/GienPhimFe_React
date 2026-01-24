import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Tippy from "@tippyjs/react";

import './FilmList.scss'
import FilmItem from './FilmItem.jsx'
import * as phimServices from '../../../services/User/FilmService.jsx'
import { useMatch } from 'react-router-dom';
import FilmItemSkeleton from './FilmItemSkeleton.jsx';

export default function FilmList({ page, limit }) {
    const [newPhimsResult, setNewPhimsResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const isPhimPage = useMatch("/Phim/:id");

    useEffect(() => {

        const fetchApi = async () => {
            try {
                setLoading(true);
                const result = await phimServices.newPhims(page, limit);

                if (result?.data?.length > 0) {
                    setNewPhimsResult(result.data);
                } else {
                    setNewPhimsResult([]);
                }
            } catch (err) {
                console.error("Lỗi load phim mới:", err);
                setNewPhimsResult([]);
            } finally {
                setLoading(false);
            }
        };

        fetchApi();
    }, [page, limit]);

    return (
        <Swiper
            slidesPerView={9}
            spaceBetween={1}
            loop={false}
            breakpoints={{
                0: {
                    slidesPerView: 2.6,
                    spaceBetween: 10,
                },
                576: {
                    slidesPerView: 3.6,
                    spaceBetween: 12,
                },
                992: {
                    slidesPerView: 9,
                    spaceBetween: 1,
                },
            }}
        >
            {loading &&
                Array.from({ length: limit }).map((_, i) => (
                    <SwiperSlide key={`skeleton-${i}`}>
                        <FilmItemSkeleton />
                    </SwiperSlide>
                ))
            }
            {!loading && newPhimsResult.map((result) => (

                <SwiperSlide>
                    <Tippy content={
                        <span style={{ color: "#fff", fontSize: "14px", fontWeight: 500 }}>
                            {result.tenP}
                        </span>}
                    >
                        <div className="film-list" id="film-list">
                            <FilmItem key={result.phimId} data={result} isPhimPage={isPhimPage} />
                        </div>
                    </Tippy>
                </SwiperSlide>

            ))}
        </Swiper>
    );
}