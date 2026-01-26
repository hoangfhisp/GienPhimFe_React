import { useEffect, useState } from "react";
import Input from "../../../FormControls/Input";
import "./PlanOptionForm.scss";

const emptyForm = { planId: "", thoiGianSuDung: "", giaOption: "" };

export default function PlanOptionForm({
    initialValues,
    planId,
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) return;

        await onSubmit?.({
            ...(initialValues?.optionId ? { optionId: initialValues.optionId } : {}),
            planId: form.planId,
            thoiGianSuDung: Number(form.thoiGianSuDung),
            giaOption: Number(form.giaOption),
        });
    };

    return (
        <form className="PlanOptionForm" onSubmit={handleSubmit}>
            <div className="PlanOptionForm__fields">
                <Input
                    label="PlanId"
                    required
                    value={form.planId}
                    disabled
                />

                <Input
                    label="Thời gian sử dụng (ngày)"
                    type="number"
                    value={form.thoiGianSuDung}
                    onChange={(e) => setField("thoiGianSuDung", e.target.value)}
                    error={errors.thoiGianSuDung}
                    placeholder="Ví dụ: 30"
                    disabled={readOnly || loading}
                />

                <Input
                    label="Giá option"
                    type="number"
                    value={form.giaOption}
                    onChange={(e) => setField("giaOption", e.target.value)}
                    error={errors.giaOption}
                    placeholder="Ví dụ: 99000"
                    disabled={readOnly || loading}
                />
            </div>

            <div className="PlanOptionForm__actions">
                <button
                    type="button"
                    className="Btn Btn--ghost"
                    onClick={onCancel}
                    disabled={loading}
                >
                    {readOnly ? "Đóng" : "Huỷ"}
                </button>

                {!hideSubmit && (
                    <button
                        type="submit"
                        className="Btn Btn--primary"
                        disabled={loading || readOnly}
                    >
                        {loading ? "Đang lưu..." : submitText}
                    </button>
                )}
            </div>
        </form>
    );
}
