export default function useScrollTo() {
    // Cuộn về đầu trang
    const scrollToTop = (smooth = true) => {
        window.scrollTo({
            top: 0,
            behavior: smooth ? "smooth" : "auto",
        });
    };

    // Cuộn tới phần tử có id tương ứng
    const scrollToElement = (id, offset = 0) => {
        const el = document.getElementById(id);
        if (!el) return;

        const y =
            el.getBoundingClientRect().top +
            window.pageYOffset -
            offset;

        window.scrollTo({
            top: y,
            behavior: "smooth",
        });
    };
    
    // Cuộn tới phần tử tham chiếu
    const scrollToRef = (ref, offset = 0) => {
        if (!ref?.current) return;

        const y =
            ref.current.getBoundingClientRect().top +
            window.pageYOffset -
            offset;

        window.scrollTo({
            top: y,
            behavior: "smooth",
        });
    };

    return {
        scrollToTop,
        scrollToElement,
        scrollToRef,
    };
}
