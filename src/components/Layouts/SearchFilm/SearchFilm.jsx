import React, { useEffect, useState } from "react";
import TippyHeadless from '@tippyjs/react/headless';
import Tippy from "@tippyjs/react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import WrapperPopper from "../../Popper/Wrapper";
import './SearchFilm.scss'
import FilmInfo from "../../Layouts/FilmInfo/FilmInfo";
import TabButton from "../../Button/TabButton";
import * as phimServices  from "../../../services/User/FilmService";
import * as searchServices from "../../../services/User/SearchSevice"
import useDebounce from "../../../hooks/useDebounce";

export default function SearchFilm(){
    const [inputValue, setInputValue] = useState("");
    const[searchResult,setSearchResult] = useState([]);
    const[showResult, setShowResult] = useState(true)
    
    const debounce = useDebounce(inputValue,600);

    useEffect(() => {
        if(!debounce.trim()){
            setSearchResult([])
            return;
        }
        const fetchApi = async () => {
            
            const  result = await searchServices.searchphim(debounce);
            setSearchResult(result.data)
        }
        fetchApi();
    },[debounce])

    function HandelSearch(onSearch) {
        alert(`${onSearch} được chọn`);
            const fetchApi = async () => {
                let result;
                if(!onSearch){
                    result = await phimServices.listphim();
                }else{
                    result = await phimServices.phim(onSearch);
                }
            }
        fetchApi();
      }

    function HandelHideResult() {
        setShowResult(false);
    }
    return(

        <form className="d-flex " onSubmit={(e) => e.preventDefault()}>
                                    
            <TippyHeadless
                interactive = {true}
                visible={showResult && searchResult.length > 0}
                onClickOutside={HandelHideResult}
                render={attrs => (
                    <WrapperPopper>
                        <div className="search-result" tabIndex={-1} {...attrs}>
                            {searchResult.map((result) => (
                                <FilmInfo key={result.phimId} data={result}/>
                            ))}
                        </div>
                    </WrapperPopper>
                )}
                >
                <div>
                    <input className="search-form-control me-2" type="search" name="timkiem" placeholder="Tìm anime... " value={inputValue} onChange={(e) => setInputValue(e.target.value) } onFocus={() => setShowResult(true)}/>
                </div>
            </TippyHeadless>

            <TabButton onSelect={() => {HandelSearch(inputValue)}}>Tìm</TabButton>
        </form> 
    );
}