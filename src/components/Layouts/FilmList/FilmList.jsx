import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Tippy from "@tippyjs/react";
 
import './FilmList.scss'
import FilmItem from './FilmItem.jsx'
import * as phimServices from '../../../services/User/FilmService.jsx'
import { useMatch } from 'react-router-dom';

export default function FilmList({ page, limit }) {
    const [newPhimsResult, setNewPhimsResult] = useState([]);

    const isPhimPage = useMatch("/Phim/:id");

    useEffect(() => {
        const fetchApi = async () => {
            const result = await phimServices.newPhims(page, limit);
            setNewPhimsResult(result.data)
        }
        fetchApi();
    }, [page, limit])

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
            {newPhimsResult.map((result) => (

                <SwiperSlide>
                    <Tippy content={
                        <span style={{ color: "#fff", fontSize: "14px", fontWeight: 500 }}>
                            {result.tenP}
                        </span>}
                    >
                        <div className="film-list" id="film-list">
                            <FilmItem key={result.phimId} data={result} isPhimPage={isPhimPage}/>
                        </div>
                    </Tippy>
                </SwiperSlide>

            ))}
        </Swiper>
    );
}