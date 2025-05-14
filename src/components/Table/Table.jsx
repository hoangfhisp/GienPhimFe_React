import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import '../Layouts/Admin-board/Admin-board.scss';
import './Card.scss';

const TableRow = memo(({ row, columns, actions, onAction }) => {
    return (
        <tr>
            {columns.map((col, j) => (
                <td key={`col-${j}`}>
                    {col.render ? col.render(row) : row[col.accessor]}
                </td>
            ))}
            {actions.length > 0 && (
                <td>
                    {actions.map((action, idx) => (
                        <React.Fragment key={action}>
                            {idx > 0 && ' | '}
                            <button
                                className="button-crud"
                                onClick={() => onAction(action, row)}
                            >
                                {action === 'view' ? 'Xem' : action === 'edit' ? 'Sửa' : 'Xóa'}
                            </button>
                        </React.Fragment>
                    ))}
                </td>
            )}
        </tr>
    );
});

const Table = ({
    columns,
    data,
    loading = false,
    totalItems = 0,
    itemsPerPage = 10,
    currentPage = 1,
    actions = ['view', 'edit', 'delete'],
    onAction,
    onPageChange,
    onSort,
    emptyText = 'Không có dữ liệu.',
    sortable = true,
    sortConfig = null
}) => {
    const [localSortConfig, setLocalSortConfig] = useState(sortConfig);

    // Thêm hàm handlePageChange để xử lý chuyển trang
    const handlePageChange = (newPage) => {
        if (onPageChange) {
            onPageChange(newPage);
        }
    };

    const handleSort = (key) => {
        if (onSort) {
            onSort(key);
        } else {
            let direction = 'asc';
            if (localSortConfig?.key === key && localSortConfig?.direction === 'asc') {
                direction = 'desc';
            }
            setLocalSortConfig({ key, direction });
        }
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            pages.push(
                <button
                    key={1}
                    className="page-btn"
                    onClick={() => handlePageChange(1)}
                >
                    1
                </button>
            );
            if (startPage > 2) pages.push(<span key="start-ellipsis">...</span>);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    className={`page-btn ${currentPage === i ? 'active' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push(<span key="end-ellipsis">...</span>);
            pages.push(
                <button
                    key={totalPages}
                    className="page-btn"
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </button>
            );
        }

        return (
            <div className="table-pagination">
                <button
                    className="page-btn"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    &lt;
                </button>
                {pages}
                <button
                    className="page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    &gt;
                </button>
            </div>
        );
    };

    const getSortIndicator = (key) => {
        const config = sortConfig || localSortConfig;
        if (config?.key === key) {
            return config.direction === 'asc' ? ' ▲' : ' ▼';
        }
        return null;
    };

    return (
        <div className="table-wrapper">
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        {columns.map((col, idx) => (
                            <th
                                key={`th-${idx}`}
                                onClick={() => sortable && handleSort(col.accessor)}
                                style={{ cursor: sortable ? 'pointer' : 'default' }}
                            >
                                {col.header}
                                {sortable && getSortIndicator(col.accessor)}
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
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (actions.length ? 1 : 0)}>
                                {emptyText}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, i) => (
                            <TableRow
                                key={`row-${i}`}
                                row={row}
                                columns={columns}
                                actions={actions}
                                onAction={onAction}
                            />
                        ))
                    )}
                </tbody>
            </table>
            {!loading && totalPages > 1 && renderPagination()}
        </div>
    );
};

Table.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            header: PropTypes.string.isRequired,
            accessor: PropTypes.string.isRequired,
            render: PropTypes.func,
        })
    ).isRequired,
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    totalItems: PropTypes.number,
    itemsPerPage: PropTypes.number,
    currentPage: PropTypes.number,
    actions: PropTypes.arrayOf(PropTypes.oneOf(['view', 'edit', 'delete'])),
    onAction: PropTypes.func.isRequired,
    onPageChange: PropTypes.func,
    onSort: PropTypes.func,
    emptyText: PropTypes.string,
    sortable: PropTypes.bool,
    sortConfig: PropTypes.shape({
        key: PropTypes.string,
        direction: PropTypes.oneOf(['asc', 'desc']),
    }),
};

export default Table;