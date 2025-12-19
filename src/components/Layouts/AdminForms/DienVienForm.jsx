import { useEffect, useState } from "react";
import Input from "../../FormControls/Input";
import Textarea from "../../FormControls/Textarea";

const emptyForm = { tenDV: "", moTaDV: "" };

export default function DienVienForm({
    initialValues,       // null | { tenDV, moTaDV }
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
            tenDV: initialValues?.tenDV || "",
            moTaDV: initialValues?.moTaDV || "",
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
        if (!form.tenDV.trim()) e.tenDV = "Vui lòng nhập tên diễn viên";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (readOnly) return;
        if (!validate()) return;

        await onSubmit?.({
            tenDV: form.tenDV.trim(),
            moTaDV: form.moTaDV?.trim() || "",
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                label="Tên diễn viên"
                required
                value={form.tenDV}
                onChange={(e) => setField("tenDV", e.target.value)}
                error={errors.tenDV}
                placeholder="Ví dụ: Leonardo DiCaprio"
                disabled={readOnly || loading}
            />

            <Textarea
                label="Mô tả"
                value={form.moTaDV}
                onChange={(e) => setField("moTaDV", e.target.value)}
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
