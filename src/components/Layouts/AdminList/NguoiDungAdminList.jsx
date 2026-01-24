import { useEffect, useState, useMemo, useCallback } from "react";
import * as userServices from "../../../services/Admin/MovieService";
import DataTable from "../DataTable/DataTable";
import RenderPagination from "../../Commons/RenderPagination/RenderPagination";

import ActionCard from "../ActionCard/ActionCard";
import Modal from "../../Modal/Modal";
import ConfirmModal from "../../Modal/ConfirmModal";
import NguoiDungForm from "../AdminForms/NguoiDungForm";
import { formatURLImage } from "../../../untils/Format";

export default function NguoiDungAdminList() {
    const [rows, setRows] = useState([]);
    const [paging, setPaging] = useState({ page: 1, limit: 10, last: 1, total: 0 });

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [viewMode, setViewMode] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const columns = useMemo(
        () => [
            { key: "avatar", label: "Avatar" },
            { key: "userName", label: "UserName" },
            { key: "email", label: "Email" },
            { key: "nameND", label: "Tên hiển thị" },
            { key: "gioiTinh", label: "Giới tính" },
            { key: "role", label: "Vai trò" },
            { key: "typeLogin", label: "Loại login" },
            { key: "createdAt", label: "Ngày tạo" },
        ],
        []
    );

    const fetchData = useCallback(async () => {
        try {
            const res = await userServices.fetchUsers(paging.page, paging.limit);
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
                    id: x.userId,
                    userName: x.userName,
                    email: x.email,
                    nameND: x.nameND,
                    gioiTinh: mapGioiTinh(x.gioiTinh),
                    role: x.role,
                    typeLogin: x.typeLogin,
                    createdAt: formatDate(x.thoiGianTao),
                    avatar: x.avatarND ? (
                        <img
                            src={formatURLImage(x.avatarND)}
                            alt="avatar"
                            style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                        />
                    ) : (
                        "-"
                    ),
                    raw: x,
                }))
            );

            setPaging((p) => ({ ...p, ...pg }));
        } catch (err) {
            console.error("fetchUsers error:", err);
        }
    }, [paging.page, paging.limit]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const openView = (row) => {
        setViewMode(true);
        setEditing(row.raw);
        setOpen(true);
    };

    const openEdit = (row) => {
        setViewMode(false);
        setEditing(row.raw);
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
        setEditing(null);
        setViewMode(false);
    };

    const askDelete = (row) => {
        setDeleteTarget(row);
        setConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            setDeleting(true);
            await userServices.deleteUser(deleteTarget.id);
            setConfirmOpen(false);
            setDeleteTarget(null);
            await fetchData();
        } catch (err) {
            console.error("delete user error:", err);
            alert("Xoá user thất bại");
        } finally {
            setDeleting(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            setSaving(true);
            await userServices.updateInfoUser(formData);
            closeModal();
            await fetchData();
        } catch (err) {
            console.error("update user error:", err);
            alert("Cập nhật user thất bại");
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
                subtitle="Người dùng"
                showAdd={false}
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
                title={viewMode ? "Chi tiết người dùng" : "Cập nhật người dùng"}
                onClose={closeModal}
                size="md"
            >
                <NguoiDungForm
                    initialValues={editing}
                    readOnly={viewMode}
                    hideSubmit={viewMode}
                    loading={saving}
                    onCancel={closeModal}
                    onSubmit={handleSubmit}
                    oldAvatarUrl={editing?.avatarND}
                />
            </Modal>

            <ConfirmModal
                open={confirmOpen}
                title="Xoá người dùng"
                message={`Bạn chắc chắn muốn xoá "${deleteTarget?.userName}" không?`}
                danger
                loading={deleting}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />
        </>
    );
}

function mapGioiTinh(v) {
    if (v === 1) return "Nam";
    if (v === 2) return "Nữ";
    return "Khác";
}

function formatDate(v) {
    if (!v) return "";
    return new Date(v).toLocaleDateString("vi-VN");
}