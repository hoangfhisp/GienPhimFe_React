import { useState } from 'react';
import './Comment.scss';
import avatarNull from '../../../assets/img/avatar.png';
import { formatDateTime, formatURLImage } from '../../../untils/Format';
import * as managerServices from '../../../services/User/ManagerService.jsx';

function ReplyComment({ data, userId, phimId, fetchApiComment, onShowTB, onformTB }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(data.binhLuan);

    const handleUpdateReply = async (e) => {
        e.preventDefault();
        if (!editText.trim()) return;

        try {
            await managerServices.UpdateComment(data.commentId, userId, phimId, editText);
            setIsEditing(false);
            fetchApiComment();
        } catch (err) {
            console.error("Lỗi khi cập nhật phản hồi:", err);
        }
    };

    const handleDeleteReply = async () => {
        try {
            await managerServices.DeleteComment(data.commentId);
            fetchApiComment();

            const successForm = {
                type: "success",
                title: "Xóa thành công",
                message: "Bình luận đã được xóa.",
                onClose: () => onShowTB(false), // Đóng thông báo khi ấn nút
            };

            onformTB(successForm);
            onShowTB(true);
        } catch (err) {
            console.error("Lỗi khi xóa phản hồi:", err);
        }
    };

    const ThongBaoXoa = (commentId) => {
        const newForm = {
            type: "confirm",
            title: "Bạn có muốn xóa comment này",
            message: "Nếu bạn xóa thì sẽ không hoàn lại comment được, bạn có chắc chắn muốn xóa",
            btnLabel: "Xóa",
            onBTNClick: () => handleDeleteReply(commentId),
            showButton: true,
            onClose: () => onShowTB(false)
        };

        onformTB(newForm);
        onShowTB(true);
    };


    return (
        <div className="comment-item child">
            <div className="comment-header">
                <img
                    src={data.user?.avatarND ? formatURLImage(data.user.avatarND) : avatarNull}
                    alt={data.user?.nameND ? data.user.nameND : "Ẩn danh"}
                    className="comment-avatar"
                />
                <div>
                    <strong className="comment-author">{data.user?.nameND ? data.user.nameND : "Ẩn danh"}</strong>
                    <span className="comment-time">{formatDateTime(data.thoiGianTao)}</span>
                </div>
            </div>

            {isEditing ? (
                <form onSubmit={handleUpdateReply} className="reply-form">
                    <textarea
                        className="reply-input"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="reply-buttons">
                        <button type="submit" className="reply-submit">Cập nhật</button>
                        <button type="button" className="reply-cancel" onClick={() => {
                            setIsEditing(false);
                            setEditText(data.binhLuan);
                        }}>Hủy</button>
                    </div>
                </form>
            ) : (
                <p className="comment-text">{data.binhLuan}</p>
            )}

            {userId === data.user?.id && !isEditing && (
                <div className="comment-actions">
                    <button className="comment-reply-toggle TraLoi" onClick={() => setIsEditing(true)}>Sửa</button>
                    <button className="comment-reply-toggle TraLoi" onClick={ThongBaoXoa}>Xóa</button>
                </div>
            )}
        </div>
    );
}

export default ReplyComment;
