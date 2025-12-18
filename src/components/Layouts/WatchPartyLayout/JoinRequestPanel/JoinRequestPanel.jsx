import "./JoinRequestPanel.scss";

export default function JoinRequestPanel() {
    // mock – sau này map API JoinRequest
    const requests = [
        { id: "r1", userName: "User A", requestedAt: "1 phút trước" },
        { id: "r2", userName: "User B", requestedAt: "5 phút trước" },
    ];

    return (
        <div className="JoinRequestPanel">
            <div className="JoinRequestPanel__header">
                <div className="JoinRequestPanel__title">
                    Yêu cầu tham gia
                </div>
                <div className="JoinRequestPanel__count">
                    {requests.length}
                </div>
            </div>

            <div className="JoinRequestPanel__list">
                {requests.map((r) => (
                    <div key={r.id} className="JoinRequestRow">
                        <div className="JoinRequestRow__info">
                            <div className="JoinRequestRow__name">
                                {r.userName}
                            </div>
                            <div className="JoinRequestRow__time">
                                {r.requestedAt}
                            </div>
                        </div>

                        <div className="JoinRequestRow__actions">
                            <button className="MiniBtn MiniBtn--accept">
                                ✓ Chấp nhận
                            </button>
                            <button className="MiniBtn MiniBtn--reject">
                                ✕ Từ chối
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
