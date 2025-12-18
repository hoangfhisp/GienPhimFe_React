import "./RoomHeader.scss";

export default function RoomHeader() {
    return (
        <div className="RoomHeader">
            {/* LEFT: Room info */}
            <div className="RoomHeader__left">
                <div className="RoomHeader__title">
                    Xem phim chung
                </div>
                <div className="RoomHeader__subtitle">
                    Phòng xem phim (mock)
                </div>
            </div>

            {/* RIGHT: Actions (owner only – mock) */}
            <div className="RoomHeader__right">
                <button className="RoomHeader__btn">
                    🔗 Mời
                </button>
                <button className="RoomHeader__btn RoomHeader__btn--danger">
                    ⛔ Đóng phòng
                </button>
            </div>
        </div>
    );
}
