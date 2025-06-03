import React, { useEffect, useState } from 'react';
import AdminBoard from '../../../components/Layouts/Admin-board/Admin-board';
import '../../../components/Layouts/Admin-board/Admin-board.scss';
import * as movieServices from '../../../services/Admin/MovieService';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const OverviewDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        SoLuongPhim: 0,
        SoLuongTheLoai: 0,
        SoLuongTheTag: 0,
        SoLuongQuocGia: 0,
        SoLuongNgonNgu: 0,
        SoLuongVaiTro: 0,
        SoLuongDaoDien: 0,
        SoLuongDienVien: 0,
        SoLuongNguoiDung: 0,
    });

    const [topMovies, setTopMovies] = useState([]);

    const fetchTotalFromApi = async (fetchFunc) => {
        try {
            const response = await fetchFunc();
            if (
                response &&
                response.status &&
                response.pagination &&
                typeof response.pagination.total === 'number'
            ) {
                return response.pagination.total;
            }
            return 0;
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
            return 0;
        }
    };

    const fetchDashboardData = async () => {
        const [
            SoLuongPhim,
            SoLuongTheLoai,
            SoLuongTheTag,
            SoLuongQuocGia,
            SoLuongNgonNgu,
            SoLuongDaoDien,
            SoLuongDienVien,
            SoLuongNguoiDung,
        ] = await Promise.all(
            [
                movieServices.fetchMovies,
                movieServices.fetchTheLoais,
                movieServices.fetchTheTags,
                movieServices.fetchQuocGias,
                movieServices.fetchNgonNgus,
                movieServices.fetchDaoDiens,
                movieServices.fetchDienViens,
                movieServices.fetchLichSuGiaoDichNguoiDung,
            ].map(fetchTotalFromApi)
        );

        setDashboardData({
            SoLuongPhim,
            SoLuongTheLoai,
            SoLuongTheTag,
            SoLuongQuocGia,
            SoLuongNgonNgu,
            SoLuongDaoDien,
            SoLuongDienVien,
            SoLuongNguoiDung,
            SoLuongVaiTro: 0,
        });
    };

    const fetchTopViewedMovies = async () => {
        console.log('fetchTopViewedMovies called');
        try {
            const response = await movieServices.fetchTopViewedMovies(5); // Top 5
            console.log('API response:', response);

            // Kiểm tra nếu response là array trực tiếp (như trong console log của bạn)
            if (Array.isArray(response)) {
                const formatted = response.map(movie => ({
                    tenPhim: movie.tenP,
                    luotXem: movie.luotXemP || 0 // Thêm fallback nếu luotXemP undefined
                }));
                console.log('Formatted data:', formatted);
                setTopMovies(formatted);
            }
            // Kiểm tra nếu response có cấu trúc {status, data}
            else if (response?.status && Array.isArray(response.data)) {
                const formatted = response.data.map(movie => ({
                    tenPhim: movie.tenP,
                    luotXem: movie.luotXemP || 0
                }));
                console.log('Formatted data from response.data:', formatted);
                setTopMovies(formatted);
            }
            // Kiểm tra nếu response trực tiếp có thuộc tính data là array
            else if (Array.isArray(response?.data)) {
                const formatted = response.data.map(movie => ({
                    tenPhim: movie.tenP,
                    luotXem: movie.luotXemP || 0
                }));
                console.log('Formatted data from response.data (no status):', formatted);
                setTopMovies(formatted);
            }
            else {
                console.warn("Không có dữ liệu hợp lệ:", response);
                console.warn("Response type:", typeof response);
                console.warn("Is array:", Array.isArray(response));

                // Debug: In ra thuộc tính đầu tiên của response
                if (response && typeof response === 'object') {
                    console.warn("Response keys:", Object.keys(response));
                    if (response.length > 0) {
                        console.warn("First item:", response[0]);
                        console.warn("First item keys:", Object.keys(response[0]));
                    }
                }
            }
        } catch (error) {
            console.error('Lỗi khi lấy top phim:', error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        fetchTopViewedMovies();
    }, []);

    const cardData = [
        { label: 'Tổng phim', count: dashboardData.SoLuongPhim, icon: 'fa-film', link: '/QuanTriVienPhim/QuanLyPhim' },
        { label: 'Tổng thể loại', count: dashboardData.SoLuongTheLoai, icon: 'fa-tags', link: '/QuanTriVienTheLoai/QuanLyTheLoai' },
        { label: 'Tổng thẻ tag', count: dashboardData.SoLuongTheTag, icon: 'fa-cogs', link: '/QuanTriVienTheTag/QuanLyTheTag' },
        { label: 'Tổng quốc gia', count: dashboardData.SoLuongQuocGia, icon: 'fa-globe', link: '/QuanTriVienQuocGia/QuanLyQuocGia' },
        { label: 'Tổng ngôn ngữ', count: dashboardData.SoLuongNgonNgu, icon: 'fa-language', link: '/QuanTriVienNgonNgu/QuanLyNgonNgu' },
        { label: 'Tổng đạo diễn', count: dashboardData.SoLuongDaoDien, icon: 'fa-users', link: '/QuanTriVienDaoDien/QuanLyDaoDien' },
        { label: 'Tổng diễn viên', count: dashboardData.SoLuongDienVien, icon: 'fa-users', link: '/QuanTriVienDienVien/QuanLyDienVien' },
        { label: 'Tổng người dùng', count: dashboardData.SoLuongNguoiDung, icon: 'fa-users', link: '/QuanTriVienNguoiDung/QuanLyNguoiDung' },
        { label: 'Tổng vai trò', count: dashboardData.SoLuongVaiTro, icon: 'fa-user-circle', link: '/QuanTriVienVaiTro/QuanLyVaiTro' },
    ];

    return (
        <div className="wrapper d-flex">
            <AdminBoard username="Admin" />
            <div id="content" className="content p-4 p-md-5 pt-5">
                <h1>Tổng quan thông tin dữ liệu</h1>
                <hr />
                <div className="hide-sidebar-collapse">
                    {/* Thêm biểu đồ ở đây */}
                    <h2 className="mt-5">Top 5 phim có lượt xem cao</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={topMovies}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="tenPhim" type="category" />
                            <Tooltip />
                            <Bar dataKey="luotXem" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="card-container">
                        {cardData.map((card, index) => (
                            <a
                                key={index}
                                href={card.link}
                                className="profile-card card-has-bg"
                            >
                                <div className="overlay"></div>
                                <i className={`fas ${card.icon} movie-icon`}></i>
                                <div className="profile-info">
                                    <h1>{card.count}</h1>
                                    <br /><br />
                                    <h2>{card.label}</h2>
                                    <p>Đang có trong dữ liệu</p>
                                </div>
                            </a>
                        ))}
                    </div>


                </div>
            </div>
        </div>
    );
};

export default OverviewDashboard;
