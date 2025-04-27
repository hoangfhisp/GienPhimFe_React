
const animelist = [
    { id: 1, TenP: "Thăng Cấp 1 Mình", poster: "https://phimimg.com/upload/vod/20240109-1/7cd20bfff7d6ad42644017bc731a0377.jpg" , luotxem: 1 , Ratting: 100},
    { id: 2, TenP: "Phim 2", poster: "https://cdn.animevietsub.lol/data/poster/2025/04/03/animevsub-zzodeusJQP.jpg", luotxem: 19 , Ratting: 100}
];

export default function AnimeList(){
    return(
        <>
            {animelist.map(animelist => (        
                <div className="anime-item">
                    <a href="#">
                        <img src={animelist.poster} alt={animelist.TenP}/>
                        <h5><strong>{animelist.TenP}</strong></h5>
                        <h6>Lượt xem: {animelist.luotxem}</h6>
                        <span className="rating-score">Rating: {animelist.Ratting}%</span>
                        <span className="stars">★★★★★</span>
                    </a>
                </div>    
            ))}
        </>

    );
}