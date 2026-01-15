import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import "swiper/css/pagination";


import * as phimServices from "../../../services/User/FilmService.jsx"
import FilmBanner from "./FilmBanner";
import './FilmBanners.scss'

export default function FilmBannerList({ page, limit }) {
    const [listMostViewsPhimResult, setListMostViewsPhimResult] = useState([]); // top lượt xem phim


    useEffect(() => {

        const fetchApi = async () => {

            const result = await phimServices.listTopLuotXemPhim(page, limit);
            setListMostViewsPhimResult(result.data);
        }

        fetchApi();

    }, []);


    return (
        <div >

            <Swiper
                modules={[Autoplay, Pagination]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                spaceBetween={20}
                slidesPerView={1}
                loop={true}>
                {listMostViewsPhimResult.map((result) => (
                    <SwiperSlide key={result.phimId}>
                        <FilmBanner data={result} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};