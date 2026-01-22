import { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import * as authService from "../../../../services/Admin/AuthenticationService.jsx";
import env from "../../../../config/Config";
import "./ChatPanel.scss";
import { set } from "lodash";

export default function ChatPanel({ userId, groupId }) {
    const [messages, setMessages] = useState([]);
    const inputRef = useRef();
    const [usersById, setUsersById] = useState({});
    const connectionRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Scroll xuống cuối khi có tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // useEffect(() => {
    //     const connection = new signalR.HubConnectionBuilder()
    //         .withUrl(env.SIGNALR_URL)
    //         .withAutomaticReconnect()
    //         .build();

    //     connection.start()
    //         .then(() => {
    //             console.log("SignalR connected");
    //             return connection.invoke("JoinRoom", groupId);
    //         })
    //         .catch(err => console.error("SignalR connection error:", err));

    //     connection.on("ReceiveMessage", (msg) => {
    //         setMessages(prev => [...prev, msg]);
    //         fetchUserId(msg.userId);
    //     });

    //     connectionRef.current = connection;

    //     return () => {
    //         if (connectionRef.current) connectionRef.current.stop();
    //     };
    // }, [groupId]);
    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(env.SIGNALR_URL, {
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();

        // 🔹 đăng ký event TRƯỚC start
        connection.on("ReceiveMessage", (msg) => {
            setMessages(prev => [...prev, msg]);
            fetchUserId(msg.userId);
        });

        connection.start()
            .then(() => {
                console.log("SignalR connected");
                return connection.invoke("JoinRoom", groupId);
            })
            .catch(err => console.error("SignalR connection error:", err));

        connectionRef.current = connection;

        return () => {
            connection.off("ReceiveMessage");
            connection.stop();
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

    const fetchUserId = async (userId) => {
        if (usersById[userId]) return;

        const result = await authService.getUserById(userId);

        setUsersById(prev => ({
            ...prev,
            [userId]: result.data
        }));
    };
    return (
        <div className="ChatPanel">
            <div className="ChatPanel__messages">
                {messages.map((m, idx) => (
                    <div key={idx} className="ChatMessage">
                        <strong>
                            {m.userId === userId
                                ? "Bạn"
                                : usersById[m.userId]?.email || "Đang tải..."}
                            :
                        </strong>
                        {m.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="ChatPanel__input">
                <input
                    ref={inputRef}
                    placeholder="Nhập tin nhắn..."
                    onKeyPress={handleKeyPress}
                />
                <button onClick={sendMessage}>Gửi</button>
            </div>
        </div>
    );
}
