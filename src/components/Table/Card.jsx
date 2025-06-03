import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import './Card.scss';

const Card = ({ action, data, formFields = [], onClose, onSave, onDelete }) => {
    const [formData, setFormData] = useState({});

    // Fixed useEffect để xử lý dữ liệu tốt hơn
    useEffect(() => {
        console.log('=== CARD COMPONENT INITIALIZATION ===');
        console.log('Action:', action);
        console.log('Data received:', data);
        console.log('Form fields:', formFields);

        if (action === 'edit' || action === 'view' || action === 'delete') {
            // Xử lý dữ liệu cho edit/view/delete
            const processedData = { ...data };

            // Xử lý từng field dựa trên formFields
            formFields.forEach(field => {
                const fieldName = field.name;
                let fieldValue = processedData[fieldName];

                console.log(`Processing field ${fieldName}:`, {
                    type: field.type,
                    multiple: field.multiple,
                    originalValue: fieldValue,
                    options: field.options
                });

                // Xử lý select multiple
                if (field.type === 'select' && field.multiple) {
                    if (Array.isArray(fieldValue)) {
                        // Đảm bảo values là array của strings/numbers
                        processedData[fieldName] = fieldValue.map(item =>
                            typeof item === 'object' && item !== null && 'value' in item
                                ? item.value
                                : String(item)
                        );
                    } else if (fieldValue != null) {
                        processedData[fieldName] = [String(fieldValue)];
                    } else {
                        processedData[fieldName] = [];
                    }
                }
                // Xử lý select single
                else if (field.type === 'select' && !field.multiple) {
                    if (Array.isArray(fieldValue)) {
                        processedData[fieldName] = fieldValue.length > 0 ? String(fieldValue[0]) : '';
                    } else if (fieldValue != null) {
                        processedData[fieldName] = String(fieldValue);
                    } else {
                        processedData[fieldName] = '';
                    }
                }
                // Xử lý checkbox
                else if (field.type === 'checkbox') {
                    processedData[fieldName] = Boolean(fieldValue);
                }
                // Xử lý number
                else if (field.type === 'number') {
                    processedData[fieldName] = fieldValue != null ? Number(fieldValue) : 0;
                }
                // Xử lý các loại khác
                else {
                    if (fieldValue == null) {
                        processedData[fieldName] = '';
                    } else {
                        processedData[fieldName] = String(fieldValue);
                    }
                }

                console.log(`Field ${fieldName} processed:`, processedData[fieldName]);
            });

            console.log('Final processed data for form:', processedData);
            setFormData(processedData);
        } else {
            // Create mode - khởi tạo form rỗng
            const initialForm = {};

            formFields.forEach(field => {
                if (field.type === 'select' && field.multiple) {
                    initialForm[field.name] = [];
                } else if (field.type === 'number') {
                    initialForm[field.name] = 0;
                } else if (field.type === 'checkbox') {
                    initialForm[field.name] = false;
                } else {
                    initialForm[field.name] = '';
                }
            });

            console.log('Initial form data for create:', initialForm);
            setFormData(initialForm);
        }
        console.log('=====================================');
    }, [data, formFields, action]);

    // Debug formData changes
    useEffect(() => {
        console.log('FormData state updated:', formData);
    }, [formData]);

    const handleInputChange = (e, name) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMultiSelectChange = (selectedOptions, fieldName) => {
        const values = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
        console.log(`Multi-select changed for ${fieldName}:`, values);
        setFormData(prev => ({ ...prev, [fieldName]: values }));
    };

    const handleSingleSelectChange = (selectedOption, fieldName) => {
        const value = selectedOption ? selectedOption.value : '';
        console.log(`Single-select changed for ${fieldName}:`, value);
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting form data:', formData);
        onSave(formData);
    };

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                [fieldName]: file,
            }));
        }
    };

    const getCurrentTime = () => {
        return new Date().toLocaleString('vi-VN');
    };

    // Helper function để get display value cho view mode
    const getDisplayValue = (field, value) => {
        if (value == null || value === '') return 'Chưa có dữ liệu';

        if (field.type === 'select' && field.multiple) {
            if (!Array.isArray(value)) return 'Chưa có dữ liệu';

            const displayValues = value.map(item => {
                const option = field.options?.find(opt => String(opt.value) === String(item));
                return option ? option.label : item;
            }).filter(Boolean);

            return displayValues.length > 0 ? displayValues.join(', ') : 'Chưa có dữ liệu';
        }

        if (field.type === 'select') {
            const option = field.options?.find(opt => String(opt.value) === String(value));
            return option ? option.label : value;
        }

        if (field.type === 'checkbox') {
            return value ? 'Có' : 'Không';
        }

        if (field.type === 'file') {
            if (!value) return 'Chưa có file';

            const isVideo = typeof value === 'string' && value.endsWith('.mp4');
            const isImage = typeof value === 'string' && /\.(jpg|jpeg|png|gif|webp)$/i.test(value);

            if (isVideo) {
                return (
                    <video width={320} height={180} controls>
                        <source src={value} type="video/mp4" />
                        Trình duyệt của bạn không hỗ trợ thẻ video.
                    </video>
                );
            } else if (isImage) {
                return <img src={value} alt={field.label} width={100} />;
            } else {
                return (
                    <a href={value} target="_blank" rel="noopener noreferrer">
                        Tải file
                    </a>
                );
            }
        }

        if (field.type === 'number') {
            return Number(value).toLocaleString('vi-VN');
        }

        return String(value);
    };

    return (
        <div className="card-overlay">
            <div className="card-modal">
                {action === 'view' && (
                    <div className="view-mode">
                        <h3>Xem chi tiết</h3>
                        {formFields.map(field => (
                            <div key={field.name} className="form-group">
                                <label><strong>{field.label}:</strong></label>
                                <div className="field-value">
                                    {getDisplayValue(field, formData[field.name])}
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
                        {formFields.map(field => {
                            console.log(`Rendering field ${field.name}:`, {
                                type: field.type,
                                value: formData[field.name],
                                options: field.options
                            });

                            return (
                                <div key={field.name} className="form-group">
                                    <label>{field.label}:</label>

                                    {field.type === 'textarea' ? (
                                        <textarea
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleInputChange(e, field.name)}
                                            placeholder={`Nhập ${field.label.toLowerCase()}`}
                                        />
                                    ) : field.type === 'select' && field.multiple ? (
                                        <Select
                                            isMulti
                                            name={field.name}
                                            options={field.options || []}
                                            value={
                                                Array.isArray(formData[field.name])
                                                    ? formData[field.name]
                                                        .map(val => {
                                                            return field.options?.find(opt => String(opt.value) === String(val));
                                                        })
                                                        .filter(Boolean)
                                                    : []
                                            }
                                            onChange={(selected) => handleMultiSelectChange(selected, field.name)}
                                            placeholder={`Chọn ${field.label.toLowerCase()}`}
                                            noOptionsMessage={() => "Không có tùy chọn"}
                                        />
                                    ) : field.type === 'select' ? (
                                        <Select
                                            name={field.name}
                                            options={field.options || []}
                                            value={
                                                field.options?.find(opt =>
                                                    String(opt.value) === String(formData[field.name])
                                                ) || null
                                            }
                                            onChange={(selected) => handleSingleSelectChange(selected, field.name)}
                                            placeholder={`Chọn ${field.label.toLowerCase()}`}
                                            noOptionsMessage={() => "Không có tùy chọn"}
                                            isClearable
                                        />
                                    ) : field.type === 'checkbox' ? (
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={Boolean(formData[field.name])}
                                                onChange={(e) => handleInputChange(e, field.name)}
                                            />
                                            <label className="form-check-label">
                                                {field.label}
                                            </label>
                                        </div>
                                    ) : field.type === 'file' ? (
                                        <>
                                            {formData[field.name] && (
                                                <div className="mb-2">
                                                    <img src={formData[field.name]} alt={field.label} width={100} />
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, field.name)}
                                                className="form-control"
                                            />
                                        </>
                                    ) : field.name === 'thoiGianTao' || field.name === 'thoiGianCapNhat' ? (
                                        <input
                                            type="text"
                                            value={
                                                action === 'create' && field.name === 'thoiGianTao'
                                                    ? getCurrentTime()
                                                    : formData[field.name] || ''
                                            }
                                            readOnly
                                            className="form-control"
                                            style={{ backgroundColor: '#f8f9fa' }}
                                        />
                                    ) : (
                                        <input
                                            type={field.type || 'text'}
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleInputChange(e, field.name)}
                                            placeholder={`Nhập ${field.label.toLowerCase()}`}
                                            className="form-control"
                                        />
                                    )}
                                </div>
                            );
                        })}
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
    formFields: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onDelete: PropTypes.func
};

export default Card;