import { Link } from "react-router-dom";
import { formatURLImage } from "../../../untils/Format";


export default function FilmList({ data, isPhimPage }) {
    return (
        <div className="film-item" >
            <Link
                to={`/Phim/${data.phimId}`}
                state={isPhimPage ? { scrollTarget: "banner-phim", scrollTop: false } : undefined}
            >
                <img src={data.avatarPoster ? formatURLImage(data.avatarPoster) : null} alt={data.tenP} />
                <p><strong>{data.tenP}</strong></p>
            </Link>

        </div>
    );
}