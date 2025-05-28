import React from 'react';
import { Link } from 'react-router-dom'; // Sử dụng Link để điều hướng trong React
import './Login.scss';

const LoginContainer = () => {
    return (
        <div className="login-container-background">
            <div className="login-header">
                <Link to="/Home">GIENPHIM</Link>
            </div>
            <div className="login-overlay"></div>
        </div>
    );
};

export default LoginContainer;