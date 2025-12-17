import { useEffect, useState } from "react";
import Input from "../../FormControls/Input";

const emptyForm = { planId: "", thoiGianSuDung: "", giaOption: "" };

export default function PlanOptionForm({
    initialValues,   // null | { optionId?, planId, thoiGianSuDung, giaOption }
    planId,          // string (bắt buộc khi create từ Plan)
    onSubmit,
    onCancel,
    submitText = "Lưu",
    loading = false,
    readOnly = false,
    hideSubmit = false,
}) {
    const isCreate = !initialValues?.optionId;

    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setForm({
            planId: initialValues?.planId || planId || "",
            thoiGianSuDung: initialValues?.thoiGianSuDung ?? "",
            giaOption: initialValues?.giaOption ?? "",
        });
        setErrors({});
    }, [initialValues, planId]);

    const setField = (key, value) => {
        if (readOnly) return;
        setForm((p) => ({ ...p, [key]: value }));
        setErrors((p) => ({ ...p, [key]: undefined }));
    };

    const validate = () => {
        if (readOnly) return true;

        const e = {};
        if (!form.planId) e.planId = "Thiếu PlanId";
        if (String(form.thoiGianSuDung).trim() === "") e.thoiGianSuDung = "Nhập thời gian sử dụng";
        if (String(form.giaOption).trim() === "") e.giaOption = "Nhập giá";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) return;
        if (!validate()) return;

        await onSubmit?.({
            ...(initialValues?.optionId ? { optionId: initialValues.optionId } : {}),
            planId: form.planId,
            thoiGianSuDung: Number(form.thoiGianSuDung),
            giaOption: Number(form.giaOption),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                label="PlanId"
                required
                value={form.planId}
                onChange={(e) => setField("planId", e.target.value)}
                error={errors.planId}
                disabled // thường không cho sửa, vì option thuộc plan nào
            />

            <Input
                label="Thời gian sử dụng (ngày)"
                required
                type="number"
                value={form.thoiGianSuDung}
                onChange={(e) => setField("thoiGianSuDung", e.target.value)}
                error={errors.thoiGianSuDung}
                placeholder="Ví dụ: 30"
                disabled={readOnly || loading}
            />

            <Input
                label="Giá option"
                required
                type="number"
                value={form.giaOption}
                onChange={(e) => setField("giaOption", e.target.value)}
                error={errors.giaOption}
                placeholder="Ví dụ: 99000"
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
