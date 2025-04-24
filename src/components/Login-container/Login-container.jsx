import React from 'react';
import { Link } from 'react-router-dom'; // Sử dụng Link để điều hướng trong React
import './login-container.scss';

const LoginContainer = () => {
    return (
      <div className="login-container-background">
        <div className="login-header">
          <Link to="/">GIENPHIM</Link>
        </div>
      </div>
    );
  };
  
  export default LoginContainer;