import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import './Card.scss';

const Card = ({ action, data, formFields = [], columns, onClose, onSave, onDelete }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (action === 'edit' || action === 'view' || action === 'delete') {
            setFormData(data || {});
        } else {
            const initialForm = formFields.reduce((acc, field) => {
                acc[field.name] = field.multiple ? [] : '';
                return acc;
            }, {});
            setFormData(initialForm);
        }
    }, [data, formFields, action]);

    const handleInputChange = (e, name) => {
        setFormData(prev => ({
            ...prev,
            [name]: e.target.value
        }));
    };

    const handleMultiSelectChange = (selectedOptions, fieldName) => {
        const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
        setFormData(prev => ({ ...prev, [fieldName]: values }));
    };

    const handleSingleSelectChange = (selectedOption, fieldName) => {
        setFormData(prev => ({ ...prev, [fieldName]: selectedOption ? selectedOption.value : '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="card-overlay">
            <div className="card-modal">
                {action === 'view' && (
                    <div className="view-mode">
                        <h3>Xem chi tiết</h3>
                        {columns.map(col => (
                            <div key={col.accessor} className="field">
                                <label>{col.header}:</label>
                                <div>{col.render ? col.render(data) : data[col.accessor]}</div>
                            </div>
                        ))}
                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={onClose}>
                                Đóng
                            </button>
                        </div>
                    </div>
                )}

                {(action === 'edit' || action === 'create') && (
                    <form onSubmit={handleSubmit} className="edit-form">
                        <h3>{action === 'edit' ? 'Chỉnh sửa' : 'Thêm mới'}</h3>
                        {formFields.map(field => (
                            <div key={field.name} className="form-group">
                                <label>{field.label}:</label>

                                {field.type === 'textarea' ? (
                                    <textarea
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleInputChange(e, field.name)}
                                    />
                                ) : field.type === 'select' && field.multiple ? (
                                    <Select
                                        isMulti
                                        name={field.name}
                                        options={field.options}
                                        value={field.options.filter(opt =>
                                            (formData[field.name] || []).map(String).includes(String(opt.value))
                                        )}
                                        onChange={(selected) => handleMultiSelectChange(selected, field.name)}
                                        placeholder={`+ Chọn ${field.label.toLowerCase()}`}
                                    />
                                ) : field.type === 'select' ? (
                                    <Select
                                        name={field.name}
                                        options={field.options}
                                        value={field.options.find(opt => opt.value === formData[field.name]) || null}
                                        onChange={(selected) => handleSingleSelectChange(selected, field.name)}
                                        placeholder={`-- Chọn ${field.label.toLowerCase()} --`}
                                    />
                                ) : (
                                    <input
                                        type={field.type || 'text'}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleInputChange(e, field.name)}
                                    />
                                )}
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
                        <div className="form-actions">
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
    formFields: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onDelete: PropTypes.func
};

export default Card;
