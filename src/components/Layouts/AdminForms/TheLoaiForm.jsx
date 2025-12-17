import { useEffect, useState } from "react";
import Input from "../../FormControls/Input";
import Textarea from "../../FormControls/Textarea";

const emptyForm = { tenTL: "", moTa: "" };

export default function TheLoaiForm({
    initialValues,       // null | { tenTL, moTa }
    onSubmit,            // (payload) => void | Promise
    onCancel,            // () => void
    submitText = "Lưu",
    loading = false,
    readOnly = false,
    hideSubmit = false,
}) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setForm({
            tenTL: initialValues?.tenTL || "",
            moTa: initialValues?.moTa || "",
        });
        setErrors({});
    }, [initialValues]);

    const setField = (key, value) => {
        if (readOnly) return;

        setForm((p) => ({ ...p, [key]: value }));
        setErrors((p) => ({ ...p, [key]: undefined }));
    };

    const validate = () => {
        if (readOnly) return true;

        const e = {};
        if (!form.tenTL.trim()) e.tenTL = "Vui lòng nhập tên thể loại";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (readOnly) return;
        if (!validate()) return;

        await onSubmit?.({
            tenTL: form.tenTL.trim(),
            moTa: form.moTa?.trim() || "",
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                label="Tên thể loại"
                required
                value={form.tenTL}
                onChange={(e) => setField("tenTL", e.target.value)}
                error={errors.tenTL}
                placeholder="Ví dụ: Hành động"
                disabled={readOnly || loading}
            />

            <Textarea
                label="Mô tả"
                value={form.moTa}
                onChange={(e) => setField("moTa", e.target.value)}
                placeholder="Mô tả ngắn..."
                rows={4}
                disabled={readOnly || loading}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
                <button
                    type="button"
                    className="Btn Btn--ghost"
                    onClick={onCancel}
                    disabled={loading}
                >
                    {readOnly ? "Đóng" : "Huỷ"}
                </button>

                {!hideSubmit && (
                    <button type="submit" className="Btn Btn--primary" disabled={loading || readOnly}>
                        {loading ? "Đang lưu..." : submitText}
                    </button>
                )}
            </div>
        </form>
    );
}
