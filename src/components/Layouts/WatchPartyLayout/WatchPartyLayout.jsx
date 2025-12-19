import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./WatchPartyLayout.scss";

import RoomHeader from "./RoomHeader/RoomHeader";
import PlayerPanel from "./PlayerPanel/PlayerPanel";
import ChatPanel from "./ChatPanel/ChatPanel";
import MembersPanel from "./MembersPanel/MembersPanel";

import * as authHook from "../../../hooks/auth.jsx";
import * as watchChatServices from "../../../services/Watch/WatchChatService.jsx";
import * as phimServices from "../../../services/User/FilmService.jsx";

export default function WatchPartyLayout() {
    const navigate = useNavigate();
    const { groupId } = useParams();
    const userId = authHook.getUserIdFromToken();

    const [chatGroup, setChatGroup] = useState(null);
    const [membersGroup, setMembersGroup] = useState([]);
    const [isHost, setIsHost] = useState(false);

    const [tapList, setTapList] = useState([]);
    const [currentTap, setCurrentTap] = useState(null);

    useEffect(() => {
        if (!userId || !groupId) return;

        const fetchGroupData = async () => {
            try {
                /* ================== 1. LẤY THÔNG TIN NHÓM ================== */
                const groupRes = await watchChatServices.getChatGroupByGroupId(groupId);
                if (
                    !groupRes.status ||
                    groupRes.data.isDeleted ||
                    groupRes.data.showEndTime < new Date().toISOString()
                ) {
                    alert("Phòng không tồn tại hoặc đã kết thúc");
                    navigate("/Home");
                    return;
                }

                setChatGroup(groupRes.data);

                /* ================== 2. LẤY DANH SÁCH TẬP ================== */
                const tapRes = await phimServices.tapPhims(groupRes.data.phimId);
                if (tapRes.status && tapRes.data.length > 0) {
                    setTapList(tapRes.data);
                    setCurrentTap(tapRes.data[0]); // mặc định tập đầu
                }

                /* ================== 3. MEMBER CHÍNH THỨC ================== */
                const membersRes = await watchChatServices.getGroupMembersByGroupId(groupId, 1, 50);
                let mergedMembers = [];

                if (membersRes.status) {
                    mergedMembers = membersRes.data.map(m => ({
                        ...m,
                        status: "Accepted"
                    }));
                }

                /* ================== 4. REQUEST JOIN ================== */
                const requestsRes = await watchChatServices.getJoinRequestByGroupId(groupId);
                if (requestsRes.status) {
                    requestsRes.data.forEach(req => {
                        if (!mergedMembers.find(m => m.userId === req.requestUserId)) {
                            mergedMembers.push({
                                userId: req.requestUserId,
                                isOwner: false,
                                status: req.status
                            });
                        }
                    });
                }

                /* ================== 5. CHECK HOST ================== */
                const host = mergedMembers.find(
                    m => m.userId === userId && m.isOwner === true
                );
                setIsHost(!!host);

                /* ================== 6. CHECK QUYỀN ================== */
                const isInGroup = mergedMembers.some(m => m.userId === userId);
                if (!isInGroup) {
                    alert("Bạn không có quyền vào phòng này");
                    navigate("/Home");
                    return;
                }

                setMembersGroup(mergedMembers);

            } catch (err) {
                console.error("WatchParty error:", err);
            }
        };

        fetchGroupData();
    }, [groupId, userId, navigate]);

    return (
        <div className="WatchPartyLayout">

            {/* ================= LEFT: PLAYER ================= */}
            <div className="WatchPartyLayout__player">
                <div className="PlayerBox">
                    <div className="PlayerBox__header">
                        <div className="PlayerBox__title">
                            {chatGroup?.phimName || "Watch Party"}
                        </div>
                        <div className="PlayerBox__sub">
                            GroupId: {groupId}
                        </div>
                    </div>

                    <PlayerPanel
                        groupId={groupId}
                        userId={userId}
                        isHost={isHost}
                        tapList={tapList}
                        currentTap={currentTap}
                        onSelectTap={setCurrentTap}
                    />
                </div>

                <RoomHeader datagroup={chatGroup} />
            </div>

            {/* ================= RIGHT: MEMBERS + CHAT ================= */}
            <div className="WatchPartyLayout__right">
                <MembersPanel
                    dataMembers={membersGroup}
                    userId={userId}
                    isOwner={isHost}
                />

                <ChatPanel
                    userId={userId}
                    groupId={groupId}
                />
            </div>
        </div>
    );
}
