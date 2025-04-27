
const rank = [
    {phim: "Thăng Cấp 1 Mình"},
    {phim: "Blue Box"}
];



export default function FilmRanking({children}){
    return(
        <div className="sidebar">
            <br/>
            <h2 style={{color: "yellow"}}>{children}</h2>
            {rank.map(ranking => (
                <p># {ranking.phim}</p>
            ))}
            
        </div>
    );
}