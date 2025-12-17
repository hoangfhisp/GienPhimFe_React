import { useEffect, useMemo, useState } from "react";
import Input from "../../FormControls/Input";
import Select from "../../FormControls/Select";
import Upload from "../../FormControls/Upload";

const emptyForm = {
    tapId: "",
    phimId: "",
    tenTap: "",
    slugTap: "",
    tenFile: "",
    linkChinh: null, // File | null
    linkPhu: "",
};

export default function TapPhimForm({
    initialValues, // null | { tapId?, phimId, tenTap, slugTap, tenFile, linkPhu, linkChinhUrl? }
    onSubmit, // (FormData) => void | Promise
    onCancel,
    submitText = "Lưu",
    loading = false,
    readOnly = false,
    hideSubmit = false,

    // options cho chọn phim: [{value, label}]
    phimOptions = [],

    // (tuỳ bạn) nếu edit/view có link file cũ để hiển thị
    oldLinkChinhUrl = "",
}) {
    const isCreate = !initialValues?.tapId;

    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    // preview file video (nếu muốn). Nếu LinkChinh là video thì accept="video/*"
    const fileName = useMemo(() => form.linkChinh?.name || "", [form.linkChinh]);

    useEffect(() => {
        setForm({
            tapId: initialValues?.tapId || "",
            phimId: initialValues?.phimId ?? "",
            tenTap: initialValues?.tenTap || "",
            slugTap: initialValues?.slugTap || "",
            tenFile: initialValues?.tenFile || "",
            linkChinh: null, // khi load edit/view không set File, chỉ show oldLinkChinhUrl nếu có
            linkPhu: initialValues?.linkPhu || "",
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
        if (!form.phimId) e.phimId = "Vui lòng chọn phim";
        if (!form.tenTap.trim()) e.tenTap = "Vui lòng nhập tên tập";
        if (!form.slugTap.trim()) e.slugTap = "Vui lòng nhập slug tập";
        if (!form.tenFile.trim()) e.tenFile = "Vui lòng nhập tên file";
        if (!form.linkPhu.trim()) e.linkPhu = "Vui lòng nhập link phụ";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) return;
        if (!validate()) return;

        const fd = new FormData();

        // update thường cần tapId (tuỳ TapPhimUpdateDTO của bạn)
        if (!isCreate) fd.append("tapId", String(form.tapId));

        fd.append("phimId", String(form.phimId));
        fd.append("tenTap", form.tenTap.trim());
        fd.append("slugTap", form.slugTap.trim());
        fd.append("tenFile", form.tenFile.trim());
        fd.append("linkPhu", form.linkPhu.trim());

        // LinkChinh là IFormFile? => chỉ append nếu user chọn file
        if (form.linkChinh) {
            fd.append("linkChinh", form.linkChinh);
        }

        await onSubmit?.(fd);
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
            {/* ✅ vùng cuộn nhẹ (nếu modal nhỏ) */}
            <div style={{ overflowY: "auto", flex: 1, maxHeight: "70vh", paddingRight: 6 }}>
                <Select
                    label="Chọn phim"
                    required
                    value={form.phimId}
                    onChange={(e) => setField("phimId", Number(e.target.value) || "")}
                    options={phimOptions}
                    error={errors.phimId}
                    disabled={readOnly || loading}
                    placeholder="-- Chọn phim --"
                />

                <Input
                    label="Tên tập"
                    required
                    value={form.tenTap}
                    onChange={(e) => setField("tenTap", e.target.value)}
                    error={errors.tenTap}
                    placeholder="Ví dụ: Tập 1"
                    disabled={readOnly || loading}
                />

                <Input
                    label="Slug tập"
                    required
                    value={form.slugTap}
                    onChange={(e) => setField("slugTap", e.target.value)}
                    error={errors.slugTap}
                    placeholder="Ví dụ: tap-1"
                    disabled={readOnly || loading}
                />

                <Input
                    label="Tên file"
                    required
                    value={form.tenFile}
                    onChange={(e) => setField("tenFile", e.target.value)}
                    error={errors.tenFile}
                    placeholder="Ví dụ: interstellar_ep01.mp4"
                    disabled={readOnly || loading}
                />

                <Input
                    label="Link phụ"
                    required
                    value={form.linkPhu}
                    onChange={(e) => setField("linkPhu", e.target.value)}
                    error={errors.linkPhu}
                    placeholder="Ví dụ: https://..."
                    disabled={readOnly || loading}
                />

                {/* LinkChinh là file (IFormFile?) */}
                <Upload
                    label="Link chính (file)"
                    required={false} // dto là IFormFile? nên không bắt buộc
                    value={form.linkChinh}
                    onChange={(file) => setField("linkChinh", file)}
                    error={errors.linkChinh}
                    accept="video/*" // nếu bạn upload video; nếu upload mọi file thì "*/*"
                />

                {/* Hiển thị file đã chọn */}
                {fileName ? (
                    <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>
                        File đã chọn: <b>{fileName}</b>
                    </div>
                ) : null}

                {/* Hiển thị link/file cũ (edit/view) */}
                {!form.linkChinh && oldLinkChinhUrl ? (
                    <div style={{ marginTop: 8, fontSize: 12, opacity: 0.85 }}>
                        Link chính hiện tại:{" "}
                        <a href={oldLinkChinhUrl} target="_blank" rel="noreferrer">
                            Mở file
                        </a>
                    </div>
                ) : null}
            </div>

            {/* ✅ footer cố định */}
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
