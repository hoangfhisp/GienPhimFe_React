import { useState, useEffect } from "react";
import "./RoomHeader.scss";
import * as watchService from "../../../../services/Watch/WatchChatService.jsx";

export default function RoomHeader({ datagroup }) {
  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await watchService.getJoinRequestByGroupId(datagroup?.groupId, "Pending", 1, 10);
      if (res.status) {
        setRequests(res.data);
        setShowModal(true);
      }
    } catch (err) {
      console.error("Lỗi lấy yêu cầu tham gia:", err);
    }
  };

  const handleAccept = async (requestId) => {
    const res = await watchService.AcceptJoinRequest(requestId);
    if (res.status) {
        setShowModal(false);
        alert("Đã chấp nhận yêu cầu tham gia");
        
    }
  };

  const handleReject = async (requestId) => {
    const res = await watchService.RejectJoinRequest(requestId);
    if (res.status) {
        setShowModal(false);
        alert("Đã từ chối yêu cầu tham gia");
        
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="RoomHeader">
      <div className="RoomHeader__left">
        <div className="RoomHeader__title">
          {datagroup?.phimName || "Phòng xem phim chung"}
        </div>
        <div className="RoomHeader__subtitle">Phòng xem phim (mock)</div>
      </div>

      <div className="RoomHeader__right">
        <button className="RoomHeader__btn" onClick={fetchRequests}>
          🔗 Mời
        </button>
        <button className="RoomHeader__btn RoomHeader__btn--danger">
          ⛔ Đóng phòng
        </button>
      </div>

      {/* Modal popup */}
      {showModal && (
        <div className="ModalOverlay" onClick={closeModal}>
          <div className="ModalContent" onClick={(e) => e.stopPropagation()}>
            <h3>Danh sách yêu cầu tham gia</h3>
            {requests.length === 0 && <p>Chưa có yêu cầu nào</p>}
            <div className="RequestList">
              {requests.map((req) => (
                <div key={req.requestId} className="RequestRow">
                  <div><strong>User ID:</strong> {req.requestUserId}</div>
                  <div><strong>Trạng thái:</strong> {req.status}</div>
                  <div>
                    <strong>Thời gian yêu cầu:</strong>{" "}
                    {new Date(req.requestedAt).toLocaleString()}
                  </div>
                  <div>
                    <strong>Thời gian xử lý:</strong>{" "}
                    {req.processedAt
                      ? new Date(req.processedAt).toLocaleString()
                      : "Chưa xử lý"}
                  </div>
                  <div className="RequestActions">
                    <button className="AcceptBtn" onClick={() => handleAccept(req.requestId)}>✔ Chấp nhận</button>
                    <button className="RejectBtn" onClick={() => handleReject(req.requestId)}>✖ Bỏ qua</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="CloseBtn" onClick={closeModal}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}
