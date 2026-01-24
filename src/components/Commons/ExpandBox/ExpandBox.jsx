import './ExpandBox.scss';

export default function ExpandBox({
    open,
    title = "Nội dung",
    children,
    onClose,
}) {
    if (!open) return null;

    return (
        <div className="expandbox-overlay" onClick={onClose}>
            <div className="expandbox" onClick={(e) => e.stopPropagation()}>
                <div className="expandbox-header">
                    <h3>{title}</h3>
                    <span className="expandbox-close-btn" onClick={onClose}>✕</span>
                </div>

                <div className="expandbox-content">
                    {children}
                </div>
            </div>
        </div>
    );
}
