import { useEffect, useState } from 'react';
import './ThongBao.scss';


function ThongBao({ show, onClose, type, title, message, showButton, btnLabel, onBTNClick, soNgayOptions = [], onChonSoNgay }) {
    const [selectedSoNgay, setSelectedSoNgay] = useState('');

    // Khi props soNgayOptions thay đổi, reset lại chọn mặc định
    useEffect(() => {
        setSelectedSoNgay("");
    }, [soNgayOptions]);

    if (!show) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <div className="icon">
                        <div className="face2">
                            <div className="eye"></div>
                            <div class="eye right"></div>
                            <div class="mouth happy"></div>
                        </div>
                        <div class="shadow move"></div>
                    </div>
                ); // Thành công
            case 'fail':
                return (
                    <div className="icon">
                        <div className="face">
                            <div className="eye"></div>
                            <div class="eye right"></div>
                            <div class="mouth sad"></div>
                        </div>
                        <div class="shadow move"></div>
                    </div>
                ); // Thất bại
            case 'warning':
                return (
                    <div className="icon">
                        <div className="face">
                            <div className="eye"></div>
                            <div className="eye right"></div>
                            <div className="mouth happy"></div>
                        </div>
                        <div class="shadow scale"></div>
                    </div>
                ); // Cảnh báo
            case 'confirm':
                return (
                    <div className="icon">
                        <div className="face">
                            <div className="eye"></div>
                            <div className="eye right"></div>
                            <div className="mouth sad"></div>
                        </div>
                        <div class="shadow scale"></div>
                    </div>
                ); // Xác nhận
            default:
                return null;
        }
    };


    const chonSoNgay = () => {

        return (

            soNgayOptions.length > 0 && (
                <div className="chon-so-ngay">
                    <label>Chọn số ngày gói:</label>
                    <select
                        value={selectedSoNgay}
                        onChange={(e) => {
                            setSelectedSoNgay(e.target.value);
                            onChonSoNgay && onChonSoNgay(Number(e.target.value));
                        }}
                    >
                        <option value="">-- Chọn --</option>
                        {soNgayOptions.map((day, idx) => (
                            <option key={idx} value={day}>{day} ngày</option>
                        ))}
                    </select>
                </div>
            )
        );
    }

    return (
        <div className="modal-overlay-tb">
            <div className={`modal-content-tb ${type}`}>
                {getIcon()}
                <h3>{title}</h3>
                <p>{message}</p>
                {chonSoNgay()}
                <div className="modal-buttons-tb">
                    {showButton && (
                        <button
                            className="btn-tb confirm"
                            onClick={onBTNClick}
                        >
                            {btnLabel}
                        </button>
                    )}
                    <button className="btn-tb cancel" onClick={onClose}>Đóng</button>
                </div>
            </div>
        </div>
    );
}

export default ThongBao;