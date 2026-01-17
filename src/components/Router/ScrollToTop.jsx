import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scroll tới đầu trang hoặc tới phần tử có id tương ứng với hash
export default function ScrollToTop() {
    const { pathname, hash } = useLocation();
    useEffect(() => {
        // Nếu có hash, cuộn tới phần tử tương ứng
        if (hash) {
            const el = document.querySelector(hash);
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                return;
            }
        }
        // Nếu không có hash, cuộn về đầu trang
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname, hash]);

    return null;
}
