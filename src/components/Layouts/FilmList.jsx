

const movies = [
    { id: 1, TenP: "Phim 1", poster: "https://cdn.animevietsub.lol/data/poster/2025/04/03/animevsub-zzodeusJQP.jpg" },
    { id: 2, TenP: "Phim 2", poster: "https://cdn.animevietsub.lol/data/poster/2025/04/03/animevsub-zzodeusJQP.jpg" }
];


export default function FilmList() {
    return (
        <>
            {movies.map(movie => (
                <div className="film-item" key={movie.id}>
                    <a href="#">
                        <img src={movie.poster} alt={movie.TenP} />
                        <p><strong>{movie.TenP}</strong></p>
                    </a>
                </div>
            ))}
        </>
    );
}