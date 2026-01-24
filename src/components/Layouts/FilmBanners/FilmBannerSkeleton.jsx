import "./FilmBannerSkeleton.scss";

export default function FilmBannerSkeleton() {
    return (
        <div className="banner skeleton">
            <div className="overlay-banner"></div>

            <div className="content-banner">
                <div className="title-banner"></div>
                <h7></h7>

                <div className="info-banner">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <p></p>
                <div className="studio-banner"></div>

                <div className="genres-banner">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <div className="watch-btn"></div>
            </div>
        </div>

    );
}
