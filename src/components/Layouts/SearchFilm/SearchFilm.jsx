import { useEffect, useState } from "react";
import TippyHeadless from '@tippyjs/react/headless';

import WrapperPopper from "../../Popper/Wrapper";
import './SearchFilm.scss'
import FilmInfo from "../../Layouts/FilmInfo/FilmInfo";
import TabButton from "../../Commons/TabButton";
import * as searchServices from "../../../services/User/SearchSevice"
import useDebounce from "../../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";

export default function SearchFilm({ setShowSidebar }) {
    const [inputValue, setInputValue] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(true)
    const navigate = useNavigate();
    const debounce = useDebounce(inputValue, 600);

    useEffect(() => {
        if (!debounce.trim()) {
            setSearchResult([])
            return;
        }
        const fetchApi = async () => {

            const result = await searchServices.searchphim(debounce, 1, 3);
            if (result.status == true) {
                setSearchResult(result.data)
            } else {
                setShowResult(false);
            }
        }
        fetchApi();
    }, [debounce])

    function HandelSearch(onSearch) {
        if (setShowSidebar) {
            setShowSidebar(false);
        }
        navigate(`/SearchPhim/SearchNamePhim/${onSearch}`);
    }

    function HandelHideResult() {
        setShowResult(false);
    }
    return (

        <form className="d-flex " onSubmit={(e) => e.preventDefault()}>

            <TippyHeadless
                interactive={true}
                visible={showResult && searchResult.length > 0}
                onClickOutside={HandelHideResult}
                render={attrs => (
                    <WrapperPopper>
                        <div className="search-result" tabIndex={-1} {...attrs}>
                            {searchResult.map((result) => (
                                <FilmInfo key={result.phimId} data={result} onSelect={() => { setInputValue(""); setShowSidebar(false); }} />
                            ))}
                        </div>
                    </WrapperPopper>
                )}
            >
                <div>
                    <input className="search-form-control me-2" type="search" name="timkiem" placeholder="Tìm anime... " value={inputValue} onChange={(e) => setInputValue(e.target.value)} onFocus={() => setShowResult(true)} />
                </div>
            </TippyHeadless>

            <TabButton onSelect={() => { HandelSearch(inputValue) }}>Tìm</TabButton>
        </form>
    );
}