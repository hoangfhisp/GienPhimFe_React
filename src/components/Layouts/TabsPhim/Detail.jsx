import {  useEffect, useState } from 'react';
import './TabsPhim.scss'

function Detail({data,dataTap}){

    const[tapMoiNhat,setTapMoiNhat] = useState(null);
    const[dataTheLoai,setDataTheLoai] = useState([]);
    const[dataQuocGia,setDataQuocGia] = useState([]);

    useEffect(() => {
        if(dataTap){
            const tapmoi = dataTap.length > 0 ? dataTap[dataTap.length - 1].tenFile : null;
            setTapMoiNhat(tapmoi)
        }
        if(data?.theLoais){
            setDataTheLoai(data.theLoais);
        }
        if(data?.quocGia){
            setDataQuocGia(data.quocGia);
        }

    },[dataTap,data])

    return(
        <>
            <div className="phim-info-index detail-item">
                    <strong>Tập mới:</strong> <span className="tag">
                        {tapMoiNhat}
                    </span>
            </div>

            <div className="phim-info-index detail-item">
                <strong>Thể loại:</strong> 

                {dataTheLoai.map((result) => (
                    <span className="genres" key={result}>
                            <span>{result }</span>
                    </span>
                ))}

            </div>

            <div className="phim-info-index detail-item">
                <strong>Quốc gia:</strong> 
                <span className="country">
                    <span>{dataQuocGia}</span>
                </span>
            </div>

            <div className="phim-info-index detail-item">
                <strong>Thời lượng:</strong> {data.thuoiLuongP}
            </div>

            <div className ="phim-info-index detail-item">
                <strong>Lượt like:</strong> <span className="tag tag-hd">{data.luotThichP}</span>
            </div>

            <div className="phim-info-index detail-item">
                <strong>Lượt dislike:</strong> <span className="tag tag-pg">{data.luotDislikeP}</span>
            </div>

            <div className="phim-info-index detail-item">
                <strong>Cty sản xuất:</strong> {data.tenCTSXP}
            </div>
        </>
    );
}

export default Detail;