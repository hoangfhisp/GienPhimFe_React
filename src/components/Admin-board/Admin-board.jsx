import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../components/Login-container/Login.scss';
import './Admin-board.scss';
import backgroundImage from '../../assets/img/background.jpg';
import logoImage from '../../assets/img/logo.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminBoard = ({ username = 'Admin' }) => {
    const handleLogout = () => {
        alert('Đăng xuất thành công!');
    };

    // UseEffect to load scripts
    useEffect(() => {
        const scripts = [
            '/js/jquery.min.js',
            '/js/popper.js',
            '/js/bootstrap.min.js',
            '/js/main.js',
        ];

        // Function to dynamically add the script tags
        const addScripts = () => {
            scripts.forEach((scriptSrc) => {
                const script = document.createElement('script');
                script.src = scriptSrc;
                script.async = true;
                document.body.appendChild(script);
            });
        };

        addScripts(); // Add scripts when component mounts

        // Cleanup function to remove scripts when component unmounts
        return () => {
            scripts.forEach((scriptSrc) => {
                const script = document.querySelector(`script[src="${scriptSrc}"]`);
                if (script) {
                    script.remove();
                }
            });
        };
    }, []); // Empty dependency array ensures this effect runs only once when component mounts

    return (
        <div className="wrapper d-flex align-items-stretch">
            <nav id="sidebar">
                <div className="custom-menu">
                    <button type="button" id="sidebarCollapse" className="btn btn-primary"></button>
                </div>
                <div
                    className="img bg-wrap text-center py-4"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                    }}
                >
                    <div className="user-logo">
                        <div
                            className="img"
                            style={{
                                backgroundImage: `url(${logoImage})`,
                            }}
                        ></div>
                        <h3>Admin</h3>
                        <h3>{username}</h3>
                        <button id="logout" className="title" onClick={handleLogout}>
                            Đăng xuất
                        </button>
                    </div>
                </div>

                <ul className="list-unstyled components mb-5">
                    <li>
                        <Link to="/Tong-Quan">
                            <span className="fa fa-home mr-3"></span> Tổng quan
                        </Link>
                    </li>
                    <li>
                        <Link to="/List-Phim">
                            <span className="fa fa-film mr-3"></span> Quản lý phim
                        </Link>
                    </li>
                    <li>
                        <Link to="/List-The-Loai">
                            <span className="fa fa-tags mr-3"></span> Quản lý thể loại
                        </Link>
                    </li>
                    <li>
                        <Link to="/List-Quoc-Gia">
                            <span className="fa fa-globe mr-3"></span> Quản lý quốc gia
                        </Link>
                    </li>
                    <li>
                        <Link to="/List-Ngon-Ngu">
                            <span className="fa fa-language mr-3"></span> Quản lý ngôn ngữ
                        </Link>
                    </li>
                    <li>
                        <Link to="/List-The-Tag">
                            <span className="fa fa-cogs mr-3"></span> Quản lý thẻ tag
                        </Link>
                    </li>
                    <li>
                        <Link to="/List-Dao-Dien">
                            <span className="fa fa-user mr-3"></span> Quản lý đạo diễn
                        </Link>
                    </li>
                    <li>
                        <Link to="/List-Dien-Vien">
                            <span className="fa fa-user mr-3"></span> Quản lý diễn viên
                        </Link>
                    </li>
                    <li>
                        <Link to="/List-Vai-Tro">
                            <span className="fa fa-user-circle mr-3"></span> Quản lý vai trò
                        </Link>
                    </li>
                    <li>
                        <Link to="/List-Nguoi-Dung">
                            <span className="fa fa-users mr-3"></span> Quản lý người dùng
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default AdminBoard;
