import React, { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import Hls from "hls.js";
import env from "../../../../config/Config";

export default function PlayerPanel({ groupId, userId, videoUrl, isHost }) {
    const videoRef = useRef();
    const isSyncingRef = useRef(false); // flag để tránh vòng lặp play/pause
    const connectionRef = useRef(null);

    // fallback test video nếu prop không có
    const testVideoUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
    const src = videoUrl || testVideoUrl;

    // SignalR connection
    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(env.SIGNALR_URL) // URL backend
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => {
                console.log("SignalR connected");
                return connection.invoke("JoinRoom", groupId);
            })
            .catch(err => console.error("SignalR connection error:", err));

        // Receive events from server

        connection.on("ReceivePlayerEvent", (eventType, currentTime) => {
            if (!videoRef.current) return;

            isSyncingRef.current = true; // bắt đầu đồng bộ

            // Luôn set currentTime
            videoRef.current.currentTime = currentTime;

            if (eventType === "play" && videoRef.current.paused) {
                videoRef.current.play().catch(err => console.warn(err));
            }

            if (eventType === "pause" && !videoRef.current.paused) {
                videoRef.current.pause();
            }

            setTimeout(() => {
                isSyncingRef.current = false; // xong đồng bộ
            }, 50);
        });

        connectionRef.current = connection;

        return () => {
            if (connectionRef.current) connectionRef.current.stop();
        };
    }, [groupId]);

    // HLS setup
    useEffect(() => {
        if (!videoRef.current) return;
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
    }, [src]);

    // Event handlers
    const handlePlay = () => {
        if (isSyncingRef.current) return;
        if (connectionRef.current?.state === "Connected") {
            connectionRef.current.invoke("SendPlayerEvent", groupId, "play", videoRef.current.currentTime);
        }
    };
    const handlePause = () => {
        if (isSyncingRef.current) return;
        if (connectionRef.current?.state === "Connected") {
            connectionRef.current.invoke("SendPlayerEvent", groupId, "pause", videoRef.current.currentTime);
        }
    };
    const handleSeek = () => {
        if (isSyncingRef.current) return;
        if (connectionRef.current?.state === "Connected") {
            connectionRef.current.invoke("SendPlayerEvent", groupId, "seek", videoRef.current.currentTime);
        }
    };
    // Fullscreen
    const handleFullScreen = () => {
        if (!videoRef.current) return;
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            videoRef.current.requestFullscreen().catch(err => console.warn(err));
        }
    };
    return (
        <div>
            <video
                ref={videoRef}
                controls={isHost}
                width="100%"
                onPlay={handlePlay}
                onPause={handlePause}
                onSeeked={handleSeek}
            />
            <button onClick={handleFullScreen} style={{ marginTop: 5 }}>
                {document.fullscreenElement ? "Thu nhỏ" : "Phóng to"}
            </button>
        </div>
    );
}
