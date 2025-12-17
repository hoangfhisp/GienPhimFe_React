import { useEffect, useState } from 'react';
import './Comment.scss';

import ReplyComment from './ReplyComment';
import * as managerServices from '../../../services/User/ManagerService.jsx'
import { formatDateTime, formatURLImage } from '../../../untils/Format.jsx';
import avatarNull from '../../../assets/img/avatar.png'

function Comment({ phimId, userId, roleUser, onShowTB, onformTB }) {
    const [showRepliesMap, setShowRepliesMap] = useState({});
    const [dataComment, setDataComment] = useState([]);
    const [newComment, setNewComment] = useState([]);
    const [replyingToCommentId, setReplyingToCommentId] = useState(null); // trạng thái đang trả lời
    const [replyText, setReplyText] = useState('');
    const [page, setPage] = useState(1);
    const [pagi, setPagi] = useState(1);


    // Sửa Bình luận
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState('');
    useEffect(() => {
        if (!phimId)
            return;

        fetchApiComment();

    }, [phimId, roleUser, userId])

    //Gọi api lấy comment
    const fetchApiComment = async (pageNumber = 1) => {
        const res = await managerServices.GetCommentByPhim(phimId, pageNumber, 5);
        setDataComment(res.data || []);
        setPage(pageNumber);
        setNewComment("");
        setPagi(res.pagination);
    }

    // ẩn hiện comment con
    const toggleReplies = (commentId) => {
        setShowRepliesMap(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    // Submit comment
    const handleSubmitComment = async (e) => {
        e.preventDefault(); // không relaod lại trang khi ấn nút submit
        if (!newComment.trim()) return;

        try {
            await managerServices.AddComment(userId, phimId, newComment);
            setNewComment('');
            fetchApiComment();
        } catch (error) {
            console.error("Lỗi khi gửi bình luận:", error);
        }
    };

    // submit rep commnet
    const handleSubmitReply = async (e, parentId) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        try {
            await managerServices.AddReplyComment(phimId, userId, parentId, replyText); // Gửi comment trả lời
            setReplyText('');
            setReplyingToCommentId(null);
            fetchApiComment(); // Refresh danh sách comment
        } catch (error) {
            console.error("Lỗi khi gửi phản hồi:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await managerServices.DeleteComment(commentId);
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
            console.error("Lỗi khi xóa bình luận:", err);
        }
    };

    const ThongBaoXoa = (commentId) => {
        const newForm = {
            type: "confirm",
            title: "Bạn có muốn xóa comment này",
            message: "Nếu bạn xóa thì sẽ không hoàn lại comment được, bạn có chắc chắn muốn xóa",
            btnLabel: "Xóa",
            onBTNClick: () => handleDeleteComment(commentId),
            showButton: true,
            onClose: () => onShowTB(false)
        };

        onformTB(newForm);
        onShowTB(true);
    };

    const handleUpdateComment = async (e, commentId) => {
        e.preventDefault();
        if (!editText.trim()) return;

        try {
            await managerServices.UpdateComment(commentId, userId, phimId, editText);
            setEditingCommentId(null);
            setEditText('');
            fetchApiComment();
        } catch (err) {
            console.error("Lỗi khi cập nhật bình luận:", err);
        }
    };


    //Xem thêm comment
    const handleLoadMore = () => {
        fetchApiComment(page + 1);
    };

    const handleLoadPrevious = () => {
        if (page > 1) {
            // Reset lại danh sách để tải lại các comment từ trang trước
            fetchApiComment(page - 1);
        }
    };

    return (
        <div className="comment-section">
            <h2 className="comment-title">Bình luận</h2>

            <form className="comment-form" onSubmit={handleSubmitComment}>
                <textarea className="comment-input" placeholder="Viết bình luận của bạn..." value={newComment} onChange={(e) => setNewComment(e.target.value)}></textarea>
                <button type="submit" className="comment-button">Gửi bình luận</button>
            </form>

            <div className="comment-list">

                {(dataComment === null || dataComment.length === 0) ? (
                    <p className="no-comment">Không có bình luận nào.</p>
                ) : (
                    dataComment.map((res) => (
                        <div key={res.commentId} className="comment-item">
                            <div className="comment-header">
                                <img src={res.user?.avatarND ? formatURLImage(res.user.avatarND) : avatarNull} alt={res.user?.nameND ? res.user?.nameND : "Ẩn Danh"} className="comment-avatar" />
                                <div>
                                    <strong className={`comment-author ${(res.user?.id === userId) ? "me" : ""}`}>{res.user?.nameND ? res.user.nameND : "Ẩn Danh"} {(res.user?.id === userId) ? "( Bạn )" : ""}</strong>
                                    <span className="comment-time">{formatDateTime(res.thoiGianTao)}</span>
                                </div>
                            </div>
                            <p className="comment-text">{res.binhLuan}</p>
                            {editingCommentId === res.commentId && (
                                <form onSubmit={(e) => handleUpdateComment(e, res.commentId)} className="reply-form">
                                    <textarea
                                        className="reply-input"
                                        placeholder="Chỉnh sửa bình luận..."
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                    />
                                    <div className="reply-buttons">
                                        <button type="submit" className="reply-submit">Cập nhật</button>
                                        <button type="button" className="reply-cancel" onClick={() => {
                                            setEditingCommentId(null);
                                            setEditText('');
                                        }}>
                                            Hủy
                                        </button>
                                    </div>
                                </form>
                            )}
                            {replyingToCommentId === res.commentId ? (
                                <form onSubmit={(e) => handleSubmitReply(e, res.commentId)} className="reply-form">
                                    <textarea
                                        className="reply-input"
                                        placeholder="Viết phản hồi của bạn..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                    />
                                    <div className="reply-buttons">
                                        <button type="submit" className="reply-submit">Gửi</button>
                                        <button type="button" className="reply-cancel" onClick={() => { setReplyingToCommentId(null); setReplyText(''); }}>
                                            Hủy
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                editingCommentId !== res.commentId && (
                                    <div className="comment-actions">
                                        <button className="comment-reply-toggle TraLoi" onClick={() => setReplyingToCommentId(res.commentId)}>
                                            Trả lời
                                        </button>

                                        {userId === res.user?.id && (
                                            <>
                                                <button
                                                    className="comment-reply-toggle TraLoi"
                                                    onClick={() => {
                                                        setEditingCommentId(res.commentId);
                                                        setEditText(res.binhLuan);
                                                    }}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    className="comment-reply-toggle TraLoi"
                                                    onClick={() => ThongBaoXoa(res.commentId)}
                                                >
                                                    Xóa
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )
                            )}

                            {Array.isArray(res.replies) && res.replies.length > 0 && (
                                !showRepliesMap[res.commentId] ? (
                                    <button className="comment-reply-toggle" onClick={() => toggleReplies(res.commentId)}>
                                        Có {res.replies.length} bình luận &darr;
                                    </button>
                                ) : (
                                    <div className="comment-reply">
                                        {res.replies.map((resr) => (
                                            <ReplyComment key={resr.commentId} phimId={phimId} data={resr} userId={userId} onformTB={onformTB} onShowTB={onShowTB} fetchApiComment={fetchApiComment} />
                                        ))}
                                        <button className="comment-reply-toggle" onClick={() => toggleReplies(res.commentId)}>
                                            Ẩn bình luận &uarr;
                                        </button>

                                    </div>
                                )
                            )}

                        </div>
                    ))
                )}

            </div>

            <div className="comment-pagination">
                {page > 1 && (
                    <button className="comment-loadmore" onClick={handleLoadPrevious}>
                        Xem bình luận trước
                    </button>
                )}

                {((dataComment.length === 5 && page < pagi.last) &&
                    <button className="comment-loadmore" onClick={handleLoadMore}>
                        Xem thêm bình luận
                    </button>
                )}
            </div>
        </div>
    );
}

export default Comment;
