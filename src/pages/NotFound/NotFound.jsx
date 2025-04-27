import { Link } from "react-router-dom";
import "./NotFound.scss"; // Tách phần CSS bạn đưa ra ở trên vào file này

export default function NotFound() {
    return (
        <div className="Body-NotFound">
            <div className="not-found-page">
                <div id="clouds">
                    <div className="cloud x1">
                        <span className="fa fa-home"></span>
                    </div>
                    <div className="cloud x1_5">
                        <span className="fa fa-film"></span>
                    </div>
                    <div className="cloud x2">
                        <span className="fa fa-tags"></span>
                    </div>
                    <div className="cloud x3">
                        <span className="fa fa-globe"></span>
                    </div>
                    <div className="cloud x4">
                        <span className="fa fa-cogs"></span>
                    </div>
                    <div className="cloud x5">
                        <span className="fa fa-users"></span>
                    </div>
                </div>

                <div className="c">
                    <div className="_404">404</div>
                    <hr className="hr_NotFound" />
                    <div className="_1">Không thể tìm thấy trang</div>
                    <div className="_2">Trang bạn đang tìm không tồn tại hoặc đã bị xóa.</div>
                    <Link to={"/Home"} className="btn_NotFound">
                        ⬅ Về Trang Chủ
                    </Link>
                </div>
            </div>
        </div>
        
    );
}
