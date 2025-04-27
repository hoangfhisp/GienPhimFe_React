// Card.jsx
import React from 'react';
import './Card.css';

const Card = ({ action, movie, columns, onClose, onSave, onDelete }) => {
    const renderCardContent = () => {
      switch (action) {
        case 'view':
          return (
            <div>
              <h3>Xem chi tiết</h3>
              {columns.map((col) => (
                <div key={col.accessor}>
                  <strong>{col.header}:</strong> {movie[col.accessor]}
                </div>
              ))}
            </div>
          );
  
        case 'edit':
          return (
            <div>
              <h3>Chỉnh sửa thông tin</h3>
              <form>
                {columns.map((col) => (
                  <div key={col.accessor}>
                    <label>{col.header}:</label>
                    <input
                      type="text"
                      value={movie[col.accessor]}
                      onChange={(e) => (movie[col.accessor] = e.target.value)}
                    />
                  </div>
                ))}
                <button type="button" onClick={() => onSave(movie)}>
                  Lưu thay đổi
                </button>
              </form>
            </div>
          );
  
        case 'create':
          return (
            <div>
              <h3>Thêm phim mới</h3>
              <form>
                {columns.map((col) => (
                  <div key={col.accessor}>
                    <label>{col.header}:</label>
                    <input
                      type="text"
                      value={movie[col.accessor]}
                      onChange={(e) => (movie[col.accessor] = e.target.value)}
                    />
                  </div>
                ))}
                <button type="button" onClick={() => onSave(movie)}>
                  Thêm phim
                </button>
              </form>
            </div>
          );
  
        case 'delete':
          return (
            <div>
              <h3>Xoá phim</h3>
              <p>Bạn có chắc muốn xoá bộ phim {movie.TenP}?</p>
              <button onClick={() => onDelete(movie)}>Xoá</button>
              <button onClick={onClose}>Hủy</button>
            </div>
          );
  
        default:
          return null;
      }
    };
  
    return (
      <div className="card-overlay">
        {renderCardContent()}
      </div>
    );
  };
  
  export default Card;