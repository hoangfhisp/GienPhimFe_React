import { useEffect, useMemo, useRef, useState } from 'react';
import './FilmVideo.scss'
import FilmPanel from './FilmPanel';
import FilmTap from './FilmTap.jsx';
import * as phimServices from '../../../services/User/FilmService.jsx'
import { extractM3U8, formatURLImage } from '../../../untils/Format.jsx';
import useHlsSkipAds from '../../../hooks/useHlsSkipAds.jsx';

function FilmVideo({ id, tap, userId }) {
    const [isPlaying, setIsPlaying] = useState(false); // hàm để bật tắt xem phim để bật iframe
    const [dataTapPhim, setDataTapPhim] = useState([]); // hàm gắn lấy dữ liệu của 1 list phim
    const [tapPhim, setTapPhim] = useState(null); // hàm gán 1 link của tập phim cụ thể
    const [currentType, setCurrentType] = useState(null);

    const isFirstRun = useRef(true); // Thêm kiểm soát bằng useRef để chỉ gọi API một lần
    const videoRef = useRef(null);

    // Hàm lấy api id phim. rồi lấy list tập phim
    useEffect(() => {
        if (id == null) {
            return;
        }
        const fetchApi = async () => {
            const dataTap = await phimServices.tapPhims(id);
            const danhSachTap = dataTap.data || [];
            setDataTapPhim(danhSachTap);
        }

        fetchApi();

    }, [id])

    // Lọc danh sách tập có slugtap = tap (params)
    const tapchon = useMemo(() => {
        return dataTapPhim.find(item => item.slugTap === tap);
    }, [dataTapPhim, tap])

    // Gọi api xu lý lịch sử nếu slug tập thay đổi
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        if (tap == null || userId == null)
            return;

        var xuLyLichSuXemData = { phimId: id, userId, tapVuaXem: tap }
        const fetchApiXuLyLichSuXem = async () => {
            await phimServices.XuLyLichSuXem(xuLyLichSuXemData);
        }
        fetchApiXuLyLichSuXem();
    }, [tap, id, userId])

    // Thiết lập loại mặc định (chính hoặc phụ) sau khi load danh sách tập
    useEffect(() => {
        if (!currentType && Array.isArray(dataTapPhim) && dataTapPhim.length > 0) {
            const hasChinh = dataTapPhim.some(tap => tap.linkChinh !== null);
            const hasPhu = dataTapPhim.some(tap => tap.linkPhu !== null);

            if (hasChinh) {
                setCurrentType('chinh');
            } else if (hasPhu) {
                setCurrentType('phu');
            }
        }
    }, [dataTapPhim, currentType]);



    // Hàm lấy tập phim để gắn vào video
    useEffect(() => {
        if (!tapchon) return;

        const rawLink = currentType === 'chinh'
            ? formatURLImage(tapchon.linkChinh)
            : extractM3U8(formatURLImage(tapchon.linkPhu));

        setTapPhim(rawLink);

    }, [tapchon, currentType]);

    // Hàm để chạy api update lại số lượt xem khi người dùng xem
    const Views = async (idphim, nguoiDungId) => {
        await phimServices.addLuotXem(idphim, nguoiDungId);
        setIsPlaying(true); 
    }

    // Sử dụng hook tùy chỉnh để bỏ qua quảng cáo
    useHlsSkipAds(tapPhim, videoRef, true,isPlaying);

    return (
        <>
            <div className="video-container">

                <video
                    ref={videoRef}
                    title={`Xem phim - Tập ${tap}`}
                    controls
                    playsInline
                    style={{
                        width: "100%",
                        height: "100%",
                        visibility: isPlaying ? "visible" : "hidden"
                    }}
                />

                <div className="video-overlay" style={{ display: isPlaying ? "none" : "block" }}>
                    <p className="warning">WEBSITE CÓ NHIỀU QUẢNG CÁO!</p>
                    <p className="subtext">KHÔNG CÓ QUẢNG CÁO THÌ DUY TRÌ WEBSITE LÀM SAO?!</p>
                    <p className="support-text">
                        NẾU BẠN DÙNG CHẶN QUẢNG CÁO <span>VUI LÒNG TẮT</span> ĐỂ ỦNG HỘ GIENPHIM NHÉ!
                        <br />
                        ĐÂY LÀ LINK PHIM FREE NÊN SẼ CÓ QUẢNG CÁO <span>CỜ BẠC</span> VUI LÒNG CÂN NHẮC TRƯỚC KHI XEM!
                    </p>


                    <button className="play-btn" onClick={() => Views(id, userId)}> {/* Khi người dùng ấn gọi hàm tăng view */}
                        <div className="play-icon"></div>
                    </button>
                </div>
            </div>

            <FilmPanel data={dataTapPhim} nguoiDungId={userId} idphim={id} slugtap={tap} onSelect={() => setIsPlaying(false)} />

            {dataTapPhim.some(tap => tap.linkChinh !== null) && (
                <div className="tap-container">
                    <FilmTap
                        type="chinh"
                        currentType={currentType}
                        data={dataTapPhim.filter(tap => formatURLImage(tap.linkChinh) !== null)}
                        idphim={id}
                        slugtap={tap}
                        onSelect={() => {
                            setCurrentType('chinh');
                            setIsPlaying(false);
                        }}
                    >
                        📺 GIENPHIM Tập Chính
                    </FilmTap>
                </div>
            )}

            {dataTapPhim.some(tap => tap.linkPhu !== null) && (
                <div className="tap-container">
                    <FilmTap
                        type="phu"
                        currentType={currentType}
                        data={dataTapPhim.filter(tap => formatURLImage(tap.linkPhu) !== null)}
                        idphim={id}
                        slugtap={tap}
                        onSelect={() => {
                            setCurrentType('phu');
                            setIsPlaying(false);
                        }}
                    >
                        📺 GIENPHIM Tập Phụ
                    </FilmTap>
                </div>
            )}

        </>
    );
}

export default FilmVideo;