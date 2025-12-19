import { useEffect, useMemo, useState } from "react";
import Input from "../../FormControls/Input";
import Textarea from "../../FormControls/Textarea";
import Select from "../../FormControls/Select";
import Upload from "../../FormControls/Upload";

const emptyForm = {
    userName: "",
    nameND: "",
    gioiTinh: "",
    moTa: "",
    phoneNumber: "",
    avatarND: null, // File | null
};

export default function NguoiDungForm({
    initialValues, // user object
    onSubmit, // (FormData) => Promise
    onCancel,
    submitText = "Cập nhật",
    loading = false,
    readOnly = false,
    hideSubmit = false,

    oldAvatarUrl = "",
}) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    const gioiTinhOptions = useMemo(
        () => [
            { value: 0, label: "Khác" },
            { value: 1, label: "Nam" },
            { value: 2, label: "Nữ" },
        ],
        []
    );

    useEffect(() => {
        setForm({
            userName: initialValues?.userName || "",
            nameND: initialValues?.nameND || "",
            gioiTinh:
                initialValues?.gioiTinh === 0 || initialValues?.gioiTinh
                    ? Number(initialValues.gioiTinh)
                    : "",
            moTa: initialValues?.mota || "",
            phoneNumber: initialValues?.phoneNumber || "",
            avatarND: null,
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
        if (!form.userName.trim()) e.userName = "UserName là bắt buộc";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate() || readOnly) return;

        const fd = new FormData();
        fd.append("UserName", form.userName.trim());
        fd.append("NameND", form.nameND || "");
        fd.append("MoTa", form.moTa || "");
        fd.append("PhoneNumber", form.phoneNumber || "");

        if (form.gioiTinh !== "") {
            fd.append("GioiTinh", String(form.gioiTinh));
        }

        if (form.avatarND instanceof File) {
            fd.append("AvatarND", form.avatarND);
        }

        await onSubmit?.(fd);
    };

    const avatarPreview = useMemo(() => {
        if (!form.avatarND) return "";
        return URL.createObjectURL(form.avatarND);
    }, [form.avatarND]);

    return (
        <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
            <div style={{ overflowY: "auto", flex: 1, maxHeight: "70vh", paddingRight: 6 }}>
                <Input
                    label="UserName"
                    required
                    value={form.userName}
                    onChange={(e) => setField("userName", e.target.value)}
                    error={errors.userName}
                    disabled={readOnly || loading}
                />

                <Input
                    label="Tên hiển thị"
                    value={form.nameND}
                    onChange={(e) => setField("nameND", e.target.value)}
                    disabled={readOnly || loading}
                />

                <Select
                    label="Giới tính"
                    value={form.gioiTinh}
                    onChange={(e) =>
                        setField("gioiTinh", e.target.value === "" ? "" : Number(e.target.value))
                    }
                    options={gioiTinhOptions}
                    disabled={readOnly || loading}
                />

                <Input
                    label="Số điện thoại"
                    value={form.phoneNumber}
                    onChange={(e) => setField("phoneNumber", e.target.value)}
                    disabled={readOnly || loading}
                />

                <Textarea
                    label="Mô tả"
                    value={form.moTa}
                    onChange={(e) => setField("moTa", e.target.value)}
                    rows={3}
                    disabled={readOnly || loading}
                />

                <Upload
                    label="Avatar"
                    value={form.avatarND}
                    onChange={(file) => setField("avatarND", file)}
                    accept="image/*"
                />

                {!form.avatarND && oldAvatarUrl && (
                    <img
                        src={oldAvatarUrl}
                        alt="avatar-old"
                        style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 12 }}
                    />
                )}

                {avatarPreview && (
                    <img
                        src={avatarPreview}
                        alt="avatar-preview"
                        style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 12 }}
                    />
                )}
            </div>

            {!hideSubmit && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 10,
                        paddingTop: 12,
                        borderTop: "1px solid rgba(0,0,0,0.08)",
                    }}
                >
                    <button type="button" className="Btn Btn--ghost" onClick={onCancel}>
                        Đóng
                    </button>
                    <button type="submit" className="Btn Btn--primary" disabled={loading}>
                        {loading ? "Đang lưu..." : submitText}
                    </button>
                </div>
            )}
        </form>
    );
}
