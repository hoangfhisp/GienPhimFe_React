import React from 'react';
import { Link } from 'react-router-dom';

const CrudTable = ({ data, onDelete, onEdit, onView, entityType }) => {
  const columns = [
    { header: 'Tên', accessor: 'name' },
    { header: 'Mô tả', accessor: 'description' },
    {
      header: 'Hành động',
      render: (row) => (
        <>
          <button onClick={() => onView(row)}>Xem chi tiết</button> |{' '}
          <button onClick={() => onEdit(row)}>Chỉnh sửa</button> |{' '}
          <button onClick={() => onDelete(row.id)}>Xóa</button>
        </>
      ),
    },
  ];

  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.header}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            {columns.map((col) => (
              <td key={col.accessor}>{col.render ? col.render(item) : item[col.accessor]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CrudTable;
