import { useCallback, useEffect, useMemo, useState } from "react";
import * as movieServices from "../../../services/Admin/MovieService";
// bạn để đúng file service bạn đang dùng (MembershipPlan/PlanOption)

import DataTable from "../DataTable/DataTable";
import RenderPagination from "../../Commons/RenderPagination/RenderPagination";
import ActionCard from "../ActionCard/ActionCard";
import Modal from "../../Modal/Modal";
import ConfirmModal from "../../Modal/ConfirmModal";

import GoiThanhVienForm from "../AdminForms/GoiThanhVienForm";
import PlanOptionForm from "../AdminForms/PlanOptionForm";

export default function GoiThanhVienAdminList() {
    const [rows, setRows] = useState([]);
    const [paging, setPaging] = useState({ page: 1, limit: 10, last: 1, total: 0 });

    // Plan modal
    const [openPlan, setOpenPlan] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [savingPlan, setSavingPlan] = useState(false);
    const [viewModePlan, setViewModePlan] = useState(false);

    // Delete plan
    const [confirmOpenPlan, setConfirmOpenPlan] = useState(false);
    const [deletePlanTarget, setDeletePlanTarget] = useState(null);
    const [deletingPlan, setDeletingPlan] = useState(false);

    // Expand options
    const [expandedPlanId, setExpandedPlanId] = useState(null);
    const [optionsByPlanId, setOptionsByPlanId] = useState({});
    const [loadingOptionsPlanId, setLoadingOptionsPlanId] = useState("");

    // Option modal
    const [openOption, setOpenOption] = useState(false);
    const [editingOption, setEditingOption] = useState(null);
    const [savingOption, setSavingOption] = useState(false);
    const [viewModeOption, setViewModeOption] = useState(false);
    const [optionPlanId, setOptionPlanId] = useState(""); // planId của option đang tạo/sửa

    // Delete option
    const [confirmOpenOption, setConfirmOpenOption] = useState(false);
    const [deleteOptionTarget, setDeleteOptionTarget] = useState(null);
    const [deletingOption, setDeletingOption] = useState(false);

    const columns = useMemo(
        () => [
            { key: "tenPlan", label: "Tên gói" },
            { key: "planSlug", label: "Slug" },
            { key: "moTaPlan", label: "Mô tả" },
        ],
        []
    );

    const fetchPlans = useCallback(async () => {
        try {
            const res = await movieServices.fetchMembershipPlans(paging.page, paging.limit);
            const list = res?.data || [];
            const pg = res?.pagination || {
                page: paging.page,
                limit: paging.limit,
                last: 1,
                total: list.length,
            };

            setRows(
                list.map((x) => ({
                    id: x.planId,
                    tenPlan: x.tenPlan,
                    planSlug: x.planSlug,
                    moTaPlan: x.moTaPlan,
                    raw: x,
                }))
            );

            setPaging((p) => ({ ...p, page: pg.page, limit: pg.limit, last: pg.last, total: pg.total }));
        } catch (e) {
            console.error("fetchMembershipPlans error:", e);
        }
    }, [paging.page, paging.limit]);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    // Load + cache options cho 1 planId (do backend chưa có GetByPlanId => lấy all rồi filter)
    const loadOptionsForPlan = useCallback(async (planId) => {
        if (!planId) return;

        // nếu đã cache rồi thì khỏi gọi
        if (optionsByPlanId[planId]) return;

        try {
            setLoadingOptionsPlanId(planId);

            // lấy thật nhiều để filter (tuỳ data bạn)
            const res = await movieServices.fetchPlanOptions(1, 5000);
            const all = res?.data || [];

            const filtered = all.filter((x) => String(x.planId) === String(planId));
            setOptionsByPlanId((p) => ({ ...p, [planId]: filtered }));
        } catch (e) {
            console.error("loadOptionsForPlan error:", e);
            setOptionsByPlanId((p) => ({ ...p, [planId]: [] }));
        } finally {
            setLoadingOptionsPlanId("");
        }
    }, [optionsByPlanId]);

    const toggleExpand = async (row) => {
        const planId = row?.id;
        if (!planId) return;

        if (expandedPlanId === planId) {
            setExpandedPlanId(null);
            return;
        }

        setExpandedPlanId(planId);
        await loadOptionsForPlan(planId);
    };

    // Plan actions
    const openCreatePlan = () => {
        setViewModePlan(false);
        setEditingPlan(null);
        setOpenPlan(true);
    };

    const openEditPlan = async (row) => {
        try {
            setViewModePlan(false);
            setSavingPlan(true);

            const id = row?.id;
            const res = await movieServices.fetchMembershipPlanDetail(id);
            const raw = res?.data?.data ?? res?.data ?? {};

            setEditingPlan({
                planId: raw.planId ?? id,
                tenPlan: raw.tenPlan ?? "",
                planSlug: raw.planSlug ?? "",
                moTaPlan: raw.moTaPlan ?? "",
            });

            setOpenPlan(true);
        } catch (e) {
            console.error("fetchMembershipPlanDetail error:", e);
            alert("Không lấy được chi tiết gói.");
        } finally {
            setSavingPlan(false);
        }
    };

    const openViewPlan = async (row) => {
        try {
            setViewModePlan(true);
            setSavingPlan(true);

            const id = row?.id;
            const res = await movieServices.fetchMembershipPlanDetail(id);
            const raw = res?.data?.data ?? res?.data ?? {};

            setEditingPlan({
                planId: raw.planId ?? id,
                tenPlan: raw.tenPlan ?? "",
                planSlug: raw.planSlug ?? "",
                moTaPlan: raw.moTaPlan ?? "",
            });

            setOpenPlan(true);
        } catch (e) {
            console.error(e);
            alert("Không lấy được chi tiết gói.");
        } finally {
            setSavingPlan(false);
        }
    };

    const closePlanModal = () => {
        setOpenPlan(false);
        setEditingPlan(null);
        setViewModePlan(false);
    };

    const submitPlan = async (payload) => {
        if (viewModePlan) return;

        try {
            setSavingPlan(true);

            if (!editingPlan?.planId) {
                await movieServices.createMembershipPlan(payload);
            } else {
                await movieServices.updateMembershipPlan({ planId: editingPlan.planId, ...payload });
            }

            closePlanModal();
            await fetchPlans();
        } catch (e) {
            console.error("save plan error:", e);
            alert("Lưu gói thất bại.");
        } finally {
            setSavingPlan(false);
        }
    };

    const askDeletePlan = (row) => {
        setDeletePlanTarget(row);
        setConfirmOpenPlan(true);
    };

    const confirmDeletePlan = async () => {
        if (!deletePlanTarget?.id) return;

        try {
            setDeletingPlan(true);
            await movieServices.deleteMembershipPlan(deletePlanTarget.id);
            setConfirmOpenPlan(false);
            setDeletePlanTarget(null);

            // nếu đang expand plan đó thì đóng
            if (expandedPlanId === deletePlanTarget.id) setExpandedPlanId(null);

            await fetchPlans();
        } catch (e) {
            console.error("delete plan error:", e);
            alert("Xoá gói thất bại.");
        } finally {
            setDeletingPlan(false);
        }
    };

    // Option actions
    const openCreateOption = (planId) => {
        setViewModeOption(false);
        setEditingOption(null);
        setOptionPlanId(planId);
        setOpenOption(true);
    };

    const openEditOption = (planId, opt) => {
        setViewModeOption(false);
        setOptionPlanId(planId);
        setEditingOption({
            optionId: opt.optionId,
            planId: opt.planId,
            thoiGianSuDung: opt.thoiGianSuDung,
            giaOption: opt.giaOption,
        });
        setOpenOption(true);
    };

    const closeOptionModal = () => {
        setOpenOption(false);
        setEditingOption(null);
        setViewModeOption(false);
        setOptionPlanId("");
    };

    const refreshExpandedOptions = async (planId) => {
        // reload options cho planId (xóa cache rồi load lại)
        setOptionsByPlanId((p) => {
            const next = { ...p };
            delete next[planId];
            return next;
        });
        await loadOptionsForPlan(planId);
    };

    const submitOption = async (payload) => {
        if (viewModeOption) return;

        try {
            setSavingOption(true);

            if (!editingOption?.optionId) {
                await movieServices.createPlanOption(payload);
            } else {
                await movieServices.updatePlanOption(payload);
            }

            closeOptionModal();
            await refreshExpandedOptions(payload.planId);
        } catch (e) {
            console.error("save option error:", e);
            alert("Lưu option thất bại.");
        } finally {
            setSavingOption(false);
        }
    };

    const askDeleteOption = (planId, opt) => {
        setDeleteOptionTarget({ ...opt, _planId: planId });
        setConfirmOpenOption(true);
    };

    const confirmDeleteOption = async () => {
        if (!deleteOptionTarget?.optionId) return;

        try {
            setDeletingOption(true);
            await movieServices.deletePlanOption(deleteOptionTarget.optionId);
            setConfirmOpenOption(false);

            const pid = deleteOptionTarget._planId;
            setDeleteOptionTarget(null);

            await refreshExpandedOptions(pid);
        } catch (e) {
            console.error("delete option error:", e);
            alert("Xoá option thất bại.");
        } finally {
            setDeletingOption(false);
        }
    };

    const expandedOptions = expandedPlanId ? (optionsByPlanId[expandedPlanId] || []) : [];

    return (
        <>
            <div className="BotConfigTitle"><span>Thông tin chung:</span></div>
            <hr></hr>

            <ActionCard
                title="Gói thành viên"
                value={paging.total}
                subtitle="Danh sách gói"
                onAdd={openCreatePlan}
                showDelete={false}
                addLabel="THÊM GÓI"
            />

            <hr></hr>
            <div className="BotConfigTitle"><span>Bảng dữ liệu:</span></div>
            <hr></hr>

            <DataTable
                columns={columns}
                rows={rows}
                onView={openViewPlan}
                onEdit={openEditPlan}
                onDelete={askDeletePlan}
                // thêm “click row để expand”
                onRowClick={toggleExpand}
                rowClassName={(r) => (r.id === expandedPlanId ? "DataTable__tr--active" : "")}
            />

            {/* ✅ khu vực expand (nếu DataTable chưa hỗ trợ onRowClick, bạn có thể thêm nút "Xem options" trong cột hành động) */}
            {expandedPlanId ? (
                <div style={{ marginTop: 12, padding: 12, border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                        <div style={{ fontWeight: 700 }}>
                            Options của PlanId: <span style={{ fontWeight: 500 }}>{expandedPlanId}</span>
                        </div>

                        <button className="Btn Btn--primary" type="button" onClick={() => openCreateOption(expandedPlanId)}>
                            + Thêm option
                        </button>
                    </div>

                    {loadingOptionsPlanId === expandedPlanId ? (
                        <div style={{ padding: 12, opacity: 0.8 }}>Đang tải options...</div>
                    ) : expandedOptions.length === 0 ? (
                        <div style={{ padding: 12, opacity: 0.8 }}>Chưa có option nào.</div>
                    ) : (
                        <table style={{ width: "100%", marginTop: 10, borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th style={th}>Thời gian (ngày)</th>
                                    <th style={th}>Giá</th>
                                    <th style={th}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expandedOptions.map((opt) => (
                                    <tr key={opt.optionId}>
                                        <td style={td}>{opt.thoiGianSuDung}</td>
                                        <td style={td}>{Number(opt.giaOption).toLocaleString("vi-VN")}</td>
                                        <td style={td}>
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <button className="Btn Btn--ghost" type="button" onClick={() => openEditOption(expandedPlanId, opt)}>
                                                    Sửa
                                                </button>
                                                <button className="Btn Btn--danger" type="button" onClick={() => askDeleteOption(expandedPlanId, opt)}>
                                                    Xoá
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : null}

            <RenderPagination data={paging} onPageChange={(page) => setPaging((p) => ({ ...p, page }))} />

            {/* Plan modal */}
            <Modal
                open={openPlan}
                title={viewModePlan ? "Chi tiết gói" : editingPlan?.planId ? "Sửa gói" : "Thêm gói"}
                onClose={closePlanModal}
                size="sm"
            >
                <GoiThanhVienForm
                    initialValues={editingPlan}
                    onCancel={closePlanModal}
                    onSubmit={submitPlan}
                    submitText={editingPlan?.planId ? "Cập nhật" : "Tạo mới"}
                    loading={savingPlan}
                    readOnly={viewModePlan}
                    hideSubmit={viewModePlan}
                />
            </Modal>

            {/* Option modal */}
            <Modal
                open={openOption}
                title={viewModeOption ? "Chi tiết option" : editingOption?.optionId ? "Sửa option" : "Thêm option"}
                onClose={closeOptionModal}
                size="sm"
            >
                <PlanOptionForm
                    initialValues={editingOption}
                    planId={optionPlanId}
                    onCancel={closeOptionModal}
                    onSubmit={submitOption}
                    submitText={editingOption?.optionId ? "Cập nhật" : "Tạo mới"}
                    loading={savingOption}
                    readOnly={viewModeOption}
                    hideSubmit={viewModeOption}
                />
            </Modal>

            <ConfirmModal
                open={confirmOpenPlan}
                title="Xoá gói"
                message={`Bạn chắc chắn muốn xoá "${deletePlanTarget?.tenPlan ?? ""}" không?`}
                danger
                loading={deletingPlan}
                onCancel={() => {
                    if (deletingPlan) return;
                    setConfirmOpenPlan(false);
                    setDeletePlanTarget(null);
                }}
                onConfirm={confirmDeletePlan}
                confirmText="Xoá"
                cancelText="Huỷ"
            />

            <ConfirmModal
                open={confirmOpenOption}
                title="Xoá option"
                message={`Bạn chắc chắn muốn xoá option này không?`}
                danger
                loading={deletingOption}
                onCancel={() => {
                    if (deletingOption) return;
                    setConfirmOpenOption(false);
                    setDeleteOptionTarget(null);
                }}
                onConfirm={confirmDeleteOption}
                confirmText="Xoá"
                cancelText="Huỷ"
            />
        </>
    );
}

const th = { textAlign: "left", padding: 10, borderBottom: "1px solid rgba(0,0,0,0.08)" };
const td = { padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)" };