import { useEffect, useState } from 'react';
import './QuangCao.scss';
import * as managerServices from '../../../services/User/ManagerService'

export function QuangCaoNgang({ src, href, userId }) {
    const [dataGoiTV, setDataGoiTV] = useState(null);
    const [dataCTGoi, setDataCTGoi] = useState([]);
    useEffect(() => {
        if (!userId) {
            setDataGoiTV(null); // ✅ đúng cách
            setDataCTGoi([]);
            return;
        }

        const fetchData = async () => {
            try {
                const result = await managerServices.GetChiTietGoiTVByUser(userId);
                setDataGoiTV(result.data);
                setDataCTGoi(result?.data)
            } catch (error) {
                console.error("Lỗi khi lấy gói thành viên:", error);
            }
        };

        fetchData();
    }, [userId]);

    const isHetHan = () => {
        if (dataCTGoi === null) return true;
        const ngayKT = new Date(dataCTGoi.ngayKetThuc);
        return ngayKT < new Date();
    };


    return (
        <>
            {(!dataGoiTV?.tenPlan || isHetHan()) && (
                <a href={href} className="quangcao-ngang" target="_blank" rel="noopener noreferrer">
                    <img src={src} alt="Quảng cáo" />
                </a>
            )}
        </>
    );
}
