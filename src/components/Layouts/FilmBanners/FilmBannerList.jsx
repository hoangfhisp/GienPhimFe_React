import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import "swiper/css/pagination";


import * as phimServices from "../../../services/User/FilmService.jsx"
import FilmBanner from "./FilmBanner";
import './FilmBanners.scss'
import FilmBannerSkeleton from "./FilmBannerSkeleton.jsx";

export default function FilmBannerList({ page, limit }) {
    const [listMostViewsPhimResult, setListMostViewsPhimResult] = useState([]); // top lượt xem phim
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchApi = async () => {
            try {
                setLoading(true);
                const result = await phimServices.listTopLuotXemPhim(page, limit);

                if (result?.data?.length > 0) {
                    setListMostViewsPhimResult(result.data);
                } else {
                    setListMostViewsPhimResult([]);
                }

            } catch (error) {
                console.error("Lỗi load top lượt xem:", error);
                setListMostViewsPhimResult([]);
            } finally {
                setLoading(false);
            }
        }
        fetchApi();
    }, [page, limit]);


    return (
        <div >

            <Swiper
                modules={[Autoplay, Pagination]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                spaceBetween={20}
                slidesPerView={1}
                loop={true}>
                {loading
                    ? [...Array(1)].map((_, i) => (
                        <SwiperSlide key={i}>
                            <FilmBannerSkeleton />
                        </SwiperSlide>
                    ))
                    : listMostViewsPhimResult.map(result => (
                        <SwiperSlide key={result.phimId}>
                            <FilmBanner data={result} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    );
};