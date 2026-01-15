import React, { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import Hls from "hls.js";
import env from "../../../../config/Config";
import "./PlayerPanel.scss";

export default function PlayerPanel({
    groupId,
    isHost,
    tapList,
    currentTap,
    onSelectTap
}) {
    const videoRef = useRef(null);
    const connectionRef = useRef(null);
    const isSyncingRef = useRef(false);

    const getVideoSource = (tap) => {
        if (!tap) return null;

        // 1️⃣ Ưu tiên linkChinh
        if (tap.linkChinh && tap.linkChinh.endsWith(".m3u8")) {
            return tap.linkChinh;
        }

        // 2️⃣ linkPhu → tách param url
        if (tap.linkPhu) {
            try {
                const urlObj = new URL(tap.linkPhu);
                const realUrl = urlObj.searchParams.get("url");
                if (realUrl && realUrl.endsWith(".m3u8")) {
                    return realUrl;
                }
            } catch {
                return null;
            }
        }

        return null;
    };

    // ================= SIGNALR =================
    // useEffect(() => {
    //     const connection = new signalR.HubConnectionBuilder()
    //         .withUrl(env.SIGNALR_URL, { withCredentials: true })
    //         .withAutomaticReconnect()
    //         .build();
    //     connection.start().then(() => {
    //         connection.invoke("JoinRoom", groupId);
    //     });

    //     connection.on("ReceivePlayerEvent", (eventType, data) => {
    //         if (!videoRef.current) return;

    //         isSyncingRef.current = true;

    //         if (eventType === "play") {
    //             videoRef.current.play().catch(() => { });
    //         }

    //         if (eventType === "pause") {
    //             videoRef.current.pause();
    //         }

    //         if (eventType === "seek") {
    //             videoRef.current.currentTime = data;
    //         }

    //         if (eventType === "changeEpisode") {
    //             // 🔥 đổi tập từ DTO
    //             const fakeTap = {
    //                 tapId: data.episodeId,
    //                 soTap: data.episodeNumber,
    //                 linkChinh: data.videoUrl
    //             };

    //             onSelectTap(fakeTap);

    //             setTimeout(() => {
    //                 videoRef.current.currentTime = 0;
    //             }, 200);
    //         }

    //         setTimeout(() => (isSyncingRef.current = false), 150);
    //     });

    //     connectionRef.current = connection;
    //     return () => connection.stop();
    // }, [groupId, onSelectTap]);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(env.SIGNALR_URL, {
                withCredentials: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();

        connection.on("ReceivePlayerEvent", (eventType, data) => {
            if (!videoRef.current) return;

            isSyncingRef.current = true;

            switch (eventType) {
                case "play":
                    videoRef.current.play().catch(() => { });
                    break;

                case "pause":
                    videoRef.current.pause();
                    break;

                case "seek":
                    videoRef.current.currentTime = data;
                    break;

                case "changeEpisode":
                    const fakeTap = {
                        tapId: data.episodeId,
                        soTap: data.episodeNumber,
                        linkChinh: data.videoUrl
                    };

                    onSelectTap(fakeTap);

                    setTimeout(() => {
                        if (videoRef.current) {
                            videoRef.current.currentTime = 0;
                        }
                    }, 200);
                    break;
            }

            setTimeout(() => (isSyncingRef.current = false), 150);
        });

        connection.start()
            .then(() => connection.invoke("JoinRoom", groupId))
            .catch(err => console.error("SignalR start error:", err));

        connectionRef.current = connection;

        return () => {
            connection.off("ReceivePlayerEvent");
            connection.stop();
        };
    }, [groupId, onSelectTap]);


    // ================= VIDEO LOAD =================
    useEffect(() => {
        if (!videoRef.current) return;
        if (!currentTap) return;

        const src = getVideoSource(currentTap);
        if (!src) {
            console.warn("Không tìm được link video hợp lệ");
            return;
        }

        let hls;

        if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(videoRef.current);
        } else {
            videoRef.current.src = src;
        }

        return () => {
            if (hls) hls.destroy();
        };
    }, [currentTap]);
    // ================= PLAYER EVENTS =================
    const sendEvent = (type) => {
        if (isSyncingRef.current) return;
        connectionRef.current?.invoke(
            "SendPlayerEvent",
            groupId,
            type,
            videoRef.current.currentTime
        );
    };

    const handleChangeTap = (tap) => {
        if (!isHost) return;

        const src = getVideoSource(tap);
        if (!src) return;

        const dto = {
            episodeId: tap.tapId,
            episodeNumber: tap.soTap,
            videoUrl: src
        };

        onSelectTap(tap);

        connectionRef.current?.invoke(
            "ChangeEpisode",
            groupId,
            dto
        );
    };

    return (
        <div className="PlayerPanel">
            <video
                ref={videoRef}
                controls={isHost}
                width="100%"
                onPlay={() => sendEvent("play")}
                onPause={() => sendEvent("pause")}
                onSeeked={() => sendEvent("seek")}
            />

            {/* DANH SÁCH TẬP */}
            <div className="EpisodeList">
                {tapList.map(tap => (
                    <button
                        key={tap.tapId}
                        className={currentTap?.tapId === tap.tapId ? "active" : ""}
                        onClick={() => handleChangeTap(tap)}
                        disabled={!isHost}
                    >
                        {tap.tenTap}
                    </button>
                ))}
            </div>
        </div>
    );
}
