import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function FilmTap({data,children,idphim,slugtap,onSelect}){
    const[dataTap,setDataTap] = useState([])
    
    useEffect(() => {
        if(data){
            setDataTap(data);
        }


    },[data])
    return(
        <div className="info-tap">
            <div className="tap-title">
                <span>{children}</span>
            </div>
            <div className="tap-list" id="tap-list">

                {dataTap.map((result) => (
                    <Link to={`/XemPhim/${idphim}/${result.slugTap}`} className={`tap ${result.slugTap == slugtap ? 'active' : ''}`} key={result.tapPhimId} onClick={onSelect}>{result.tenTap}</Link>
                ))}

            </div>
        </div>
    );
}

export default FilmTap;