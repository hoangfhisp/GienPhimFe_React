import React from "react";
import "./WatchTogetherButton.scss";

export default function WatchTogetherButton({ onClick }) {
    return (
        <button className="WatchTogetherButton" onClick={onClick}>
            🎬 Xem phim chung
        </button>
    );
}
