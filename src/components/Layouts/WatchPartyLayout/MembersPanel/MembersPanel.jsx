import { useEffect, useState } from "react";
import "./MembersPanel.scss";
import * as authService from '../../../../services/Admin/AuthenticationService.jsx'
import { useNavigate } from "react-router-dom";
import { formatURLImage } from "../../../../untils/Format.jsx";
import * as watchChatServices from '../../../../services/Watch/WatchChatService.jsx';


export default function MembersPanel({ dataMembers, userId, isOwner }) {
    const [members, setMembers] = useState([]);
    const navigate = useNavigate();

    const currentUserId = userId; // user hiện tại

    const fetchUserInfo = async (userId) => {
        try {
            const res = await authService.getUserById([userId]);
            const userData = res.data;

            if (!userData) return { userId, name: "Unknown", avatar: "" };

            const arr = Array.isArray(userData[0]) ? userData[0] : userData;

            return {
                userId: arr.userId,
                name: arr.email || "Unknown", // fullName
                avatar: formatURLImage(arr.avatarND) || ""
            };
        } catch (err) {
            console.error("Fetch user info error:", err);
            return { userId, name: "Unknown", avatar: "" };
        }
    };

    useEffect(() => {
        if (!dataMembers || dataMembers.length === 0) return;

        // Kiểm tra user hiện tại có trong group không
        const isInGroup = dataMembers.some(m => m.userId === currentUserId);
        if (!isInGroup) {
            alert("Bạn không có quyền vào phòng này");
            navigate("/Home"); // điều hướng về Home
            return;
        }

        const fetchAllMembers = async () => {
            const updatedMembers = await Promise.all(
                dataMembers.map(async (m) => {
                    const userInfo = await fetchUserInfo(m.userId);
                    return {
                        ...m,
                        name: userInfo.name,
                        avatar: userInfo.avatar,
                    };
                })
            );
            setMembers(updatedMembers);
        };

        fetchAllMembers();
    }, [dataMembers]);

    const handleKick = async (member) => {
        if (!window.confirm(`Bạn có chắc chắn muốn đá ${member.name} ra khỏi phòng không?`)) return;
        try {
            // Gọi API tạm thời
            const res = await watchChatServices.getJoinRequestByGroupId(dataMembers[0]?.groupId, "Accepted", 1, 10);
            await watchChatServices.RejectJoinRequest(res.data.find(r => r.requestUserId === member.userId).requestId);
            // Cập nhật UI: loại bỏ member
            setMembers(prev => prev.filter(m => m.userId !== member.userId));
        } catch (err) {
            console.error("Kick lỗi:", err);
        }
    };

    return (
        <div className="MembersPanel">
            <div className="MembersPanel__header">
                <div className="MembersPanel__title">Thành viên</div>
                <div className="MembersPanel__count">{members.length}</div>
            </div>

            <div className="MembersPanel__list">
                {members.length > 0 ? (
                    members.map((m, idx) => (
                        <div key={m.userId || idx} className="MemberRow">
                            <div key={m.userId} className="MemberRow">
                                <div className="MemberRow__info">
                                    <div className="MemberRow__name">
                                        {m.name} {m.isOwner ? <span className="Badge Badge--owner">👑 Owner</span> : null}
                                    </div>
                                    <div className="MemberRow__meta">
                                        {m.status === "Accepted" ? "✔ Đã vào phòng" : m.status === "Pending" ? "⏳ Đang chờ" : "❌ Bị từ chối"}
                                        • {m.canControlFilm ? "🎬 Control" : "👀 View"}
                                    </div>
                                </div>

                                {/* Actions: only owner can see/manage others (mock) */}
                                {isOwner && !m.isOwner && (
                                    <div className="MemberRow__actions">
                                        <button className="MiniBtn" onClick={() => handleKick(m)}>Kick</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>Không có thành viên</div>
                )}
            </div>
        </div>
    );
}
