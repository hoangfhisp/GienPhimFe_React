import { useEffect, useState } from "react";
import Input from "../../FormControls/Input";
import Textarea from "../../FormControls/Textarea";

const emptyForm = { tenDD: "", moTaDD: "" };

export default function DaoDienForm({
    initialValues,       // null | { tenDD, moTaDD }
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
            tenDD: initialValues?.tenDD || "",
            moTaDD: initialValues?.moTaDD || "",
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
        if (!form.tenDD.trim()) e.tenDD = "Vui lòng nhập tên đạo diễn";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (readOnly) return;
        if (!validate()) return;

        await onSubmit?.({
            tenDD: form.tenDD.trim(),
            moTaDD: form.moTaDD?.trim() || "",
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                label="Tên đạo diễn"
                required
                value={form.tenDD}
                onChange={(e) => setField("tenDD", e.target.value)}
                error={errors.tenDD}
                placeholder="Ví dụ: Christopher Nolan"
                disabled={readOnly || loading}
            />

            <Textarea
                label="Mô tả"
                value={form.moTaDD}
                onChange={(e) => setField("moTaDD", e.target.value)}
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
