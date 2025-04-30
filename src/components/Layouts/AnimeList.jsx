
export default function AnimeList({data}){
    return(
        <>       
                <div className="anime-item">
                    <a href="#">
                        <img src={data.avatarPoster} alt={data.tenP}/>
                        <p ><strong>{data.tenP}</strong></p>
                        <h6>Lượt xem: {data.luotXemP}</h6>
                        <span className="rating-score">Rating: {(data.luotThichP / (data.luotThichP + data.luotThichP))*100}%</span>
                        <span className="stars">★★★★★</span>
                    </a>
                </div>    
        </>

    );
}