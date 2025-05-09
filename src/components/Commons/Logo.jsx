import { Link } from "react-router-dom";

function Logo({children,link}){
    return(
        <div className="login-header">
                <Link to={link}>{children}</Link>
        </div>
    );
}

export default Logo;