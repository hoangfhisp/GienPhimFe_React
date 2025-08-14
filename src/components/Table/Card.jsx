import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import './Card.scss';

const Card = ({
    action,
    data,
    formFields = [],
    onClose,
    onSave,
    onDelete,
    episodeOptions = [],
    selectedEpisodeId,
    onEpisodeSelect
}) => {
    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        setValue,
        formState: { isSubmitting }
    } = useForm({ defaultValues: {} });

    useEffect(() => {
        const processed = {};
        formFields.forEach(field => {
            let value = data?.[field.name];
            if (field.type === 'select' && field.multiple && Array.isArray(value)) {
                value = value.map(String);
            } else if (field.type === 'select') {
                value = value != null ? String(value) : '';
            } else if (field.type === 'checkbox') {
                value = Boolean(value);
            } else if (field.type === 'number') {
                value = Number(value) || 0;
            } else {
                value = value ?? '';
            }
            processed[field.name] = value;
        });

        reset(processed);
    }, [data, formFields, reset]);

    const onSubmit = async (formData) => {
        await onSave(formData);
    };

    const getDisplayValue = (field, value) => {
        if (!value) return 'Chưa có dữ liệu';
        switch (field.type) {
            case 'select':
                if (field.multiple && Array.isArray(value)) {
                    return value.map(v => {
                        const opt = field.options?.find(o => o.value === v);
                        return opt?.label || v;
                    }).join(', ');
                } else {
                    const opt = field.options?.find(o => o.value === value);
                    return opt?.label || value;
                }
            case 'checkbox':
                return value ? 'Có' : 'Không';
            case 'file':
                if (typeof value === 'string') {
                    if (value.endsWith('.mp4')) {
                        return <video width={320} height={180} controls><source src={value} /></video>;
                    } else if (/(jpg|jpeg|png|webp)$/i.test(value)) {
                        return <img src={value} alt={field.label} width={100} />;
                    }
                    return <a href={value} target="_blank" rel="noreferrer">Tải file</a>;
                }
                return value?.name || 'Đã chọn file';
            case 'number':
                return Number(value).toLocaleString('vi-VN');
            default:
                return value.toString();
        }
    };

    function renderField(field) {
        if (field.type === 'select') {
            const options = field.options || [];
            return (
                <Controller
                    name={field.name}
                    control={control}
                    render={({ field: selectField }) => (
                        <Select
                            {...selectField}
                            options={options}
                            isMulti={field.multiple}
                            onChange={(val) => {
                                const value = field.multiple
                                    ? val.map(v => v.value)
                                    : val?.value || '';
                                selectField.onChange(value);
                            }}
                            value={field.multiple
                                ? options.filter(opt => watch(field.name)?.includes(opt.value))
                                : options.find(opt => opt.value === watch(field.name)) || null}
                        />
                    )}
                />
            );
        } else if (field.type === 'checkbox') {
            return (
                <input
                    type="checkbox"
                    {...register(field.name)}
                    checked={watch(field.name) || false}
                    onChange={(e) => setValue(field.name, e.target.checked)}
                />
            );
        } else if (field.type === 'file') {
            return <input type="file" onChange={(e) => setValue(field.name, e.target.files[0])} />;
        } else if (field.type === 'textarea') {
            return <textarea {...register(field.name)} />;
        } else {
            return <input type={field.type || 'text'} {...register(field.name)} />;
        }
    }

    return (
        <div className="card-overlay">
            <div className="card-modal">
                {action === 'view' && (
                    <div className="view-mode">
                        <h3>Xem chi tiết</h3>
                        {formFields.map(field => (
                            <div key={field.name} className="form-group">
                                <label><strong>{field.label}:</strong></label>
                                <div>{getDisplayValue(field, data?.[field.name])}</div>
                            </div>
                        ))}
                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={onClose}>Đóng</button>
                        </div>
                    </div>
                )}

                {(action === 'edit' || action === 'create') && (
                    <form onSubmit={handleSubmit(onSubmit)} className="edit-form">
                        <h3>{action === 'edit' ? 'Chỉnh sửa' : 'Thêm mới'}</h3>

                        {(action === 'edit' || action === 'create') && episodeOptions.length > 0 && (
                            <div className="form-group">
                                <label>Chọn tập phim</label>
                                <Select
                                    options={episodeOptions}
                                    value={episodeOptions.find(opt => opt.value === selectedEpisodeId) || null}
                                    onChange={(opt) => {
                                        if (opt) onEpisodeSelect(opt.value);
                                    }}
                                    placeholder="Chọn tập cần chỉnh sửa"
                                    isClearable
                                />
                            </div>
                        )}

                        {formFields.map(field => (
                            <div key={field.name} className="form-group">
                                <label>{field.label}</label>
                                {renderField(field)}
                            </div>
                        ))}

                        <div className="form-actions">
                            <button type="submit" className="save-btn" disabled={isSubmitting}>
                                {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                            </button>
                            <button type="button" className="cancel-btn" onClick={onClose}>Đóng</button>
                        </div>
                    </form>
                )}

                {action === 'delete' && (
                    <div className="delete-confirm">
                        <h3>Xác nhận xóa</h3>
                        <p>Bạn có chắc chắn muốn xóa tập phim <strong>{data?.tenTap}</strong> không?</p>
                        <div className="form-actions">
                            <button
                                className="delete-btn"
                                onClick={() => onDelete(data)}
                                disabled={isSubmitting}
                            >
                                Xóa
                            </button>
                            <button type="button" className="cancel-btn" onClick={onClose}>
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
    action: PropTypes.oneOf(['view', 'edit', 'create']).isRequired,
    data: PropTypes.object,
    formFields: PropTypes.array,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    episodeOptions: PropTypes.array,
    selectedEpisodeId: PropTypes.string,
    onEpisodeSelect: PropTypes.func
};

export default Card;
