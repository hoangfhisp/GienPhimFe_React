import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import './Card.scss';

const Card = ({ action, data, formFields = [], onClose, onSave, onDelete }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (action === 'edit' || action === 'view' || action === 'delete') {
            const normalizedData = { ...data };
            console.log('Data received:', data);

            formFields.forEach(field => {
                if (field.type === 'select' && field.multiple && Array.isArray(normalizedData[field.name])) {
                    normalizedData[field.name] = normalizedData[field.name].map(item =>
                        typeof item === 'object' && item !== null ? item.value : item
                    );
                }
            });
            console.log('Normalized data:', normalizedData);
            setFormData(normalizedData || {});
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

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0]; // Lấy file người dùng đã chọn
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    [fieldName]: reader.result, // Lưu giá trị base64 (hoặc bạn có thể xử lý upload khác)
                });
            };
            reader.readAsDataURL(file); // Chuyển file thành base64 để hiển thị ảnh
        }
    };

    // Hàm để hiển thị thời gian hiện tại cho "Create"
    const getCurrentTime = () => {
        return new Date().toLocaleString(); // Hoặc có thể dùng Date.now() nếu chỉ cần thời gian chính xác (không cần định dạng)
    };

    return (
        <div className="card-overlay">
            <div className="card-modal">
                {action === 'view' && (
                    <div className="view-mode">
                        <h3>Xem chi tiết</h3>
                        {formFields.map(field => (
                            <div key={field.name} className="form-group">
                                <label>{field.label}:</label>
                                <div className="field-value">
                                    {field.type === 'select' && field.multiple ? (
                                        (formData[field.name] || [])
                                            .map(item => {
                                                // Nếu item là object { value, label } thì lấy label
                                                if (typeof item === 'object' && item !== null) {
                                                    return item.label;
                                                }

                                                // Nếu item là ID, thì tìm trong danh sách options
                                                const option = field.options.find(opt => opt.value === String(item));
                                                return option ? option.label : item;
                                            })
                                            .filter(label => label != null)
                                            .join(', ') || 'Null'
                                    ) : field.type === 'select' ? (
                                        (() => {
                                            const val = formData[field.name];
                                            const value = typeof val === 'object' && val !== null ? val.value : val;
                                            return field.options.find(opt => String(opt.value) === String(value))?.label || 'Null';
                                        })()
                                    ) : field.type === 'file' ? (
                                        formData[field.name] ? <img src={formData[field.name]} alt={field.label} width={100} /> : 'Null'
                                    ) : (
                                        formData[field.name] !== undefined && formData[field.name] !== null
                                            ? formData[field.name].toString()
                                            : 'Null'
                                    )}
                                </div>
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
                                        value={formData[field.name] !== undefined && formData[field.name] !== null ? formData[field.name] : ''}

                                        onChange={(e) => handleInputChange(e, field.name)}
                                    />
                                ) : field.type === 'select' && field.multiple ? (
                                    <Select
                                        isMulti
                                        name={field.name}
                                        options={field.options}
                                        value={
                                            (formData[field.name] || []).map(val => {
                                                const value = typeof val === 'object' && val !== null ? val.value : val;
                                                return field.options.find(opt => String(opt.value) === String(value));
                                            }).filter(Boolean)
                                        }
                                        onChange={(selected) => handleMultiSelectChange(selected, field.name)}
                                        placeholder={`+ Chọn ${field.label.toLowerCase()}`}
                                    />


                                ) : field.type === 'select' ? (
                                    <Select
                                        name={field.name}
                                        options={field.options}
                                        value={
                                            field.options.find(opt =>
                                            String(opt.value) === String(
                                                Array.isArray(formData[field.name])
                                                ? formData[field.name][0]
                                                : formData[field.name]
                                            )
                                            ) || null
                                        }
                                        onChange={(selected) => handleSingleSelectChange(selected, field.name)}
                                        placeholder={`-- Chọn ${field.label.toLowerCase()} --`}
                                        />

                                ) : field.type === 'file' ? (
                                    <>
                                        {formData[field.name] && (
                                            <img src={formData[field.name]} alt={field.label} width={100} />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, field.name)}
                                        />
                                    </>
                                ) : field.name === 'thoiGianTao' || field.name === 'thoiGianCapNhat' ? (
                                    <input
                                        type="text"
                                        value={action === 'create' ? getCurrentTime() : (formData[field.name] !== undefined && formData[field.name] !== null ? formData[field.name] : '')}
                                        readOnly
                                    />
                                ) : (
                                    <input
                                        type={field.type || 'text'}
                                        value={formData[field.name] !== undefined && formData[field.name] !== null ? formData[field.name] : ''}
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
