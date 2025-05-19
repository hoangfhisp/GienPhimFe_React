
import'./Notice.scss'
import {Link } from 'react-router-dom';

export default function Notice(){
    return(
        <div className="notice">
            <p>🔗 Website luôn cập nhật liên tục các bộ <Link to={"/SearchPhim/TopPhim/top-phim"} style={{color:"yellow"}}>Phim Hót</Link> hiện nay, hãy tận hưởng những khoảng khắc xem phim nào.</p>
            <p>📢 Mời bạn tham gia góp ý <Link to={"/LienHe"} style={{color:"red"}}>tại đây!</Link> hoặc tham gia Discord <a target={'_blank'} rel="noopener noreferrer" href='https://discord.gg/AyNYKs4ydU' style={{color:"red"}}>tại đây!</a> cùng GienPhim.</p>
            <p>📂 Website đang trong quá trình phát triển, hãy ủng hộ động viên tinh thần chúng tôi <a href='/' style={{color:"red"}}>tại đây!</a></p>
        </div>
    );

}