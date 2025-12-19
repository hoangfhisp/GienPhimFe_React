import { Link } from "react-router-dom";
import { formatURLImage } from "../../../untils/Format";


export default function FilmList({data}) {
    return (
            <div className="film-item" >
                <Link to={`/Phim/${data.phimId}`}>
                    <img src={data.avatarPoster ? formatURLImage(data.avatarPoster) : null} alt={data.tenP} />
                    <p><strong>{data.tenP}</strong></p>
                </Link>

            </div>
    );
}