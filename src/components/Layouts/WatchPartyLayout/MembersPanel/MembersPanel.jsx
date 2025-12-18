import "./MembersPanel.scss";

export default function MembersPanel() {
    const isOwner = true; // mock

    // mock members
    const members = [
        { userId: "u1", name: "Bạn (Owner)", isOwner: true, isMuted: false, canChat: true, canControlFilm: true },
        { userId: "u2", name: "User A", isOwner: false, isMuted: false, canChat: true, canControlFilm: false },
        { userId: "u3", name: "User B", isOwner: false, isMuted: true, canChat: false, canControlFilm: false },
    ];

    return (
        <div className="MembersPanel">
            <div className="MembersPanel__header">
                <div className="MembersPanel__title">Thành viên</div>
                <div className="MembersPanel__count">{members.length}</div>
            </div>

            <div className="MembersPanel__list">
                {members.map((m) => (
                    <div key={m.userId} className="MemberRow">
                        <div className="MemberRow__info">
                            <div className="MemberRow__name">
                                {m.name} {m.isOwner ? <span className="Badge Badge--owner">👑 Owner</span> : null}
                            </div>
                            <div className="MemberRow__meta">
                                {m.isMuted ? "🔇 Muted" : "🔊 Normal"} • {m.canControlFilm ? "🎬 Control" : "👀 View"}
                            </div>
                        </div>

                        {/* Actions: only owner can see/manage others (mock) */}
                        {isOwner && !m.isOwner && (
                            <div className="MemberRow__actions">
                                <button className="MiniBtn">Mute</button>
                                <button className="MiniBtn">Allow Chat</button>
                                <button className="MiniBtn">Make Owner</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
