import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./WatchPartyLayout.scss";
import RoomHeader from "./RoomHeader/RoomHeader";
import PlayerPanel from "./PlayerPanel/PlayerPanel";
import ChatPanel from "./ChatPanel/ChatPanel";
import MembersPanel from "./MembersPanel/MembersPanel";
import * as authHook from '../../../hooks/auth.jsx';
import * as watchChatServices from '../../../services/Watch/WatchChatService.jsx';

export default function WatchPartyLayout() {
    const navigate = useNavigate();
    const { groupId } = useParams();
    const userId = authHook.getUserIdFromToken();
    const [chatGroup, setChatGroup] = useState(null);
    const [membersGroup, setMembersGroup] = useState([]);
    const [isHost, setIsHost] = useState(false);


    useEffect(() => {
        if (!userId || !groupId) return;

        const fetchGroupData = async () => {
            try {
                // 1. Lấy info nhóm
                const groupRes = await watchChatServices.getChatGroupByGroupId(groupId);
                if (!groupRes.status || groupRes.data.isDeleted || groupRes.data.showEndTime < new Date().toISOString()) {
                    alert("Phòng không tồn tại hoặc đã bị xoá");
                    navigate("/Home");
                    return;
                }
                setChatGroup(groupRes.data);

                // 2. Lấy member chính thức
                const membersRes = await watchChatServices.getGroupMembersByGroupId(groupId, 1, 10);
                let mergedMembers = [];
                if (membersRes.status) {
                    mergedMembers = membersRes.data.map(m => ({
                        ...m,
                        status: "Accepted" // member chính thức
                    }));
                }

                // 3. Lấy các yêu cầu tham gia
                const requestsRes = await watchChatServices.getJoinRequestByGroupId(groupId);
                if (requestsRes.status && requestsRes.data.length > 0) {
                    requestsRes.data.forEach(req => {
                        // Nếu chưa có trong member chính thức mới thêm
                        if (!mergedMembers.find(m => m.userId === req.requestUserId)) {
                            mergedMembers.push({
                                userId: req.requestUserId,
                                name: req.requestUserId, // bạn có thể fetch info user nếu muốn tên đẹp
                                avatar: "",
                                isOwner: false,
                                status: req.status
                            });
                        }
                    });
                }

                // 4. Xác định host: user hiện tại là chủ phòng
                const currentUserMember = mergedMembers.find(m => m.userId === userId && m.isOwner === true);
                setIsHost(!!currentUserMember);

                // 5. Kiểm tra quyền truy cập
                const isInGroup = mergedMembers.some(m => m.userId === userId);
                if (!isInGroup) {
                    alert("Bạn không có quyền vào phòng này");
                    navigate("/Home");
                    return;
                }

                setMembersGroup(mergedMembers);

            } catch (err) {
                console.error("Lỗi lấy dữ liệu nhóm:", err);
            }
        };

        fetchGroupData();
    }, [groupId, userId, navigate]);

    return (
        <div className="WatchPartyLayout">
            {/* LEFT: Player */}
            <div className="WatchPartyLayout__player">
                <div className="PlayerBox">
                    <div className="PlayerBox__header">
                        <div className="PlayerBox__title">{chatGroup?.phimName || "Xem phim chung"}</div>
                        <div className="PlayerBox__sub">GroupId: {groupId}</div>
                    </div>
                    <div className="PlayerBox__content">
                        <div className="PlayerPlaceholder">
                            <PlayerPanel groupId={groupId} userId={userId} isHost={isHost} />
                        </div>
                    </div>
                </div>
                <RoomHeader datagroup={chatGroup} />
            </div>

            {/* RIGHT: Chat & Members */}
            <div className="WatchPartyLayout__right">
                <MembersPanel dataMembers={membersGroup} userId={userId} isOwner={isHost} />
                <div className="WatchPartyLayout__spacer" />
                <ChatPanel userId={userId} groupId={groupId} />
            </div>
        </div>
    );
}
