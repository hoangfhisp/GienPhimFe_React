import { Link } from "react-router-dom";

export default function NavbarFooter({children,link}){
    return(
            <Link to={link} className="text-light me-2">{children}</Link>
    );
}