import { useEffect, useState } from "react";
import Input from "../../FormControls/Input";

const emptyForm = {
    isEnabled: false,
    apiPerRun: "",
    intervalHours: "",
};

export default function BotConfigForm({
    initialValues,      // null | { isEnabled, apiPerRun, intervalHours }
    onSubmit,           // (payload) => void | Promise
    onCancel,           // () => void
    submitText = "Lưu",
    loading = false,
    readOnly = false,
    hideSubmit = false,
}) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setForm({
            isEnabled: !!initialValues?.isEnabled,
            apiPerRun: initialValues?.apiPerRun ?? "",
            intervalHours: initialValues?.intervalHours ?? "",
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
        const api = Number(form.apiPerRun);
        const interval = Number(form.intervalHours);

        if (!api || api < 1 || api > 100)
            e.apiPerRun = "ApiPerRun phải từ 1 đến 100";

        if (!interval || interval < 1 || interval > 24)
            e.intervalHours = "IntervalHours phải từ 1 đến 24 giờ";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) return;
        if (!validate()) return;

        await onSubmit?.({
            isEnabled: form.isEnabled,
            apiPerRun: Number(form.apiPerRun),
            intervalHours: Number(form.intervalHours),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Switch BOT */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontWeight: 700 }}>Cấu hình BOT</div>

                <label className="Switch">
                    <input
                        type="checkbox"
                        checked={form.isEnabled}
                        onChange={(e) => setField("isEnabled", e.target.checked)}
                        disabled={readOnly || loading}
                    />
                    <span className="Switch__track" />
                </label>
            </div>

            <Input
                label="Số API mỗi lần chạy"
                required
                type="number"
                value={form.apiPerRun}
                onChange={(e) => setField("apiPerRun", e.target.value)}
                error={errors.apiPerRun}
                placeholder="Ví dụ: 5"
                disabled={readOnly || loading}
            />

            <Input
                label="Khoảng thời gian giữa mỗi lần chạy (giờ)"
                required
                type="number"
                value={form.intervalHours}
                onChange={(e) => setField("intervalHours", e.target.value)}
                error={errors.intervalHours}
                placeholder="Ví dụ: 12"
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
