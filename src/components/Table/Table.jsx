import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import '../Admin-board/Admin-board.scss';
import './Card.scss';

const Table = ({
    columns,
    data,
    loading = false,
    itemsPerPage = 10,
    actions = ['view', 'edit', 'delete'],
    onAction
}) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
        if (!Array.isArray(data)) return []; // Kiểm tra nếu `data` không phải là mảng, trả về mảng rỗng
        if (!sortConfig.key) return data;

        const sorted = [...data].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [data, sortConfig]);

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return Array.isArray(sortedData) ? sortedData.slice(start, start + itemsPerPage) : []; // Kiểm tra lại nếu `sortedData` là mảng
    }, [sortedData, currentPage, itemsPerPage]);

    return (
        <div className="table-wrapper">
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} onClick={() => handleSort(col.accessor)}>
                                {col.header}
                                {sortConfig.key === col.accessor && (
                                    <span> {sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                        ))}
                        {actions.length > 0 && <th>Thao tác</th>}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length + (actions.length ? 1 : 0)}>
                                Đang tải dữ liệu...
                            </td>
                        </tr>
                    ) : paginatedData.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (actions.length ? 1 : 0)}>
                                Không có dữ liệu.
                            </td>
                        </tr>
                    ) : (
                        paginatedData.map((row, i) => (
                            <tr key={i}>
                                {columns.map((col, j) => (
                                    <td key={j}>
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                                {actions.length > 0 && (
                                    <td>
                                        {actions.includes('view') && (
                                            <button className="button-crud" onClick={() => onAction('view', row)}>Xem</button>
                                        )}
                                        {actions.includes('edit') && (
                                            <>
                                                {actions.includes('view') && ' | '}
                                                <button className="button-crud" onClick={() => onAction('edit', row)}>Sửa</button>
                                            </>
                                        )}
                                        {actions.includes('delete') && (
                                            <>
                                                {(actions.includes('view') || actions.includes('edit')) && ' | '}
                                                <button className="button-crud" onClick={() => onAction('delete', row)}>Xóa</button>
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {!loading && totalPages > 1 && (
                <div className="table-pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

Table.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            header: PropTypes.string.isRequired,
            accessor: PropTypes.string.isRequired,
            render: PropTypes.func
        })
    ).isRequired,
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    itemsPerPage: PropTypes.number,
    actions: PropTypes.arrayOf(PropTypes.oneOf(['view', 'edit', 'delete'])),
    onAction: PropTypes.func.isRequired
};

export default Table;
