import "./RatingStar.scss";

export const RatingStar = ({ score = 0, allowHalf = true }) => {
    const stars = allowHalf
        ? Math.round(score) / 2
        : Math.round(score / 2);

    return (
        <div className="rating-star">
            {[1, 2, 3, 4, 5].map((i) => {
                let type = "empty";
                if (stars >= i) type = "full";
                else if (stars >= i - 0.5) type = "half";

                return (
                    <span key={i} className={`star ${type}`}>
                        {/* nền */}
                        <svg className="star-bg" viewBox="0 0 24 24">
                            <path d="M12,17.27L18.18,21L16.54,13.97
                                     L22,9.24L14.81,8.62L12,2
                                     L9.19,8.62L2,9.24L7.45,13.97
                                     L5.82,21L12,17.27Z" />
                        </svg>

                        {/* nửa sao */}
                        {type === "half" && (
                            <svg className="star-fill" viewBox="0 0 24 24">
                                <path d="M12,17.27L18.18,21L16.54,13.97
                                         L22,9.24L14.81,8.62L12,2
                                         L9.19,8.62L2,9.24L7.45,13.97
                                         L5.82,21L12,17.27Z" />
                            </svg>
                        )}
                    </span>
                );
            })}
        </div>
    );
};
