import { useState } from "react";
import * as movieService from "../../../../services/Admin/MovieService";
import "./AddPhimApiForm.scss";
export default function AddPhimApiForm({ onSuccess }) {
    const [slug, setSlug] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleAdd = async () => {
        if (!slug.trim()) {
            setMessage("Vui lòng nhập slug phim");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const res = await movieService.addMovieFromAPI(slug.trim());

            if (res?.status) {
                setMessage(res.msg || "Thêm phim thành công");
                onSuccess?.();
            } else {
                setMessage(res?.msg || "Thêm phim thất bại");
            }
        } catch (err) {
            console.error(err);
            setMessage("Lỗi khi gọi API");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ApiAddForm">
            <label>Slug Phim (API)</label>
            <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="vd: one-piece"
            />

            <button
                className="Btn Btn--primary"
                onClick={handleAdd}
                disabled={loading}
            >
                {loading ? "Đang thêm..." : "Thêm phim"}
            </button>

            {message && <p style={{ marginTop: 8 }}>{message}</p>}
        </div>
    );
}
