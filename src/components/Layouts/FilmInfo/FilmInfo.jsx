import { Link } from 'react-router-dom';

import './FilmInfo.scss'
import { formatURLImage } from '../../../untils/Format';

function FilmInfo({data,onSelect}){
    return (
        <Link to={`/Phim/${data.phimId}`} className="phim-list-info" onClick={onSelect}>
            <img src= {formatURLImage(data.avatarPoster)} className="phim-avatar" alt={data.tenP}/>
            <div className="phim-info">
                <p className="phim-title">
                    {data.tenP}
                </p>
                <span className="phim-tap">Tập 04 Vietsub</span>
            </div>
        </Link>
    );
}

export default FilmInfo;