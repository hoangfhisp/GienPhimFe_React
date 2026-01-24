import "./FilmItemSkeleton.scss";
export default function FilmItemSkeleton() {
    return (
        <div className="film-list">
            <div className="film-item skeleton">
                <div className="skeleton-img"></div>
                <div className="skeleton-text"></div>
            </div>
        </div>
    );
}
