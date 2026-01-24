import './PhimBannerSkeleton.scss';

export default function PhimBannerSkeleton() {
    return (
        <div className="banner-phim skeleton">
            <div className="background-overlay"></div>

            <div className="container-phim">
                <div className="phim-info-banner">
                    
                    <div className="phim-poster">
                        <div className="skeleton-poster"></div>
                        <div className="skeleton-btn"></div>
                    </div>

                    <div className="phim-details">
                        <div className="skeleton-title"></div>
                        <div className="skeleton-subtitle"></div>

                        <div className="skeleton-desc">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>

                        <div className="skeleton-rating"></div>
                        <div className="skeleton-stats"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
