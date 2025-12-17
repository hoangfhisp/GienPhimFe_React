export function resolveImageUrl(src) {
    if (!src) return "";

    const s = String(src).trim();
    if (!s) return "";

    // URL tuyệt đối (CDN, external)
    if (/^https?:\/\//i.test(s)) return s;

    // DB lưu relative path: images/films/xxx.jpg
    const base = (process.env.REACT_APP_GIENPHIM_BE_URL || "").replace(/\/$/, "");
    return `${base}/${s}`;
}