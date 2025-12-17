import { useEffect, useState, useCallback, useMemo } from "react";
import * as botServices from "../../../services/Admin/MovieService"; // sửa lại

import RenderPagination from "../../Commons/RenderPagination";
import DataTable from "../DataTable/DataTable";

import BotConfigCard from "../BotConfigCard/BotConfigCard";

export default function BotAdminList() {
    const [config, setConfig] = useState(null);
    const [savingConfig, setSavingConfig] = useState(false);
    const [configKey, setConfigKey] = useState(0);

    const [logRows, setLogRows] = useState([]);
    const [logPaging, setLogPaging] = useState({ page: 1, limit: 10, last: 1, total: 0 });
    const [loadingLogs, setLoadingLogs] = useState(false);

    const logColumns = useMemo(
        () => [
            { key: "syncedAt", label: "Thời điểm" },
            { key: "actionText", label: "Hành động" },
            { key: "phimName", label: "Phim" },
            { key: "phimSlug", label: "Slug" },
            { key: "message", label: "Ghi chú" },
        ],
        []
    );

    const fetchConfig = useCallback(async () => {
        try {
            const res = await botServices.fetchBotConfig();
            const raw = res?.data?.data ?? res?.data ?? {};

            setConfig({
                isEnabled: !!raw.isEnabled,
                apiPerRun: raw.apiPerRun ?? 5,
                intervalHours: raw.intervalHours ?? 12,
                lastUpdated: raw.lastUpdated,
            });

            setConfigKey((k) => k + 1);
        } catch (err) {
            console.error("fetchBotConfig error:", err);
            setConfig(null);
        }
    }, []);

    const fetchLogs = useCallback(async () => {
        try {
            setLoadingLogs(true);

            const res = await botServices.fetchBotSyncLogs(logPaging.page, logPaging.limit);

            const list = res?.data || [];
            const pg = res?.pagination || {
                page: logPaging.page,
                limit: logPaging.limit,
                last: 1,
                total: list.length,
            };

            const actionMap = {
                0: "Create",
                1: "Update",
                2: "Skip",
                3: "Error",
                4: "Delete",
            };

            setLogRows(
                list.map((x) => ({
                    id: x.botSyncLogId,
                    syncedAt: x.syncedAt ? new Date(x.syncedAt).toLocaleString("vi-VN") : "",
                    actionText: actionMap[x.action] ?? x.action,
                    phimName: x.phimName,
                    phimSlug: x.phimSlug,
                    message: x.message || "",
                    raw: x,
                }))
            );

            setLogPaging((p) => ({ ...p, page: pg.page, limit: pg.limit, last: pg.last, total: pg.total }));
        } catch (e) {
            console.error("fetchBotSyncLogs error:", e);
            setLogRows([]);
        } finally {
            setLoadingLogs(false);
        }
    }, [logPaging.page, logPaging.limit]);

    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleSaveConfig = async (payloadFromCard) => {
        try {
            setSavingConfig(true);

            await botServices.updateBotConfig({
                isEnabled: payloadFromCard.enabled,
                apiPerRun: payloadFromCard.apiPerRun,
                intervalHours: payloadFromCard.intervalHours,
            });

            await fetchConfig();
            alert("Lưu cấu hình BOT thành công!");
        } catch (err) {
            console.error("updateBotConfig error:", err);
            alert("Lưu cấu hình BOT thất bại.");
        } finally {
            setSavingConfig(false);
        }
    };

    return (
        <>
            <BotConfigCard
                key={configKey}
                title="CẤU HÌNH BOT"
                initialEnabled={!!config?.isEnabled}
                initialApiPerRun={config?.apiPerRun ?? 5}
                initialIntervalHours={config?.intervalHours ?? 12}
                loading={savingConfig}
                onSave={handleSaveConfig}
            />
            <hr></hr>
            <div className="BotConfigTitle"><span>Bảng dữ liệu:</span></div>

            <div style={{ marginTop: 18 }}>
                <DataTable
                    columns={logColumns}
                    rows={logRows}
                    showActions={false}
                />

                <RenderPagination data={logPaging} onPageChange={(page) => setLogPaging((p) => ({ ...p, page }))} />
            </div>
        </>
    );
}