import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Admin-board.scss';
import backgroundImage from '../../../assets/img/background.jpg';
import logoImage from '../../../assets/img/logo.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as authHook from "../../../hooks/auth.jsx";
import * as AuthenticationService from '../../../services/Admin/AuthenticationService.jsx';

const AdminBoard = ({ }) => {
    const [isSidebarActive, setIsSidebarActive] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [roleLogin, setRoleLogin] = useState('');
    const [dataUser, setDataUser] = useState([]);
    const navigate = useNavigate();

    var userId = authHook.getUserIdFromToken();
    var roleUser = authHook.getRolseUserFromToken();

    useEffect(() => {
        if (!userId || !roleUser) {
            setIsLogin(false);
            return;
        }
        setRoleLogin(roleUser);
        setIsLogin(true);

        const fetchApi = async () => {
            var result = await AuthenticationService.getUserById(userId);
            setDataUser(result);
        }
        fetchApi();

    }, [userId, roleUser]);

    const handleLogout = () => {
        // Hiển thị thông báo xác nhận đăng xuất
        const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất?");

        if (confirmLogout) {
            // Nếu người dùng xác nhận, xóa access token
            localStorage.removeItem('accessToken'); // hoặc sessionStorage nếu bạn dùng nó
            // Thông báo đăng xuất thành công
            alert("Đăng xuất thành công!");
            // Chuyển hướng về trang đăng nhập
            navigate('/login');
        }
    };

    // Hàm toggle để ẩn/hiện sidebar
    const toggleSidebar = () => {
        setIsSidebarActive((prev) => !prev);
    };

    // UseEffect để tải các script khi component được mount
    useEffect(() => {
        const scripts = [
            '/js/jquery.min.js',
            '/js/popper.js',
            '/js/bootstrap.min.js',
            '/js/main.js',
        ];

        const addScripts = () => {
            scripts.forEach((scriptSrc) => {
                const script = document.createElement('script');
                script.src = scriptSrc;
                script.async = true;
                document.body.appendChild(script);
            });
        };

        addScripts(); // Thêm script khi component được mount

        // Cleanup: Xóa các script khi component bị unmount
        return () => {
            scripts.forEach((scriptSrc) => {
                const script = document.querySelector(`script[src="${scriptSrc}"]`);
                if (script) {
                    script.remove();
                }
            });
        };
    }, []); // Chạy effect chỉ một lần khi component được mount

    return (
        <div className="wrapper d-flex align-items-stretch">
            <nav id="sidebar" className={isSidebarActive ? 'active' : ''}>
                <div className="custom-menu">
                    <button
                        type="button"
                        id="sidebarCollapse"
                        className="btn btn-primary"
                        onClick={toggleSidebar}
                    >
                    </button>
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
                        <h3>{dataUser?.nameND || (dataUser?.userName ? dataUser.userName.split('@')[0] : '')}</h3>
                        <button id="logout" className="title" onClick={handleLogout}>
                            Đăng xuất
                        </button>
                        <br />
                        <br />
                        <Link to="/Home" className="title">
                            Trang Chủ
                        </Link>
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
                        <Link to="/List-Tap-Phim">
                            <span className="fa fa-list mr-3"></span> Quản lý tập phim
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
                    <li>
                        <Link to="/List-Lich-Su-Giao-Dich">
                            <span className="fa fa-money-bill-wave mr-3"></span> Quản lý giao dịch
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default AdminBoard;
