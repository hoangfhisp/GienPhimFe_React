import React from 'react';
import LoginContainer from '../../components/Login-container/Login-container';
import { Link } from 'react-router-dom';
import '../../components/Login-container/Login.scss';

const Help = () => {
  const faqList = [
    {
      question: 'Làm thế nào để đăng nhập?',
      answer: 'Bạn có thể đăng nhập bằng email hoặc số điện thoại đã đăng ký.',
    },
    {
      question: 'Tôi quên mật khẩu, làm sao để lấy lại?',
      answer: 'Hãy nhấn vào "Quên mật khẩu" trên trang đăng nhập để đặt lại mật khẩu.',
    },
    {
      question: 'Tôi có thể thay đổi địa chỉ email không?',
      answer: 'Có, bạn có thể thay đổi trong phần Cài đặt tài khoản.',
    },
    {
      question: 'Tôi có thể liên hệ bộ phận hỗ trợ như thế nào?',
      answer: (
        <span>
          Vui lòng gửi email đến <a href="mailto:support@gienphim.vn">support@gienphim.vn</a> để được hỗ trợ nhanh nhất.
        </span>
      ),
    },
  ];

  return (
    <div className="login-container">
      <LoginContainer />
        <div className="trogiup-body">
            <div className="login-form-container">
                <div className="login-form-header">
                <h4 style={{ textAlign: 'center' }}>Các câu hỏi thường gặp</h4>
                </div>

                {faqList.map((item, index) => (
                <div className="trogiup-question" key={index}>
                    <h4>{item.question}</h4>
                    <p>{item.answer}</p>
                </div>
                ))}

                <div className="back-link-container">
                <Link to="/login" className="back-link">
                    <i className="fas fa-arrow-left"></i> Trở về
                </Link>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Help;
