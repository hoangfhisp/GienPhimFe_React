import { useEffect, useState } from "react";
import Input from "../../FormControls/Input";
import Textarea from "../../FormControls/Textarea";

const emptyForm = { tenQG: "", moTaQG: "" };

export default function QuocGiaForm({
    initialValues,       // null | { tenQG, moTaQG }
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
            tenQG: initialValues?.tenQG || "",
            moTaQG: initialValues?.moTaQG || "",
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
        if (!form.tenQG.trim()) e.tenQG = "Vui lòng nhập tên quốc gia";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (readOnly) return;

        if (!validate()) return;

        await onSubmit?.({
            tenQG: form.tenQG.trim(),
            moTaQG: form.moTaQG?.trim() || "",
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                label="Tên quốc gia"
                required
                value={form.tenQG}
                onChange={(e) => setField("tenQG", e.target.value)}
                error={errors.tenQG}
                placeholder="Ví dụ: Việt Nam"
                disabled={readOnly || loading}
            />

            <Textarea
                label="Mô tả"
                value={form.moTaQG}
                onChange={(e) => setField("moTaQG", e.target.value)}
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