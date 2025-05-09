import { useEffect, useState } from 'react';
import {Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Tippy from "@tippyjs/react";

import './FilmList.scss'
import FilmItem from './FilmItem.jsx'
import * as phimServices from '../../../services/User/FilmService.jsx'

export default function FilmList({top,page,limit}){
    const[newPhimsResult,setNewPhimsResult] = useState([]);

    useEffect(() => {
        const  fetchApi = async () => {
            const result = await phimServices.newPhims(top,page,limit);
            setNewPhimsResult(result.data)
        }
        fetchApi()
    },[top,page,limit])

    return(
        <Swiper
            slidesPerView={9}
            spaceBetween={1}
            loop={false}
        >
            {newPhimsResult.map((result) => (
                
                    <SwiperSlide>
                        <Tippy content = {result.tenP}
                        >
                            <div className="film-list" id="film-list">
                                <FilmItem key={result.phimId} data={result}/>
                            </div>
                        </Tippy>
                    </SwiperSlide>

                ))}
        </Swiper>
    );
}