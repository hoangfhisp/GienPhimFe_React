import { useEffect, useState } from 'react';
import './Plan.scss';
import * as managerServices from '../../../services/User/ManagerService.jsx';

import { formatVND } from '../../../untils/Format.jsx';

function Plan({ children, deXuat, isRecommended, onSelect, data, onDataGoiThang, onDataGoiNam, color }) {
    const [dataLuaChonGoiThang, setDataLuaChonGoiThang] = useState([]);
    const [dataLuaChonGoiNam, setDataLuaChonGoiNam] = useState([]);
    const parts = String(data.moTaPlan).split('-');

    useEffect(() => {
        if (!data || !data.planId) return;

        const fetchApiLuaChon = async () => {
            try {
                const resultT = await managerServices.GetLuaChonGTVByGoiTVIdAndNgayAsync(data.planId, 30,1,10);
                setDataLuaChonGoiThang(resultT.data);
                onDataGoiThang(resultT.data);

                const resultN = await managerServices.GetLuaChonGTVByGoiTVIdAndNgayAsync(data.planId, 365,1,10);
                setDataLuaChonGoiNam(resultN.data);
                onDataGoiNam(resultN.data);

            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            }
        };

        fetchApiLuaChon();
    }, [data?.planId]);

    return (
        <button
            className={`plan ${isRecommended ? 'recommended' : ''} ${color}`} // Áp dụng màu vào class
            onClick={onSelect}
        >
            {deXuat && <div className="label">Đề xuất</div>}
            <h2>{children}</h2>
            <p className="price">
                <span className="monthly">{formatVND(Number(dataLuaChonGoiThang[0]?.giaOption || 0))} / tháng</span>
            </p>
            <p className="yearly">
                Hoặc trả trước theo năm:
                <br />
                <span className="highlight">{formatVND(Number(dataLuaChonGoiNam[0]?.giaOption || 0))} / năm</span>
            </p>
            <ul className='plan-info'>
                {parts.map((res, index) => (
                    <li key={index}>{res}</li>
                ))}
            </ul>
        </button>
    );
}

export default Plan;
