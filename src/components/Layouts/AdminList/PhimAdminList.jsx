import { useEffect, useState, useMemo, useCallback } from "react";
import * as movieServices from "../../../services/Admin/MovieService";
import DataTable from "../DataTable/DataTable";
import RenderPagination from "../../Commons/RenderPagination";
import { resolveImageUrl } from "../../../untils/media";
import ActionCard from "../ActionCard/ActionCard";
import Modal from "../../Modal/Modal";
import ConfirmModal from "../../Modal/ConfirmModal";
import PhimForm from "../AdminForms/PhimForm";
import ImagePreviewModal from "../../Modal/ImagePreviewModal";

export default function PhimAdminList() {
    const [rows, setRows] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [paging, setPaging] = useState({ page: 1, limit: 10, last: 1, total: 0 });

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null); // null=create | object=edit/view
    const [saving, setSaving] = useState(false);
    const [viewMode, setViewMode] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [preview, setPreview] = useState({
        open: false,
        src: "",
        title: "",
    });

    // options cho Select/multi-select
    const [quocGiaOptions, setQuocGiaOptions] = useState([]);
    const [ngonNguOptions, setNgonNguOptions] = useState([]);
    const [theLoaiOptions, setTheLoaiOptions] = useState([]);
    const [daoDienOptions, setDaoDienOptions] = useState([]);
    const [dienVienOptions, setDienVienOptions] = useState([]);
    const [theTagOptions, setTheTagOptions] = useState([]);

    const columns = useMemo(
        () => [
            { key: "ten", label: "Tên phim" },
            { key: "moTa", label: "Mô tả" },
            { key: "thuoiLuong", label: "Thời lượng" },

            { key: "avatar", label: "Ảnh phim" },
            { key: "poster", label: "Ảnh poster phim" },

            { key: "soTap", label: "Số tập" },
            { key: "theLoais", label: "Thể loại" },

            { key: "quocGia", label: "Quốc gia" },
            { key: "ngonNgu", label: "Ngôn ngữ" },

            { key: "dienViens", label: "Diễn viên" },
            { key: "daoDiens", label: "Đạo diễn" },

            { key: "ngayPhatHanh", label: "Ngày phát hành" },
        ],
        []
    );

    const mapRow = useCallback(
        (x) => ({
            id: x.phimId,
            ten: x.tenP,
            moTa: shortText(x.moTaP, 80),
            thuoiLuong: x.thuoiLuongP,

            avatar: x.avatarP ? (
                <img
                    src={resolveImageUrl(x.avatarP, "films")}
                    alt="avatar"
                    title="Bấm để xem ảnh lớn"
                    onClick={() =>
                        setPreview({
                            open: true,
                            src: resolveImageUrl(x.avatarP, "films"),
                            title: "Avatar phim",
                        })
                    }
                    style={{
                        width: 140,
                        height: 78,
                        objectFit: "cover",
                        borderRadius: 14,
                        cursor: "zoom-in",
                    }}
                />
            ) : "",

            poster: x.avatarPoster ? (
                <img
                    src={resolveImageUrl(x.avatarPoster, "banners")}
                    alt="poster"
                    title="Bấm để xem ảnh lớn"
                    onClick={() =>
                        setPreview({
                            open: true,
                            src: resolveImageUrl(x.avatarPoster, "banners"),
                            title: "Poster phim",
                        })
                    }
                    style={{
                        width: 100,
                        height: 150,
                        objectFit: "cover",
                        borderRadius: 14,
                        cursor: "zoom-in",
                    }}
                />
            ) : "",

            soTap: x.soTapP || "",
            theLoais: (x.theLoais || []).join(", "),
            quocGia: x.quocGia,
            ngonNgu: x.ngonNgu,
            dienViens: (x.dienViens || []).join(", "),
            daoDiens: (x.daoDiens || []).join(", "),
            ngayPhatHanh: formatDate(x.ngayPhatHanhP),

            checked: false,
            raw: x,
        }),
        [setPreview]
    );

    // fetch list phim
    const fetchData = useCallback(async () => {
        try {
            const k = keyword.trim();

            if (k) {
                const res = await movieServices.searchPhims(k);
                if (!res) return;

                const list = res.data || [];

                setRows(
                    list.map((x) => ({
                        id: x.phimId,
                        ten: x.tenP,
                        moTa: shortText(x.moTaP, 80),
                        thuoiLuong: x.thuoiLuongP,

                        avatar: x.avatarP ? (
                            <img
                                src={resolveImageUrl(x.avatarP)}
                                alt="avatar"
                                title="Bấm để xem ảnh lớn"
                                onClick={() =>
                                    setPreview({
                                        open: true,
                                        src: resolveImageUrl(x.avatarP),
                                        title: "Avatar phim",
                                    })
                                }
                                style={{
                                    width: 140,
                                    height: 78,
                                    objectFit: "cover",
                                    borderRadius: 14,
                                    cursor: "zoom-in",
                                }}
                            />
                        ) : "",

                        poster: x.avatarPoster ? (
                            <img
                                src={resolveImageUrl(x.avatarPoster)}
                                alt="poster"
                                title="Bấm để xem ảnh lớn"
                                onClick={() =>
                                    setPreview({
                                        open: true,
                                        src: resolveImageUrl(x.avatarPoster),
                                        title: "Poster phim",
                                    })
                                }
                                style={{
                                    width: 100,
                                    height: 150,
                                    objectFit: "cover",
                                    borderRadius: 14,
                                    cursor: "zoom-in",
                                }}
                            />
                        ) : "",

                        soTap: x.soTapP || "",
                        theLoais: (x.theLoais || []).join(", "),
                        quocGia: x.quocGia,
                        ngonNgu: x.ngonNgu,
                        dienViens: (x.dienViens || []).join(", "),
                        daoDiens: (x.daoDiens || []).join(", "),
                        ngayPhatHanh: formatDate(x.ngayPhatHanhP),

                        checked: false,
                        raw: x,
                    }))
                );

                // Search: không có pagination -> set giả
                setPaging((p) => ({ ...p, page: 1, last: 1, total: list.length }));
                return;
            }

            // Không search: dùng pagination như cũ
            const res = await movieServices.fetchPhims(paging.page, paging.limit);
            if (!res) return;

            const list = res.data || [];
            const pg = res.pagination || {
                page: paging.page,
                limit: paging.limit,
                last: 1,
                total: list.length,
            };

            setRows(list.map(mapRow));

            setPaging((p) => {
                const next = { ...p, page: pg.page, limit: pg.limit, last: pg.last, total: pg.total };
                const same = p.page === next.page && p.limit === next.limit && p.last === next.last && p.total === next.total;
                return same ? p : next;
            });
        } catch (err) {
            console.error("fetchPhims error:", err);
        }
    }, [paging.page, paging.limit, keyword]);

    // load options cho PhimForm (gọi 1 lần)
    const fetchOptions = useCallback(async () => {
        try {
            const [
                qgRes,
                nnRes,
                tlRes,
                ddRes,
                dvRes,
                ttRes,
            ] = await Promise.all([
                movieServices.fetchQuocGias(1, 1000),
                movieServices.fetchNgonNgus(1, 1000),
                movieServices.fetchTheLoais(1, 1000),
                movieServices.fetchDaoDiens(1, 1000),
                movieServices.fetchDienViens(1, 1000),
                movieServices.fetchTheTags(1, 1000),
            ]);

            const qgList = qgRes?.data || [];
            setQuocGiaOptions(qgList.map((x) => ({ value: x.quocGiaId, label: x.tenQG })));

            const nnList = nnRes?.data || [];
            setNgonNguOptions(nnList.map((x) => ({ value: x.ngonNguId, label: x.tenNN })));

            const tlList = tlRes?.data || [];
            setTheLoaiOptions(tlList.map((x) => ({ value: x.theLoaiId, label: x.tenTL })));

            const ddList = ddRes?.data || [];
            setDaoDienOptions(ddList.map((x) => ({ value: x.daoDienId, label: x.tenDD })));

            const dvList = dvRes?.data || [];
            setDienVienOptions(dvList.map((x) => ({ value: x.dienVienId, label: x.tenDV })));

            const ttList = ttRes?.data || [];
            setTheTagOptions(ttList.map((x) => ({ value: x.theTagId, label: x.tenT })));
        } catch (err) {
            console.error("fetchOptions error:", err);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchOptions();
    }, [fetchOptions]);

    useEffect(() => {
        const handler = (e) => {
            const text = (e?.detail || "").trim();
            setKeyword(text);
            setPaging((p) => ({ ...p, page: 1 })); // search thì reset page về 1
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

    // mở edit: nên gọi detail để có id quan hệ (QuocGiaId, TheLoaiIds...)
    const openEdit = async (row) => {
        try {
            setViewMode(false);
            setSaving(true);

            const id = row?.id ?? row?.raw?.phimId;
            const res = await movieServices.fetchPhimDetail(id);

            const raw = res?.data?.data ?? res?.data ?? {};

            setEditing(mapPhimDetailToForm(raw, id));
            setOpen(true);
        } catch (err) {
            console.error("fetchPhimDetail (edit) error:", err);
            alert("Không lấy được chi tiết phim để sửa.");
        } finally {
            setSaving(false);
        }
    };

    const openView = async (row) => {
        try {
            setViewMode(true);
            setSaving(true);

            const id = row?.id ?? row?.raw?.phimId;
            const res = await movieServices.fetchPhimDetail(id);

            const raw = res?.data?.data ?? res?.data ?? {};
            setEditing(mapPhimDetailToForm(raw, id));
            setOpen(true);
        } catch (err) {
            console.error("fetchPhimDetail (view) error:", err);
            alert("Không lấy được chi tiết phim.");
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
            await movieServices.deletePhim(deleteTarget.id);
            setConfirmOpen(false);
            setDeleteTarget(null);
            await fetchData();
        } catch (err) {
            console.error("delete phim error:", err);
            alert("Xoá phim thất bại. Kiểm tra lại API / quyền truy cập.");
        } finally {
            setDeleting(false);
        }
    };

    const handleSubmitForm = async (formData) => {
        if (viewMode) return;

        try {
            setSaving(true);

            if (!editing?.phimId) {
                await movieServices.createPhim(formData);
            } else {
                await movieServices.updatePhim(formData);
            }

            closeModal();
            await fetchData();
        } catch (err) {
            console.error("save phim error:", err);
            alert("Lưu phim thất bại. Kiểm tra lại dữ liệu / API.");
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
                subtitle="Phim hiện tại"
                onAdd={openCreate}
                onDelete={null}
                addLabel="THÊM PHIM"
                deleteLabel="XOÁ"
                showDelete={false}
            />

            <hr></hr>
            <div className="BotConfigTitle"><span>Bảng dữ liệu:</span></div>
            <hr></hr>

            <div
                style={{
                    width: "100%",
                    overflowX: "auto",
                    overflowY: "hidden",
                    WebkitOverflowScrolling: "touch",
                }}
            >
                <div
                    style={{
                        minWidth: 2800,
                        display: "inline-block",
                    }}
                >
                    <div className="PhimTableScroll">
                        <div className="PhimTableInner">
                            <DataTable
                                columns={columns}
                                rows={rows}
                                onView={openView}
                                onEdit={openEdit}
                                onDelete={askDelete}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <RenderPagination
                data={paging}
                onPageChange={(page) => setPaging((p) => ({ ...p, page }))}
            />

            <Modal
                open={open}
                title={
                    viewMode
                        ? "Chi tiết phim"
                        : editing?.phimId
                            ? "Sửa phim"
                            : "Thêm phim"
                }
                onClose={closeModal}
                size="lg"
            >
                <PhimForm
                    initialValues={editing}
                    onCancel={closeModal}
                    onSubmit={handleSubmitForm}
                    submitText={editing?.phimId ? "Cập nhật" : "Tạo mới"}
                    loading={saving}
                    readOnly={viewMode}
                    hideSubmit={viewMode}
                    quocGiaOptions={quocGiaOptions}
                    ngonNguOptions={ngonNguOptions}
                    theLoaiOptions={theLoaiOptions}
                    daoDienOptions={daoDienOptions}
                    dienVienOptions={dienVienOptions}
                    theTagOptions={theTagOptions}
                />
            </Modal>

            <ConfirmModal
                open={confirmOpen}
                title="Xoá phim"
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

            <ImagePreviewModal
                open={preview.open}
                src={preview.src}
                title={preview.title}
                onClose={() => setPreview({ open: false, src: "", title: "" })}
            />
        </>
    );
}

function formatDate(value) {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("vi-VN");
}

function shortText(text, max = 80) {
    if (!text) return "";
    const s = String(text).trim();
    if (s.length <= max) return s;
    return s.slice(0, max) + "...";
}

// ⚠️ Quan trọng: detail API của bạn phải trả về các Id quan hệ (QuocGiaId, TheLoaiIds...)
// Nếu hiện tại detail chỉ trả tên (QuocGia, TheLoais dạng string) thì cần backend bổ sung Ids.
// Tạm thời mình map theo hướng "nếu có thì dùng".
function mapPhimDetailToForm(raw, fallbackId) {
    return {
        phimId: raw.phimId ?? raw.PhimId ?? fallbackId,

        tenP: raw.tenP ?? raw.TenP ?? "",
        moTaP: raw.moTaP ?? raw.MoTaP ?? "",
        tenCTSXP: raw.tenCTSXP ?? raw.TenCTSXP ?? "",
        ngayPhatHanhP: raw.ngayPhatHanhP ?? raw.NgayPhatHanhP ?? "",
        thuoiLuongP: raw.thuoiLuongP ?? raw.ThuoiLuongP ?? "",
        nguonP: raw.nguonP ?? raw.NguonP ?? "",
        soTapP: raw.soTapP ?? raw.SoTapP ?? "",
        traiLerP: raw.traiLerP ?? raw.TraiLerP ?? "",

        // URL ảnh cũ (để PhimForm show)
        avatarP: raw.avatarP ?? raw.AvatarP ?? "",
        avatarPoster: raw.avatarPoster ?? raw.AvatarPoster ?? "",

        // Id quan hệ (nếu backend có trả)
        quocGiaId: raw.quocGiaId ?? raw.QuocGiaId ?? "",
        ngonNguId: raw.ngonNguId ?? raw.NgonNguId ?? "",

        theLoaiIds: raw.theLoaiIds ?? raw.TheLoaiIds ?? [],
        daoDienIds: raw.daoDienIds ?? raw.DaoDienIds ?? [],
        dienVienIds: raw.dienVienIds ?? raw.DienVienIds ?? [],
        theTagIds: raw.theTagIds ?? raw.TheTagIds ?? [],
    };
}