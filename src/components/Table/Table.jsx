import React, { useState, useMemo } from 'react';
import '../Admin-board/Admin-board.scss';

const Table = ({ columns, data, loading = false, itemsPerPage = 10, onEdit, onDelete, onView }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (accessor) => {
    if (!accessor) return;
    setSortConfig((prev) => {
      if (prev.key === accessor) {
        return {
          key: accessor,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key: accessor, direction: 'asc' };
    });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue === undefined || bValue === undefined) return 0;
      if (typeof aValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
    return sorted;
  }, [data, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead className="thead-dark">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                onClick={() => handleSort(col.accessor)}
                style={{ cursor: col.accessor ? 'pointer' : 'default' }}
              >
                {col.header}
                {sortConfig.key === col.accessor && (
                  <span> {sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
            ))}
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + 1} style={{ textAlign: 'center' }}>
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : paginatedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} style={{ textAlign: 'center' }}>
                Không có phim nào.
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
                <td>
                  <button onClick={() => onView(row)}>Xem</button> |{' '}
                  <button onClick={() => onEdit(row)}>Chỉnh sửa</button> |{' '}
                  <button onClick={() => onDelete(row)}>Xóa</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Phân trang nếu có nhiều trang */}
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

export default Table;
