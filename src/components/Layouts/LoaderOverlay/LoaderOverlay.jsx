
import Loader from "../../Commons/Loader/Loader";
import "./LoaderOverlay.scss";


export default function LoaderOverlay() {
    return (
        <div className="loader-overlay">
            <div className="loader-content">
                <Loader />
                <h1 className="loader-name">Gien Phim</h1>
            </div>
        </div>
    );
}