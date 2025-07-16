import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import './Card.scss';

const Card = ({
    action,
    data,
    formFields = [],
    dataAllEpisodes = [],
    onClose,
    onSave,
    onDelete,
    currentPhimId,
    onEpisodeSelect,
}) => {
    const resolvedPhimId = currentPhimId || data?.phimId;
    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        setValue,
        formState: { isSubmitting }
    } = useForm({ defaultValues: {} });

    const tapPhimOptions = useMemo(() => {
        return dataAllEpisodes
            .filter(ep => String(ep.phimId) === String(resolvedPhimId))
            .map(ep => ({
                value: String(ep.tapId),
                label: ep.tenTap || 'Không rõ tên tập'
            }));
    }, [dataAllEpisodes, resolvedPhimId]);

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

        if (data?.tapPhimId) {
            processed.selectedEpisode = data.tapPhimId;
        }

        reset(processed);
    }, [data, formFields, reset]);

    const handleEpisodeChange = async (selectedOption) => {
        if (selectedOption) {
            setValue('selectedEpisode', selectedOption.value); // Giữ lại selected
            if (onEpisodeSelect) {
                await onEpisodeSelect(selectedOption.value);
            }
        }
    };

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

    return (
        <div className="card-overlay">
            <div className="card-modal">
                {action === 'view' ? (
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
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="edit-form">
                        <h3>{action === 'edit' ? 'Chỉnh sửa' : 'Thêm mới'}</h3>

                        {tapPhimOptions.length > 0 && (
                            <div className="form-group">
                                <label>Chọn tập phim:</label>
                                <Controller
                                    name="selectedEpisode"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={tapPhimOptions}
                                            value={tapPhimOptions.find(opt => opt.value === field.value) || null}
                                            onChange={(opt) => {
                                                field.onChange(opt?.value);
                                                handleEpisodeChange(opt);
                                            }}
                                        />
                                    )}
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
                            <button type="submit" className="save-btn" disabled={isSubmitting}>Lưu</button>
                            {action === 'edit' && data?.tapId && (
                                <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={() => {
                                        if (window.confirm('Bạn có chắc chắn muốn xóa không?')) {
                                            onDelete(data);
                                        }
                                    }}
                                >Xóa</button>
                            )}
                            <button type="button" className="cancel-btn" onClick={onClose}>Đóng</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );

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
            return <input type="checkbox" {...register(field.name)} checked={watch(field.name)} />;
        } else if (field.type === 'file') {
            return <input type="file" onChange={(e) => setValue(field.name, e.target.files[0])} />;
        } else if (field.type === 'textarea') {
            return <textarea {...register(field.name)} />;
        } else {
            return <input type={field.type || 'text'} {...register(field.name)} />;
        }
    }
};

Card.propTypes = {
    action: PropTypes.oneOf(['view', 'edit', 'create', 'delete']).isRequired,
    data: PropTypes.object,
    formFields: PropTypes.array,
    dataAllEpisodes: PropTypes.array,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    currentPhimId: PropTypes.string,
    onEpisodeSelect: PropTypes.func,
};

export default Card;
