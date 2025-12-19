import { useEffect, useMemo, useState } from "react";
import Input from "../../FormControls/Input";
import Textarea from "../../FormControls/Textarea";
import Select from "../../FormControls/Select";
import Upload from "../../FormControls/Upload";
import MultiSelectAdd from "../../FormControls/MultiSelectAdd";
import { resolveImageUrl } from "../../../untils/media";

const emptyForm = {
    tenP: "",
    moTaP: "",
    tenCTSXP: "",
    ngayPhatHanhP: "", // yyyy-mm-dd
    thuoiLuongP: "",
    nguonP: "",
    soTapP: "",
    traiLerP: "",

    quocGiaId: "",
    ngonNguId: "",

    theLoaiIds: [],
    daoDienIds: [],
    dienVienIds: [],
    theTagIds: [],

    avatarP: null,        // File
    avatarPoster: null,   // File
};

export default function PhimForm({
    initialValues, // null | object
    onSubmit,      // (formData) => void | Promise
    onCancel,
    submitText = "Lưu",
    loading = false,
    readOnly = false,
    hideSubmit = false,

    // options từ ngoài truyền vào
    quocGiaOptions = [],
    ngonNguOptions = [],
    theLoaiOptions = [],
    daoDienOptions = [],
    dienVienOptions = [],
    theTagOptions = [],
}) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    // url ảnh cũ từ backend (edit/view)
    const oldAvatarUrl = resolveImageUrl(initialValues?.avatarP, "films");
    const oldPosterUrl = resolveImageUrl(initialValues?.avatarPoster, "banners");

    // preview ảnh mới khi chọn file
    const avatarPreview = useMemo(() => {
        if (form.avatarP instanceof File) return URL.createObjectURL(form.avatarP);
        return "";
    }, [form.avatarP]);

    const posterPreview = useMemo(() => {
        if (form.avatarPoster instanceof File) return URL.createObjectURL(form.avatarPoster);
        return "";
    }, [form.avatarPoster]);

    useEffect(() => {
        setForm({
            tenP: initialValues?.tenP ?? "",
            moTaP: initialValues?.moTaP ?? "",
            tenCTSXP: initialValues?.tenCTSXP ?? "",
            ngayPhatHanhP: initialValues?.ngayPhatHanhP
                ? toDateInput(initialValues.ngayPhatHanhP)
                : "",
            thuoiLuongP: initialValues?.thuoiLuongP ?? "",
            nguonP: initialValues?.nguonP ?? "",
            soTapP: initialValues?.soTapP ?? "",
            traiLerP: initialValues?.traiLerP ?? "",

            quocGiaId: initialValues?.quocGiaId ?? "",
            ngonNguId: initialValues?.ngonNguId ?? "",

            theLoaiIds: initialValues?.theLoaiIds ?? [],
            daoDienIds: initialValues?.daoDienIds ?? [],
            dienVienIds: initialValues?.dienVienIds ?? [],
            theTagIds: initialValues?.theTagIds ?? [],

            avatarP: null,
            avatarPoster: null,
        });
        setErrors({});
    }, [initialValues]);

    const setField = (key, value) => {
        if (readOnly) return;
        setForm((p) => ({ ...p, [key]: value }));
        setErrors((p) => ({ ...p, [key]: undefined }));
    };

    const isCreate = !initialValues?.phimId;

    const validate = () => {
        if (readOnly) return true;

        const e = {};
        if (!form.tenP.trim()) e.tenP = "Vui lòng nhập tên phim";
        if (!form.tenCTSXP.trim()) e.tenCTSXP = "Vui lòng nhập tên công ty sản xuất";
        if (!form.ngayPhatHanhP) e.ngayPhatHanhP = "Vui lòng chọn ngày phát hành";
        if (!form.thuoiLuongP.trim()) e.thuoiLuongP = "Vui lòng nhập thời lượng";
        if (!form.nguonP.trim()) e.nguonP = "Vui lòng nhập nguồn phim";
        if (!form.quocGiaId) e.quocGiaId = "Vui lòng chọn quốc gia";
        if (!form.ngonNguId) e.ngonNguId = "Vui lòng chọn ngôn ngữ";

        // Create: bắt buộc file
        if (isCreate) {
            if (!(form.avatarP instanceof File)) e.avatarP = "Avatar phim bắt buộc";
            if (!(form.avatarPoster instanceof File)) e.avatarPoster = "Poster phim bắt buộc";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const buildFormData = () => {
        const fd = new FormData();

        if (initialValues?.phimId) fd.append("PhimId", String(initialValues.phimId));

        // append PascalCase cho chắc khớp backend .NET
        fd.append("TenP", form.tenP.trim());
        fd.append("MoTaP", form.moTaP?.trim() || "");
        fd.append("QuocGiaId", String(form.quocGiaId));
        fd.append("NgonNguId", String(form.ngonNguId));
        fd.append("TenCTSXP", form.tenCTSXP.trim());
        fd.append("NgayPhatHanhP", form.ngayPhatHanhP);
        fd.append("ThuoiLuongP", form.thuoiLuongP.trim());
        fd.append("NguonP", form.nguonP.trim());
        fd.append("SoTapP", form.soTapP?.trim() || "");
        fd.append("TraiLerP", form.traiLerP?.trim() || "");

        if (form.avatarP instanceof File) fd.append("AvatarP", form.avatarP);
        if (form.avatarPoster instanceof File) fd.append("AvatarPoster", form.avatarPoster);

        (form.theLoaiIds || []).forEach((id, i) => fd.append(`TheLoaiIds[${i}]`, String(id)));
        (form.daoDienIds || []).forEach((id, i) => fd.append(`DaoDienIds[${i}]`, String(id)));
        (form.dienVienIds || []).forEach((id, i) => fd.append(`DienVienIds[${i}]`, String(id)));
        (form.theTagIds || []).forEach((id, i) => fd.append(`TheTagIds[${i}]`, String(id)));

        return fd;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) return;
        if (!validate()) return;

        const fd = buildFormData();
        await onSubmit?.(fd);
    };

    // helper: đọc multi-select -> array int
    const readMultiSelectIds = (e) => {
        const arr = Array.from(e.target.selectedOptions || [])
            .map((o) => Number(o.value))
            .filter((n) => Number.isFinite(n));
        return arr;
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div
                style={{
                    overflowY: "auto",
                    paddingRight: 6,
                    flex: 1,
                    maxHeight: "70vh", // hoặc 520
                }}
            >
                <Input
                    label="Tên phim"
                    required
                    value={form.tenP}
                    onChange={(e) => setField("tenP", e.target.value)}
                    error={errors.tenP}
                    placeholder="Ví dụ: Interstellar"
                    disabled={readOnly || loading}
                />

                <Textarea
                    label="Mô tả"
                    value={form.moTaP}
                    onChange={(e) => setField("moTaP", e.target.value)}
                    placeholder="Mô tả ngắn..."
                    rows={4}
                    disabled={readOnly || loading}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Select
                        label="Quốc gia"
                        required
                        value={form.quocGiaId}
                        onChange={(e) => setField("quocGiaId", Number(e.target.value) || "")}
                        options={quocGiaOptions}
                        error={errors.quocGiaId}
                        disabled={readOnly || loading}
                    />

                    <Select
                        label="Ngôn ngữ"
                        required
                        value={form.ngonNguId}
                        onChange={(e) => setField("ngonNguId", Number(e.target.value) || "")}
                        options={ngonNguOptions}
                        error={errors.ngonNguId}
                        disabled={readOnly || loading}
                    />
                </div>

                <Input
                    label="Tên công ty sản xuất"
                    required
                    value={form.tenCTSXP}
                    onChange={(e) => setField("tenCTSXP", e.target.value)}
                    error={errors.tenCTSXP}
                    placeholder="Ví dụ: Warner Bros."
                    disabled={readOnly || loading}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Input
                        label="Ngày phát hành"
                        required
                        type="date"
                        value={form.ngayPhatHanhP}
                        onChange={(e) => setField("ngayPhatHanhP", e.target.value)}
                        error={errors.ngayPhatHanhP}
                        disabled={readOnly || loading}
                    />

                    <Input
                        label="Thời lượng"
                        required
                        value={form.thuoiLuongP}
                        onChange={(e) => setField("thuoiLuongP", e.target.value)}
                        error={errors.thuoiLuongP}
                        placeholder="Ví dụ: 148 phút"
                        disabled={readOnly || loading}
                    />
                </div>

                <Input
                    label="Nguồn phim"
                    required
                    value={form.nguonP}
                    onChange={(e) => setField("nguonP", e.target.value)}
                    error={errors.nguonP}
                    placeholder="Ví dụ: https://..."
                    disabled={readOnly || loading}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Input
                        label="Số tập"
                        value={form.soTapP}
                        onChange={(e) => setField("soTapP", e.target.value)}
                        disabled={readOnly || loading}
                        placeholder="Ví dụ: 12"
                    />
                    <Input
                        label="Trailer"
                        value={form.traiLerP}
                        onChange={(e) => setField("traiLerP", e.target.value)}
                        disabled={readOnly || loading}
                        placeholder="Link trailer..."
                    />
                </div>

                {/* Multi-select native */}
                <MultiSelectAdd
                    label="Thể loại"
                    options={theLoaiOptions}
                    value={form.theLoaiIds}
                    onChange={(next) => setField("theLoaiIds", next)}
                    placeholder="Chọn thể loại..."
                    disabled={readOnly || loading}
                />

                <MultiSelectAdd
                    label="Đạo diễn"
                    options={daoDienOptions}
                    value={form.daoDienIds}
                    onChange={(next) => setField("daoDienIds", next)}
                    placeholder="Chọn đạo diễn..."
                    disabled={readOnly || loading}
                />

                <MultiSelectAdd
                    label="Diễn viên"
                    options={dienVienOptions}
                    value={form.dienVienIds}
                    onChange={(next) => setField("dienVienIds", next)}
                    placeholder="Chọn diễn viên..."
                    disabled={readOnly || loading}
                />

                <MultiSelectAdd
                    label="Thẻ tag"
                    options={theTagOptions}
                    value={form.theTagIds}
                    onChange={(next) => setField("theTagIds", next)}
                    placeholder="Chọn thẻ tag..."
                    disabled={readOnly || loading}
                />

                {/* Upload Avatar */}
                <Upload
                    label="Avatar phim"
                    required={isCreate}
                    value={form.avatarP}
                    onChange={(file) => setField("avatarP", file)}
                    error={errors.avatarP}
                    accept="image/*"
                />

                {/* hiển thị ảnh cũ (edit/view) */}
                {!form.avatarP && oldAvatarUrl ? (
                    <div style={{ marginTop: 8 }}>
                        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Avatar hiện tại</div>
                        <img src={oldAvatarUrl} alt="avatar-old" style={{ maxWidth: 240, borderRadius: 8 }} />
                    </div>
                ) : null}

                {/* hiển thị preview ảnh mới */}
                {avatarPreview ? (
                    <div style={{ marginTop: 8 }}>
                        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Avatar mới</div>
                        <img src={avatarPreview} alt="avatar-preview" style={{ maxWidth: 240, borderRadius: 8 }} />
                    </div>
                ) : null}

                {/* Upload Poster */}
                <Upload
                    label="Poster phim"
                    required={isCreate}
                    value={form.avatarPoster}
                    onChange={(file) => setField("avatarPoster", file)}
                    error={errors.avatarPoster}
                    accept="image/*"
                />

                {!form.avatarPoster && oldPosterUrl ? (
                    <div style={{ marginTop: 8 }}>
                        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Poster hiện tại</div>
                        <img src={oldPosterUrl} alt="poster-old" style={{ maxWidth: 240, borderRadius: 8 }} />
                    </div>
                ) : null}

                {posterPreview ? (
                    <div style={{ marginTop: 8 }}>
                        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Poster mới</div>
                        <img src={posterPreview} alt="poster-preview" style={{ maxWidth: 240, borderRadius: 8 }} />
                    </div>
                ) : null}
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: "1px solid rgba(0,0,0,0.08)",
                    background: "#fff",
                    position: "sticky",
                    bottom: 0,
                }}
            >
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

function toDateInput(value) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}
