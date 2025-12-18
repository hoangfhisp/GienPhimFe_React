import React from "react";
import { useParams } from "react-router-dom";
import "./WatchPartyLayout.scss";
import RoomHeader from "./RoomHeader/RoomHeader";
import PlayerPanel from "./PlayerPanel/PlayerPanel";
import ChatPanel from "./ChatPanel/ChatPanel";
import MembersPanel from "./MembersPanel/MembersPanel";

export default function WatchPartyLayout() {
    const { groupId } = useParams();

    return (
        <div className="WatchPartyLayout">
            {/* LEFT: Player */}
            <div className="WatchPartyLayout__player">
                <div className="PlayerBox">
                    <div className="PlayerBox__header">
                        <div className="PlayerBox__title">Xem phim chung</div>
                        <div className="PlayerBox__sub">GroupId: {groupId}</div>
                    </div>

                    {/* Tạm để placeholder. Sau này bạn nhét player thật */}
                    <div className="PlayerBox__content">
                        <div className="PlayerPlaceholder">
                            Video Player (placeholder)
                        </div>
                    </div>
                </div>
                <RoomHeader />
            </div>

            {/* RIGHT: Chat */}
            <div className="WatchPartyLayout__right">
                <MembersPanel />

                <div className="WatchPartyLayout__spacer" />

                <ChatPanel />
            </div>
        </div>
    );
}