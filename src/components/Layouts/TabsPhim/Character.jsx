import { useEffect, useState } from 'react';
import './TabsPhim.scss'

function Character({data}){
    const[dataDienVien,setDataDienVien] = useState([]);

    useEffect(() => {
        if(data?.dienVien){
            setDataDienVien(data.dienVien);
        }
    },[dataDienVien])
    return(
        <>
            <div id="characters" className="phim-characters detail-item" style={{ gap: '40px'}}>
                    <strong>Nhân vật:</strong> 
                    <div className="characters-list">
                        {dataDienVien.map((result) => (
                            <div className="character-card" key={result.dienVienId}>
                                <div className="character-avatar">
                                    <i className="fa fa-user"></i> {/*hoặc thay bằng ảnh nếu có */} 
                                </div>
                                <div className="character-name">{result.tenDV}</div>
                            </div>
                        ))}
                    </div>
            </div>
        </>
    );
}

export default Character;