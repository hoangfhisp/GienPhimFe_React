import { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import env from "../../../../config/Config";

export default function ChatPanel({ userId, groupId }) {
    const [messages, setMessages] = useState([]);
    const inputRef = useRef();
    const connectionRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Scroll xuống cuối khi có tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(env.SIGNALR_URL)
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => {
                console.log("SignalR connected");
                return connection.invoke("JoinRoom", groupId);
            })
            .catch(err => console.error("SignalR connection error:", err));

        connection.on("ReceiveMessage", (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        connectionRef.current = connection;

        return () => {
            if (connectionRef.current) connectionRef.current.stop();
        };
    }, [groupId]);

    const sendMessage = () => {
        if (!inputRef.current.value || !connectionRef.current) return;
        connectionRef.current.invoke("SendMessage", groupId, userId, inputRef.current.value)
            .catch(err => console.error(err));
        inputRef.current.value = "";
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
                {messages.map((m, idx) => (
                    <div key={idx}>
                        <b>{m.userId}:</b> {m.text} <span style={{ fontSize: '0.8em', color: '#666' }}>{new Date(m.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div style={{ display: "flex", marginTop: 4 }}>
                <input
                    ref={inputRef}
                    placeholder="Nhập tin nhắn..."
                    onKeyPress={handleKeyPress}
                    style={{ flex: 1, padding: 6 }}
                />
                <button onClick={sendMessage} style={{ marginLeft: 4 }}>Gửi</button>
            </div>
        </div>
    );
}
