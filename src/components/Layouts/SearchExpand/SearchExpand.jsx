import "./SearchExpand.scss";

export default function SearchExpand({ value, onChange, onSubmit }) {
    return (
        <form
            className="search"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit?.(value ?? "");
            }}
        >
            <div className="search__wrapper">
                <input
                    type="text"
                    className="search__field"
                    placeholder="Tìm kiếm"
                    value={value ?? ""}
                    onChange={(e) => onChange?.(e.target.value)}
                />

                <button type="submit" className="search__icon" aria-label="Search">
                    🔍
                </button>
            </div>
        </form>
    );
}
