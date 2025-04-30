import './FilmInfo.scss'

function FilmInfo({data}){
    return (
        <div className="phim-list-info">
            <img src= {data.avatarPoster} className="phim-avatar" alt={data.tenP}/>
            <div className="phim-info">
                <p className="phim-title">
                    {data.tenP}
                </p>
                <span className="phim-tap">Tập 04 Vietsub</span>
            </div>
        </div>
    );
}

export default FilmInfo;