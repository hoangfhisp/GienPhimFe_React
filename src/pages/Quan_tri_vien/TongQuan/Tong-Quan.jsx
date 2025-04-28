import React, { useEffect, useState } from 'react';
import AdminBoard from '../../../components/Admin-board/Admin-board';
import '../../../components/Admin-board/Admin-board.scss';

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

    // Lấy tổng quan dữ liệu từ API
    const fetchDashboardData = () => {
        fetch('/api/dashboard') // Thay '/api/dashboard' bằng API của bạn
            .then((response) => response.json())
            .then((data) => {
                setDashboardData(data);
            })
            .catch((error) => {
                console.error('Lỗi khi tải dữ liệu tổng quan:', error);
            });
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Dữ liệu các phần tử card
    const cardData = [
        { label: 'Tổng phim', count: dashboardData.SoLuongPhim, icon: 'fa-film', link: '/QuanTriVienPhim/QuanLyPhim' },
        { label: 'Tổng thể loại', count: dashboardData.SoLuongTheLoai, icon: 'fa-tags', link: '/QuanTriVienTheLoai/QuanLyTheLoai' },
        { label: 'Tổng thẻ tag', count: dashboardData.SoLuongTheTag, icon: 'fa-cogs', link: '/QuanTriVienTheTag/QuanLyTheTag' },
        { label: 'Tổng quốc gia', count: dashboardData.SoLuongQuocGia, icon: 'fa-globe', link: '/QuanTriVienQuocGia/QuanLyQuocGia' },
        { label: 'Tổng ngôn ngữ', count: dashboardData.SoLuongNgonNgu, icon: 'fa-language', link: '/QuanTriVienNgonNgu/QuanLyNgonNgu' },
        { label: 'Tổng vai trò', count: dashboardData.SoLuongVaiTro, icon: 'fa-user-circle', link: '/QuanTriVienVaiTro/QuanLyVaiTro' },
        { label: 'Tổng đạo diễn', count: dashboardData.SoLuongDaoDien, icon: 'fa-users', link: '/QuanTriVienDaoDien/QuanLyDaoDien' },
        { label: 'Tổng diễn viên', count: dashboardData.SoLuongDienVien, icon: 'fa-users', link: '/QuanTriVienDienVien/QuanLyDienVien' },
        { label: 'Tổng người dùng', count: dashboardData.SoLuongNguoiDung, icon: 'fa-users', link: '/QuanTriVienNguoiDung/QuanLyNguoiDung' },
    ];

    return (
        <div className="wrapper d-flex">
            <AdminBoard username="Admin" />
            <div id="content" className="content p-4 p-md-5 pt-5">
                <h1>Tổng quan thông tin dữ liệu</h1>
                <hr />

                {/* Hiển thị các thông tin tổng quan */}
                <div className="hide-sidebar-collapse">
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
                                    <br />
                                    <br />
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
