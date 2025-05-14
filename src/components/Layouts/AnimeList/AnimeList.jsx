import { useEffect, useState } from "react";
import TippyHeadless from '@tippyjs/react/headless';
import { Link } from "react-router-dom";

import './AnimeList.scss'

import FilmCard from "../FilmCards/FilmCard.jsx";
import WrapperPopper from "../../Popper/Wrapper.jsx";
import * as phimServices from "../../../services/User/FilmService.jsx"

export default function AnimeList({ page, limit }) {
    const [listPhimResult, setListPhimResult] = useState([]);

    useEffect(() => {

        const fetchApi = async () => {

            const result = await phimServices.listphim(page, limit);
            setListPhimResult(result.data);
        }

        fetchApi();

    }, [page, limit]);

    return (
        <>
            <div className="anime-list" id="anime-list">
                {listPhimResult.map((result) => (
                    <TippyHeadless
                        key={result.phimId}
                        interactive
                        placement="right"
                        render={attrs => (
                            <WrapperPopper>
                                <div className="film-card-result" tabIndex={-1} {...attrs}>
                                    <FilmCard data={result} />
                                </div>
                            </WrapperPopper>
                        )}
                    >
                        <div className="anime-item">
                            <Link to={`/Phim/${result.phimId}`}>
                                <img src={result.avatarPoster} alt={result.tenP} />
                                <p ><strong>{result.tenP}</strong></p>
                                <h6>Lượt xem: {result.luotXemP}</h6>
                                {/* <span className="rating-score-list">Rating: {(result.luotThichP / (result.luotThichP + result.luotThichP))*100}%</span>
                                    <span className="stars-list">★★★★★</span> */}
                            </Link>
                        </div>
                    </TippyHeadless>
                ))}
            </div>
        </>

    );
}