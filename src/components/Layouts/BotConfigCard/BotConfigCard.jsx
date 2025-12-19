import React, { useMemo, useState } from "react";
import "./BotConfigCard.scss";

export default function BotConfigCard({
    title = "CẤU HÌNH BOT",
    initialEnabled = false,
    initialApiPerRun = 5,
    initialIntervalHours = 12,
    loading = false,
    onSave,
}) {
    const [enabled, setEnabled] = useState(initialEnabled);
    const [apiPerRun, setApiPerRun] = useState(String(initialApiPerRun ?? ""));
    const [intervalHours, setIntervalHours] = useState(String(initialIntervalHours ?? ""));
    const [touched, setTouched] = useState(false);

    const errors = useMemo(() => {
        const e = {};
        const n1 = Number(apiPerRun);
        const n2 = Number(intervalHours);

        if (apiPerRun === "" || Number.isNaN(n1) || n1 <= 0) e.apiPerRun = "Vui lòng nhập số > 0";
        if (intervalHours === "" || Number.isNaN(n2) || n2 <= 0) e.intervalHours = "Vui lòng nhập số > 0";

        return e;
    }, [apiPerRun, intervalHours]);

    const canSave = Object.keys(errors).length === 0 && !loading;

    const handleSave = async () => {
        setTouched(true);
        if (!canSave) return;

        const payload = {
            enabled,
            apiPerRun: Number(apiPerRun),
            intervalHours: Number(intervalHours),
        };

        await onSave?.(payload);
    };

    return (
        <div className="BotConfigWrap">
            <div className="BotConfigTitle">{title}</div>

            <div className="BotConfigCard">
                <div className="BotConfigRow BotConfigRow--top">
                    <div className="BotConfigLabel">
                        <span className="BotConfigIcon" aria-hidden="true">⚙️</span>
                        <span>Cấu hình BOT:</span>
                    </div>

                    <label className="Switch">
                        <input
                            type="checkbox"
                            checked={enabled}
                            onChange={async (e) => {
                                const next = e.target.checked;
                                setEnabled(next);

                                // optional: đánh dấu touched để hiện lỗi nếu dữ liệu số đang sai
                                setTouched(true);

                                // ✅ Chỉ auto-save toggle khi 2 số hợp lệ
                                if (Object.keys(errors).length > 0) return;

                                await onSave?.({
                                    enabled: next,
                                    apiPerRun: Number(apiPerRun),
                                    intervalHours: Number(intervalHours),
                                });
                            }}
                            disabled={loading}
                        />
                        <span className="SwitchTrack" />
                    </label>
                </div>

                <div className="Divider" />

                <div className="Field">
                    <label className="FieldLabel">Số API mỗi lần chạy:</label>
                    <input
                        className={`FieldInput ${touched && errors.apiPerRun ? "isError" : ""}`}
                        value={apiPerRun}
                        onChange={(e) => setApiPerRun(e.target.value)}
                        onBlur={() => setTouched(true)}
                        inputMode="numeric"
                        placeholder="5"
                        disabled={loading}
                    />
                    {touched && errors.apiPerRun ? <div className="FieldError">{errors.apiPerRun}</div> : null}
                </div>

                <div className="Field">
                    <label className="FieldLabel">Khoảng thời gian giữa mỗi lần chạy:</label>
                    <input
                        className={`FieldInput ${touched && errors.intervalHours ? "isError" : ""}`}
                        value={intervalHours}
                        onChange={(e) => setIntervalHours(e.target.value)}
                        onBlur={() => setTouched(true)}
                        inputMode="numeric"
                        placeholder="12"
                        disabled={loading}
                    />
                    {touched && errors.intervalHours ? <div className="FieldError">{errors.intervalHours}</div> : null}
                </div>

                <button className="SaveBtn" type="button" onClick={handleSave} disabled={!canSave}>
                    {loading ? "ĐANG LƯU..." : "LƯU"}
                </button>
            </div>
        </div>
    );
}
