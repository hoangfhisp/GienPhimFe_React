import { useState, useEffect } from "react";
import "./RoomHeader.scss";
import * as watchService from "../../../../services/Watch/WatchChatService.jsx";
import { useNavigate } from "react-router-dom";


export default function RoomHeader({ datagroup }) {
  const navigate = useNavigate();
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

  const handleClose = () => {
    navigate("/Home");
    
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
        <button className="RoomHeader__btn RoomHeader__btn--danger" onClick={handleClose} >
          ⛔ Đóng phòng
        </button>
      </div>

      {/* Modal popup */}
      {showModal && (
        <div className="ModalOverlay" onClick={closeModal}>
          <div className="ModalContent" onClick={(e) => e.stopPropagation()}>
            <div className="ModalHeader">
              <h3>Yêu cầu tham gia phòng</h3>
              <button className="IconClose" onClick={closeModal}>✕</button>
            </div>

            {requests.length === 0 ? (
              <div className="EmptyState">Chưa có yêu cầu nào</div>
            ) : (
              <div className="RequestList">
                {requests.map(req => (
                  <div key={req.requestId} className="RequestCard">
                    <div className="RequestInfo">
                      <div className="RequestUser">👤 {req.requestUserId}</div>
                      <div className="RequestTime">
                        Gửi lúc: {new Date(req.requestedAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="RequestActions">
                      <button
                        className="Btn Btn--accept"
                        onClick={() => handleAccept(req.requestId)}
                      >
                        Chấp nhận
                      </button>
                      <button
                        className="Btn Btn--reject"
                        onClick={() => handleReject(req.requestId)}
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
