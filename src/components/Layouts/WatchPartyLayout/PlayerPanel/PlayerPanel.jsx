import "./PlayerPanel.scss";

export default function PlayerPanel() {
    // TẠM THỜI MOCK
    const isOwner = true;

    return (
        <div className="PlayerPanel">
            {/* Player area */}
            <div className="PlayerPanel__player">
                <div className="PlayerPlaceholder">
                    🎬 Video Player (mock)
                </div>
            </div>

            {/* Control bar (owner only – mock) */}
            {isOwner && (
                <div className="PlayerPanel__controls">
                    <button className="ControlBtn">⏮</button>
                    <button className="ControlBtn">⏯</button>
                    <button className="ControlBtn">⏭</button>
                    <button className="ControlBtn">🔊</button>
                </div>
            )}
        </div>
    );
}
