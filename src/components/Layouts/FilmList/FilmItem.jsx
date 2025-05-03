

export default function FilmList({data}) {
    return (
            <div className="film-item" >
                <a href="#">
                    <img src={data.avatarPoster} alt={data.tenP} />
                    <p><strong>{data.tenP}</strong></p>
                </a>
            </div>
    );
}