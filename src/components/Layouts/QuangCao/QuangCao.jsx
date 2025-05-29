import { useEffect, useState } from 'react';
import './QuangCao.scss';
import * as managerServices from '../../../services/ManagerService.jsx';

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
                setDataGoiTV(result?.goiThanhVien );
                setDataCTGoi(result?.data)
            } catch (error) {
                console.error("Lỗi khi lấy gói thành viên:", error);
            }
        };

        fetchData();
    }, [userId]);

    console.log(dataGoiTV); // ✅ debug hợp lý

    const isHetHan = () => {
        if (dataCTGoi.length === 0) return true; 
        const ngayKT = new Date(dataCTGoi[0].ngayKetThuc);
        return ngayKT < new Date(); 
    };


    return (
        <>
            {(!dataGoiTV?.slugGoiTV || isHetHan())  && (
                <a href={href} className="quangcao-ngang" target="_blank" rel="noopener noreferrer">
                    <img src={src} alt="Quảng cáo" />
                </a>
            )}
        </>
    );
}
