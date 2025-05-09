import ReactPlayer from "react-player";

function Trailer({data}){
    return(
        <div className="player-wrapper">
            <ReactPlayer
                url={data.traiLerP}
                width="100%"
                height="100%"
                controls
            />
        </div>
    );
}

export default Trailer;