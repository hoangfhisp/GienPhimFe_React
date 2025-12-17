import { useEffect, useState } from "react";
import Input from "../../FormControls/Input";
import Textarea from "../../FormControls/Textarea";

const emptyForm = { tenT: "", moTaT: "" };

export default function TheTagForm({
    initialValues,       // null | { tenT, moTaT }
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
            tenT: initialValues?.tenT || "",
            moTaT: initialValues?.moTaT || "",
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
        if (!form.tenT.trim()) e.tenT = "Vui lòng nhập tên thẻ tag";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (readOnly) return;
        if (!validate()) return;

        await onSubmit?.({
            tenT: form.tenT.trim(),
            moTaT: form.moTaT?.trim() || "",
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                label="Tên thẻ tag"
                required
                value={form.tenT}
                onChange={(e) => setField("tenT", e.target.value)}
                error={errors.tenT}
                placeholder="Ví dụ: hot, trending, classic..."
                disabled={readOnly || loading}
            />

            <Textarea
                label="Mô tả"
                value={form.moTaT}
                onChange={(e) => setField("moTaT", e.target.value)}
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
