import { useEffect, useMemo, useCallback, useState } from "react";
import * as movieServices from "../../../services/Admin/MovieService";
import DataTable from "../DataTable/DataTable";
import RenderPagination from "../../Commons/RenderPagination";

import ActionCard from "../ActionCard/ActionCard";
import Modal from "../../Modal/Modal";
import ConfirmModal from "../../Modal/ConfirmModal";
import TapPhimForm from "../AdminForms/TapPhimForm";

export default function TapPhimAdminList() {
    const [rows, setRows] = useState([]);
    const [paging, setPaging] = useState({ page: 1, limit: 10, last: 1, total: 0 });

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null); // null=create | object=edit/view
    const [saving, setSaving] = useState(false);
    const [viewMode, setViewMode] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    // options cho chọn phim
    const [phimOptions, setPhimOptions] = useState([]);

    const columns = useMemo(
        () => [
            { key: "tenPhim", label: "Tên phim" },
            { key: "tenTap", label: "Tên tập" },
            { key: "slugTap", label: "Slug" },
            { key: "tenFile", label: "Tên file" },
            { key: "linkChinh", label: "Link chính" },
            { key: "linkPhu", label: "Link phụ" },
        ],
        []
    );

    // fetch list tập phim (phân trang)
    const fetchData = useCallback(async () => {
        try {
            const res = await movieServices.fetchTapPhims(paging.page, paging.limit);
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
                    id: x.tapId, // TapId là string
                    tenPhim: x.tenPhim,
                    tenTap: x.tenTap,
                    slugTap: x.slugTap,
                    tenFile: x.tenFile,
                    linkChinh: x.linkChinh ? (
                        <a href={x.linkChinh} target="_blank" rel="noreferrer">
                            Mở
                        </a>
                    ) : (
                        ""
                    ),
                    linkPhu: x.linkPhu ? (
                        <a href={x.linkPhu} target="_blank" rel="noreferrer">
                            Mở
                        </a>
                    ) : (
                        ""
                    ),
                    checked: false,
                    raw: x,
                }))
            );

            setPaging((p) => {
                const next = { ...p, page: pg.page, limit: pg.limit, last: pg.last, total: pg.total };
                const same = p.page === next.page && p.limit === next.limit && p.last === next.last && p.total === next.total;
                return same ? p : next;
            });
        } catch (err) {
            console.error("fetchTapPhims error:", err);
        }
    }, [paging.page, paging.limit]);

    // load options phim (gọi 1 lần)
    const fetchPhimOptions = useCallback(async () => {
        try {
            const res = await movieServices.fetchPhims(1, 1000);
            const list = res?.data || [];
            setPhimOptions(list.map((x) => ({ value: x.phimId, label: x.tenP })));
        } catch (err) {
            console.error("fetchPhimOptions error:", err);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchPhimOptions();
    }, [fetchPhimOptions]);

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

    // Edit: nếu bạn có API detail thì gọi; nếu chưa có thì lấy từ row.raw (tạm vẫn OK)
    const openEdit = async (row) => {
        try {
            setViewMode(false);
            setSaving(true);

            const raw = row?.raw || {};
            // Nếu có API detail: const res = await movieServices.fetchTapPhimDetail(row.id);
            // const detail = res?.data?.data ?? res?.data ?? {};
            // setEditing(mapTapDetailToForm(detail, row.id));

            setEditing(mapTapDetailToForm(raw, row?.id));
            setOpen(true);
        } catch (err) {
            console.error("openEdit tapphim error:", err);
            alert("Không lấy được dữ liệu tập phim để sửa.");
        } finally {
            setSaving(false);
        }
    };

    const openView = async (row) => {
        try {
            setViewMode(true);
            setSaving(true);

            const raw = row?.raw || {};
            setEditing(mapTapDetailToForm(raw, row?.id));
            setOpen(true);
        } catch (err) {
            console.error("openView tapphim error:", err);
            alert("Không lấy được chi tiết tập phim.");
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
            await movieServices.deleteTapPhim(deleteTarget.id); // TapId string
            setConfirmOpen(false);
            setDeleteTarget(null);
            await fetchData();
        } catch (err) {
            console.error("delete tapphim error:", err);
            alert("Xoá tập phim thất bại. Kiểm tra lại API / quyền truy cập.");
        } finally {
            setDeleting(false);
        }
    };

    const handleSubmitForm = async (formData) => {
        if (viewMode) return;

        try {
            setSaving(true);

            if (!editing?.tapId) {
                await movieServices.createTapPhim(formData);
            } else {
                await movieServices.updateTapPhim(formData);
            }

            closeModal();
            await fetchData();
        } catch (err) {
            console.error("save tapphim error:", err);
            alert("Lưu tập phim thất bại. Kiểm tra lại dữ liệu / API.");
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
                subtitle="Tập phim hiện tại"
                onAdd={openCreate}
                onDelete={null}
                addLabel="THÊM TẬP PHIM"
                deleteLabel="XOÁ"
                showDelete={false}
            />

            <hr></hr>
            <div className="BotConfigTitle"><span>Bảng dữ liệu:</span></div>
            <hr></hr>

            {/* bảng có thể cuộn ngang nếu nhiều cột */}
            <div
                style={{
                    width: "100%",
                    overflowX: "auto",
                    overflowY: "hidden",
                    WebkitOverflowScrolling: "touch",
                }}
            >
                <div style={{ minWidth: 2200, display: "inline-block" }}>
                    <DataTable columns={columns} rows={rows} onView={openView} onEdit={openEdit} onDelete={askDelete} />
                </div>
            </div>

            <RenderPagination data={paging} onPageChange={(page) => setPaging((p) => ({ ...p, page }))} />

            <Modal
                open={open}
                title={viewMode ? "Chi tiết tập phim" : editing?.tapId ? "Sửa tập phim" : "Thêm tập phim"}
                onClose={closeModal}
                size="lg"
            >
                <TapPhimForm
                    initialValues={editing}
                    onCancel={closeModal}
                    onSubmit={handleSubmitForm}
                    submitText={editing?.tapId ? "Cập nhật" : "Tạo mới"}
                    loading={saving}
                    readOnly={viewMode}
                    hideSubmit={viewMode}
                    phimOptions={phimOptions}
                    oldLinkChinhUrl={editing?.oldLinkChinhUrl || ""} // nếu bạn có
                />
            </Modal>

            <ConfirmModal
                open={confirmOpen}
                title="Xoá tập phim"
                message={`Bạn chắc chắn muốn xoá "${deleteTarget?.tenTap ?? ""}" không?`}
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

// Map dữ liệu từ API/list sang initialValues cho TapPhimForm
function mapTapDetailToForm(raw, fallbackId) {
    return {
        tapId: raw.tapId ?? raw.TapId ?? fallbackId ?? "",
        phimId: raw.phimId ?? raw.PhimId ?? "",
        tenTap: raw.tenTap ?? raw.TenTap ?? "",
        slugTap: raw.slugTap ?? raw.SlugTap ?? "",
        tenFile: raw.tenFile ?? raw.TenFile ?? "",
        linkPhu: raw.linkPhu ?? raw.LinkPhu ?? "",
        // file upload không set ở đây
        oldLinkChinhUrl: raw.linkChinh ?? raw.LinkChinh ?? "",
    };
}