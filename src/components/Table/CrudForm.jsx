import React, { useEffect, useState } from 'react';

const CrudForm = ({ formMode, movie, columns, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(movie || {});

  useEffect(() => {
    if (movie) {
      setFormData(movie);
    }
  }, [movie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Lưu thông tin đã chỉnh sửa hoặc thêm mới
  };

  return (
    <form onSubmit={handleSubmit}>
      {columns.map((column) => {
        // Kiểm tra và loại trừ các cột có tên "Tạo lúc" và "Cập nhật"
        if (column.header === 'Thao tác' || column.header === 'Tạo lúc' || column.header === 'Cập nhật') {
          return null;
        }

        return (
          <div key={column.accessor}>
            <label>{column.header}</label>
            <input
              type={column.header === 'Thời lượng' ? 'number' : 'text'}  // Điều chỉnh cho trường số (ví dụ: thời lượng)
              name={column.accessor}
              value={formData[column.accessor] || ''}
              onChange={handleChange}
              placeholder={column.header}
              disabled={formMode === 'view'} // Nếu là chế độ xem, không cho phép chỉnh sửa
            />
          </div>
        );
      })}
      <div>
        <button type="submit" disabled={formMode === 'view'}>Lưu</button>
        <button type="button" onClick={onClose}>Hủy</button>
      </div>
    </form>
  );
};

export default CrudForm;
