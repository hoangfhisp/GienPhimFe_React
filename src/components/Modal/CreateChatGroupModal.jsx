import React, { useState } from "react";
import "./Modal.scss";

export default function CreateChatGroupModal({
    open,
    onClose,
    onSubmit,
}) {
    const [roomName, setRoomName] = useState("");

    if (!open) return null;

    const handleSubmit = () => {
        if (!roomName.trim()) {
            alert("Vui lòng nhập tên phòng");
            return;
        }

        onSubmit({
            roomName: roomName.trim(),
        });
    };

    return (
        <div className="ModalOverlay" onClick={onClose}>
            <div className="ModalBox" onClick={(e) => e.stopPropagation()}>
                <h3 className="ModalTitle">Tạo phòng xem phim chung</h3>

                <div className="ModalBody">
                    <label className="ModalLabel">Tên phòng</label>
                    <input
                        type="text"
                        className="ModalInput"
                        placeholder="Ví dụ: Xem phim cùng hội bạn"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        maxLength={100}
                    />
                </div>

                <div className="ModalFooter">
                    <button className="Btn Btn--ghost" onClick={onClose}>
                        Huỷ
                    </button>
                    <button className="Btn Btn--primary" onClick={handleSubmit}>
                        Tạo phòng
                    </button>
                </div>
            </div>
        </div>
    );
}
