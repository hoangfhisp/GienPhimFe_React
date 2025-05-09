import { Link } from "react-router-dom";


export default function FilmList({data}) {
    return (
            <div className="film-item" >
                <Link to={`/Phim/${data.phimId}`}>
                    <img src={data.avatarPoster} alt={data.tenP} />
                    <p><strong>{data.tenP}</strong></p>
                </Link>

            </div>
    );
}