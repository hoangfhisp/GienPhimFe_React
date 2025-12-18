import "./ChatPanel.scss";

export default function ChatPanel() {
    // MOCK trạng thái quyền
    const canChat = true;   // sau này lấy từ GroupMember
    const isMuted = false; // sau này lấy từ GroupMember

    return (
        <div className="ChatPanel">
            {/* Header */}
            <div className="ChatPanel__header">
                <div className="ChatPanel__title">Chat</div>
            </div>

            {/* Messages */}
            <div className="ChatPanel__messages">
                {/* Mock messages */}
                <div className="ChatMessage">
                    👋 Chào mừng bạn vào phòng xem phim
                </div>

                <div className="ChatMessage ChatMessage--system">
                    📌 Chủ phòng đã tạo phòng
                </div>

                <div className="ChatMessage">
                    UserA: Phim này hay ghê 😆
                </div>
            </div>

            {/* Input */}
            <div className="ChatPanel__input">
                <input
                    type="text"
                    className="ChatInput"
                    placeholder={
                        !canChat || isMuted
                            ? "Bạn không thể chat trong phòng này"
                            : "Nhập tin nhắn..."
                    }
                    disabled={!canChat || isMuted}
                />
                <button
                    className="ChatSendBtn"
                    disabled={!canChat || isMuted}
                >
                    Gửi
                </button>
            </div>
        </div>
    );
}
