import { useState } from 'react';
import { Link } from 'react-router-dom';

import './LienHe.scss'

import Logo from '../../components/Commons/Logo';

function LienHe(){
    const [linkLienHe,setLinkLienHe] = useState("");

    const handleLinnk = (type) => {
        if(type == "zalo"){
            setLinkLienHe("https://zalo.me/0374687144");
        }
        if(type == "tele"){
            setLinkLienHe("https://t.me/hoang_nek");
        }
        if(type == "facebook"){
            setLinkLienHe("https://www.facebook.com/sh.hoanh/");
        }
        if(type == "gmail"){
            setLinkLienHe("mailto:hoangkutehbcd@gmail.com");
        }
        if(type == "discord"){
            setLinkLienHe("https://discord.gg/NX9RsShC");
        }
    }


    return(
        <div className="login-container">
            <Logo link={"/Home"}>GIEN PHIM</Logo>
            <div className="login-body">
                <div className="login-form-container">
                    <div className="login-form-header">
                        <h4 >
                            Hãy Liên Hệ Với Chúng Tôi
                        </h4>
                    </div>
                    <div className="login-form-other">
                        <a target='_blank' href={linkLienHe} className="login-form-button login-phone-button" onClick={() => handleLinnk("zalo")}>
                            <i className="fas fa-comment-alt"></i>
                            <span className="login-phone-text">Liên hệ qua Zalo</span>
                        </a>

                        <a target='_blank' href={linkLienHe} className="login-form-button login-phone-button" onClick={() => handleLinnk("tele")} >
                            <i className="fab fa-telegram-plane"></i>
                            <span className="login-phone-text">Liên hệ qua Tele</span>
                        </a>

                        <a target='_blank' href={linkLienHe} className="login-form-button login-email-button" onClick={() => handleLinnk("facebook")}>
                            <i className="fab fa-facebook-f"></i>
                            <span className="login-email-text">Liên hệ qua FaceBook</span>
                        </a>

                        <a target='_blank' href={linkLienHe} className="login-form-button login-email-button" onClick={() => handleLinnk("gmail")}>
                            <i className="fas fa-envelope"></i>
                            <span className="login-email-text">Liên hệ qua Gmail</span>
                        </a>

                        <div className="login-form-signupnow">
                            Bạn có hài lòng với website GIENPHIM?
                        </div>
                        <a target='_blank' href={linkLienHe} asp-action="GRDis" className="login-form-button login-email-button" onClick={() => handleLinnk("discord")}>
                            <i className="fab fa-discord"></i>
                            <span className="login-email-text">Join Group Discord GienPhim</span>
                        </a>
                        <div className="login-term">
                            <p>Nếu bạn có trải nghiệm không tốt về website. Hãy liên hệ sớm nhất với chúng tôi. Chúng tôi sẽ cố gắng khắc phục nhanh chóng.</p>
                            <a href="">Tìm hiểu thêm.</a>
                        </div>
                    </div>
                </div>
            </div>
<           div className="login-overlay">
            </div>
        </div>
        
    );
}

export default LienHe;