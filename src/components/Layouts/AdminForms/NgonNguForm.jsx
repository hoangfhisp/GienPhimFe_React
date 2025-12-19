import { useEffect, useState } from "react";
import Input from "../../FormControls/Input";
import Textarea from "../../FormControls/Textarea";

const emptyForm = { tenNN: "", moTaNN: "" };

export default function NgonNguForm({
    initialValues,       // null | { tenNN, moTaNN }
    onSubmit,
    onCancel,
    submitText = "Lưu",
    loading = false,
    readOnly = false,
    hideSubmit = false,
}) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setForm({
            tenNN: initialValues?.tenNN || "",
            moTaNN: initialValues?.moTaNN || "",
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
        if (!form.tenNN.trim()) e.tenNN = "Vui lòng nhập tên ngôn ngữ";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) return;
        if (!validate()) return;

        await onSubmit?.({
            tenNN: form.tenNN.trim(),
            moTaNN: form.moTaNN?.trim() || "",
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                label="Tên ngôn ngữ"
                required
                value={form.tenNN}
                onChange={(e) => setField("tenNN", e.target.value)}
                error={errors.tenNN}
                placeholder="Ví dụ: Tiếng Việt"
                disabled={readOnly || loading}
            />

            <Textarea
                label="Mô tả"
                value={form.moTaNN}
                onChange={(e) => setField("moTaNN", e.target.value)}
                placeholder="Mô tả ngắn..."
                rows={4}
                disabled={readOnly || loading}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
                <button type="button" className="Btn Btn--ghost" onClick={onCancel} disabled={loading}>
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
