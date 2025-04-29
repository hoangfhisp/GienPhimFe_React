import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Card.scss';

const Card = ({ action, data, columns, onClose, onSave, onDelete }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        // Khởi tạo form data khi nhận prop mới
        setFormData(data || columns.reduce((acc, col) => {
            acc[col.accessor] = '';
            return acc;
        }, {}));
    }, [data, columns]);

    const handleInputChange = (e, accessor) => {
        setFormData(prev => ({
            ...prev,
            [accessor]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="card-overlay">
            <div className="card-modal">
                <button className="close-btn" onClick={onClose}>×</button>

                {action === 'view' && (
                    <div className="view-mode">
                        <h3>Xem chi tiết</h3>
                        {columns.map(col => (
                            <div key={col.accessor} className="field">
                                <label>{col.header}:</label>
                                <div>{col.render ? col.render(data) : data[col.accessor]}</div>
                            </div>
                        ))}
                    </div>
                )}

                {(action === 'edit' || action === 'create') && (
                    <form onSubmit={handleSubmit} className="edit-form">
                        <h3>{action === 'edit' ? 'Chỉnh sửa' : 'Thêm mới'}</h3>
                        {columns.map(col => (
                            <div key={col.accessor} className="form-group">
                                <label>{col.header}:</label>
                                <input
                                    type="text"
                                    value={formData[col.accessor] || ''}
                                    onChange={(e) => handleInputChange(e, col.accessor)}
                                />
                            </div>
                        ))}
                        <div className="form-actions">
                            <button type="submit" className="save-btn">
                                {action === 'edit' ? 'Lưu thay đổi' : 'Thêm mới'}
                            </button>
                            <button type="button" className="cancel-btn" onClick={onClose}>
                                Hủy
                            </button>
                        </div>
                    </form>
                )}

                {action === 'delete' && (
                    <div className="delete-confirm">
                        <h3>Xác nhận xóa</h3>
                        <p>Bạn có chắc muốn xóa bản ghi này?</p>
                        <div className="actions">
                            <button className="delete-btn" onClick={() => onDelete(data)}>
                                Xóa
                            </button>
                            <button className="cancel-btn" onClick={onClose}>
                                Hủy
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

Card.propTypes = {
    action: PropTypes.oneOf(['view', 'edit', 'create', 'delete']).isRequired,
    data: PropTypes.object,
    columns: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onDelete: PropTypes.func
};

export default Card;