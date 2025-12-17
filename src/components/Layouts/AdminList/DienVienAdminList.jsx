import { useEffect, useState, useMemo, useCallback } from "react";
import * as movieServices from "../../../services/Admin/MovieService";
import DataTable from "../DataTable/DataTable";
import RenderPagination from "../../Commons/RenderPagination";

import ActionCard from "../ActionCard/ActionCard";
import Modal from "../../Modal/Modal";
import ConfirmModal from "../../Modal/ConfirmModal";
import DienVienForm from "../AdminForms/DienVienForm";

export default function DienVienAdminList() {
    const [rows, setRows] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [paging, setPaging] = useState({ page: 1, limit: 10, last: 1, total: 0 });

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);

    const [viewMode, setViewMode] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const columns = useMemo(
        () => [
            { key: "ten", label: "Tên" },
            { key: "moTa", label: "Mô tả" },
        ],
        []
    );

    const fetchData = useCallback(async () => {
        try {
            const k = (keyword || "").trim();

            // ✅ Có keyword => Search (không phân trang)
            if (k) {
                const res = await movieServices.searchDienViens(k);
                if (!res) return;

                const list = res.data || [];

                setRows(
                    list.map((x) => ({
                        id: x.dienVienId,
                        ten: x.tenDV,
                        moTa: x.moTaDV,
                        checked: false,
                        raw: x,
                    }))
                );

                // Search: set paging giả
                setPaging((p) => ({ ...p, page: 1, last: 1, total: list.length }));
                return;
            }

            // ✅ Không keyword => fetch phân trang như cũ
            const res = await movieServices.fetchDienViens(paging.page, paging.limit);
            if (!res) return;

            const list = res.data || [];
            const pg = res.pagination || {
                page: paging.page,
                limit: paging.limit,
                last: 1,
                total: list.length,
            };

            setRows(
                list.map((x) => ({
                    id: x.dienVienId,
                    ten: x.tenDV,
                    moTa: x.moTaDV,
                    checked: false,
                    raw: x,
                }))
            );

            setPaging((p) => {
                const next = { ...p, page: pg.page, limit: pg.limit, last: pg.last, total: pg.total };
                const same =
                    p.page === next.page &&
                    p.limit === next.limit &&
                    p.last === next.last &&
                    p.total === next.total;
                return same ? p : next;
            });
        } catch (err) {
            console.error("fetchDienViens error:", err);
        }
    }, [paging.page, paging.limit, keyword]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const handler = (e) => {
            const text = (e?.detail || "").trim();
            setKeyword(text);
            setPaging((p) => ({ ...p, page: 1 }));
        };

        window.addEventListener("admin-search", handler);
        return () => window.removeEventListener("admin-search", handler);
    }, []);

    const openCreate = () => {
        setViewMode(false);
        setEditing(null);
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
        setEditing(null);
        setViewMode(false);
    };

    const openEdit = (row) => {
        setViewMode(false);
        const raw = row?.raw || {};
        setEditing({
            dienVienId: raw.dienVienId ?? row.id,
            tenDV: raw.tenDV ?? row.ten ?? "",
            moTaDV: raw.moTaDV ?? row.moTa ?? "",
        });
        setOpen(true);
    };

    // View: gọi API detail rồi mở readonly
    const openView = async (row) => {
        try {
            setViewMode(true);
            setSaving(true);

            const id = row?.id ?? row?.raw?.dienVienId;
            const res = await movieServices.fetchDienVienDetail(id);

            const raw = res?.data?.data ?? res?.data ?? {};

            setEditing({
                dienVienId: raw.dienVienId ?? id,
                tenDV: raw.tenDV ?? "",
                moTaDV: raw.moTaDV ?? "",
            });

            setOpen(true);
        } catch (err) {
            console.error("fetchDienVienDetail error:", err);
            alert("Không lấy được chi tiết diễn viên.");
        } finally {
            setSaving(false);
        }
    };

    const askDelete = (row) => {
        setDeleteTarget(row);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            setDeleting(true);
            await movieServices.deleteDienVien(deleteTarget.id);
            setConfirmOpen(false);
            setDeleteTarget(null);
            await fetchData();
        } catch (err) {
            console.error("delete dienvien error:", err);
            alert("Xoá thất bại. Kiểm tra lại API / quyền truy cập.");
        } finally {
            setDeleting(false);
        }
    };

    const handleSubmitForm = async (payload) => {
        if (viewMode) return;

        try {
            setSaving(true);

            if (!editing) {
                await movieServices.createDienVien(payload);
            } else {
                await movieServices.updateDienVien({
                    dienVienId: editing.dienVienId,
                    ...payload,
                });
            }

            closeModal();
            await fetchData();
        } catch (err) {
            console.error("save dienvien error:", err);
            alert("Lưu thất bại. Kiểm tra lại API / dữ liệu / quyền truy cập.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="BotConfigTitle"><span>Thông tin chung:</span></div>
            <hr></hr>

            <ActionCard
                title="Tổng đang có:"
                value={paging.total}
                subtitle="Diễn viên hiện tại"
                onAdd={openCreate}
                onDelete={null}
                addLabel="THÊM DIỄN VIÊN"
                deleteLabel="XOÁ"
                showDelete={false}
            />

            <hr></hr>
            <div className="BotConfigTitle"><span>Bảng dữ liệu:</span></div>
            <hr></hr>

            <DataTable
                columns={columns}
                rows={rows}
                onView={openView}
                onEdit={openEdit}
                onDelete={askDelete}
            />

            <RenderPagination
                data={paging}
                onPageChange={(page) => setPaging((p) => ({ ...p, page }))}
            />

            <Modal
                open={open}
                title={
                    viewMode
                        ? "Chi tiết diễn viên"
                        : editing
                            ? "Sửa diễn viên"
                            : "Thêm diễn viên"
                }
                onClose={closeModal}
                size="sm"
            >
                <DienVienForm
                    initialValues={editing}
                    onCancel={closeModal}
                    onSubmit={handleSubmitForm}
                    submitText={editing ? "Cập nhật" : "Tạo mới"}
                    loading={saving}
                    readOnly={viewMode}
                    hideSubmit={viewMode}
                />
            </Modal>

            <ConfirmModal
                open={confirmOpen}
                title="Xoá diễn viên"
                message={`Bạn chắc chắn muốn xoá "${deleteTarget?.ten ?? ""}" không?`}
                danger
                loading={deleting}
                onCancel={() => {
                    if (deleting) return;
                    setConfirmOpen(false);
                    setDeleteTarget(null);
                }}
                onConfirm={handleConfirmDelete}
                confirmText="Xoá"
                cancelText="Huỷ"
            />
        </>
    );
}
