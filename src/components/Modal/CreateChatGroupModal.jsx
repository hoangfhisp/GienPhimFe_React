import React, { useState, useEffect } from "react";
import * as watchChatServices from "../../services/Watch/WatchChatService.jsx";
import "./Modal.scss";
import { useNavigate } from "react-router-dom";
import { formatDateTimeVN } from "../../untils/Format.jsx";
import * as authHook from '../../hooks/auth.jsx'

export default function ChatGroupModal({ open, onClose, phimId }) {
    const navigate = useNavigate();

    const [mode, setMode] = useState("create"); // create | join
    const [roomName, setRoomName] = useState("");

    const [availableGroups, setAvailableGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(false);

    const userId = authHook.getUserIdFromToken();

    useEffect(() => {
        if (!open) {
            setMode("create");
            setRoomName("");
            setAvailableGroups([]);
        }
    }, [open]);

    const isCanJoin = (group) => {

        if (group.createdByUserId === userId) return true;

        if (
            group.joinRequest &&
            group.joinRequest.requestUserId === userId &&
            group.joinRequest.status === "Accepted"
        ) {
            return true;
        }

        return false;
    };
    // ================= CREATE =================
    const handleCreate = async () => {
        if (!roomName.trim()) {
            alert("Vui lòng nhập tên phòng");
            return;
        }

        try {
            const result = await watchChatServices.createChatGroup(
                phimId,
                roomName.trim()
            );

            if (result.status) {
                navigate(`/watch-party/${result.data.groupId}`);
            } else {
                alert(result.msg || "Tạo phòng thất bại");
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi tạo phòng");
        }
    };


    const fetchAvailableGroups = async () => {
        try {
            setLoadingGroups(true);

            const result = await watchChatServices.getChatGroupByFilm(
                phimId,
                null,
                1,
                10
            );

            if (result.status && Array.isArray(result.data)) {

                const groupsWithRequest = await Promise.all(
                    result.data.map(async (g) => {
                        const jr = await watchChatServices.getJoinRequestByGroupId(g.groupId);
                        return {
                            ...g,
                            joinRequest: jr?.data?.find(
                                r => r.requestUserId === userId
                            ) || null
                        };
                    })
                );

                setAvailableGroups(groupsWithRequest);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingGroups(false);
        }
    };

    const handleJoin = (group) => {
        if (!group.allowJoinByLink) {
            alert("Bạn không được phép tham gia phòng này");
            return;
        }
        navigate(`/watch-party/${group.groupId}`);
    };

    const isValidGroup = (group) => {
        if (group.isDeleted) return false;

        const start = new Date(group.showStartTime);
        const end = new Date(group.showEndTime);

        if (end < start) return false;

        return true;
    };

    const handleRequestJoin = async (group) => {
        try {
            const res = await watchChatServices.CreateJoinRequest(group.groupId);
            if (res.status) {
                alert("Đã gửi yêu cầu tham gia");
            } else {
                alert(res.msg);
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi gửi yêu cầu");
        }
    };

    if (!open) return null;

    return (
        <div className="ModalOverlay" onClick={onClose}>
            <div className="ModalBox ModalBox--md" onClick={(e) => e.stopPropagation()}>
                <h3 className="ModalTitle">Phòng xem phim chung</h3>


                <div className="ModalTabs">
                    <button
                        className={`TabBtn ${mode === "create" ? "active" : ""}`}
                        onClick={() => setMode("create")}
                    >
                        Tạo phòng
                    </button>

                    <button
                        className={`TabBtn ${mode === "join" ? "active" : ""}`}
                        onClick={() => {
                            setMode("join");
                            fetchAvailableGroups();
                        }}
                    >
                        Tham gia phòng
                    </button>
                </div>

                <div className="ModalBody">

                    {mode === "create" && (
                        <>
                            <label className="ModalLabel">Tên phòng</label>
                            <input
                                type="text"
                                className="ModalInput"
                                placeholder="Ví dụ: Xem phim cùng hội bạn"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                maxLength={100}
                            />
                        </>
                    )}


                    {mode === "join" && (
                        <>
                            {loadingGroups && (
                                <p style={{ color: "#111" }}>Đang tải danh sách phòng...</p>
                            )}

                            {!loadingGroups && availableGroups.length === 0 && (
                                <p style={{ color: "#111" }}>
                                    Chưa có phòng nào cho phim này
                                </p>
                            )}

                            {!loadingGroups &&
                                availableGroups
                                    .filter(isValidGroup)
                                    .map((g) => (
                                        <div key={g.groupId} className="GroupRow">
                                            <div className="GroupRow__info">
                                                <div className="GroupRow__name">
                                                    {g.phimName}
                                                </div>

                                                <div className="GroupRow__meta">
                                                    ⏱ {formatDateTimeVN(g.showStartTime)}
                                                    <br />
                                                    ⏱ {formatDateTimeVN(g.showEndTime)}
                                                </div>
                                            </div>

                                            <div className="GroupRow__action">
                                                <button
                                                    className={`GroupActionBtn ${isCanJoin(g) ? "approved" : "pending"
                                                        }`}
                                                    onClick={() => {
                                                        if (isCanJoin(g)) {
                                                            handleJoin(g);
                                                        } else {
                                                            handleRequestJoin(g);
                                                        }
                                                    }}
                                                >
                                                    {isCanJoin(g) ? "Tham gia" : "Xin vô"}
                                                </button>

                                            </div>
                                        </div>
                                    ))}
                        </>
                    )}
                </div>

                <div className="ModalFooter">
                    <button className="Btn Btn--ghost" onClick={onClose}>
                        Huỷ
                    </button>

                    {mode === "create" && (
                        <button className="Btn Btn--primary" onClick={handleCreate}>
                            Tạo phòng
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
