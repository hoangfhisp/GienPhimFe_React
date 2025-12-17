import { useEffect, useMemo, useState } from "react";
import Input from "../../FormControls/Input";
import Textarea from "../../FormControls/Textarea";

const emptyForm = { tenPlan: "", planSlug: "", moTaPlan: "" };

// slug helper (nếu bạn muốn auto)
function slugify(str = "") {
    return str
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export default function GoiThanhVienForm({
    initialValues,       // null | { planId?, tenPlan, planSlug, moTaPlan }
    onSubmit,            // (payload) => void | Promise
    onCancel,
    submitText = "Lưu",
    loading = false,
    readOnly = false,
    hideSubmit = false,
    autoSlug = true,     // tuỳ chọn: tự sinh slug từ tên
}) {
    const isCreate = !initialValues?.planId;

    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setForm({
            tenPlan: initialValues?.tenPlan || "",
            planSlug: initialValues?.planSlug || "",
            moTaPlan: initialValues?.moTaPlan || "",
        });
        setErrors({});
    }, [initialValues]);

    const setField = (key, value) => {
        if (readOnly) return;
        setForm((p) => {
            const next = { ...p, [key]: value };

            // auto slug chỉ chạy khi create + user chưa sửa slug hoặc slug đang rỗng
            if (autoSlug && isCreate && key === "tenPlan") {
                const shouldAuto = !p.planSlug?.trim();
                if (shouldAuto) next.planSlug = slugify(value);
            }
            return next;
        });
        setErrors((p) => ({ ...p, [key]: undefined }));
    };

    const validate = () => {
        if (readOnly) return true;

        const e = {};
        if (!form.tenPlan.trim()) e.tenPlan = "Vui lòng nhập tên gói";
        if (!form.planSlug.trim()) e.planSlug = "Vui lòng nhập slug";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) return;
        if (!validate()) return;

        await onSubmit?.({
            // update cần PlanId, create thì không
            ...(initialValues?.planId ? { planId: initialValues.planId } : {}),
            tenPlan: form.tenPlan.trim(),
            planSlug: form.planSlug.trim(),
            moTaPlan: form.moTaPlan?.trim() || "",
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                label="Tên gói"
                required
                value={form.tenPlan}
                onChange={(e) => setField("tenPlan", e.target.value)}
                error={errors.tenPlan}
                placeholder="Ví dụ: Premium"
                disabled={readOnly || loading}
            />

            <Input
                label="Slug"
                required
                value={form.planSlug}
                onChange={(e) => setField("planSlug", e.target.value)}
                error={errors.planSlug}
                placeholder="premium-30-days"
                disabled={readOnly || loading}
            />

            <Textarea
                label="Mô tả"
                value={form.moTaPlan}
                onChange={(e) => setField("moTaPlan", e.target.value)}
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
