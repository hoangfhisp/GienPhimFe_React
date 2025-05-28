
import { useState ,useEffect} from "react";

import Notice from "../../components/Layouts/Notice/Notice";
import ProfileContent from "../../components/Layouts/Profile/ProfileContent";
import ProfileSidebar from "../../components/Layouts/Profile/ProfileSidebar";
import * as authHook from "../../hooks/auth.jsx"
import * as authServices from '../../services/Admin/AuthenticationService.jsx';

function InfoAccount(){
    const [dataUser,setDataUser] = useState([]);
    var userIdLogin = authHook.getUserIdFromToken();

    useEffect(() => {
        if(!userIdLogin)
            return;

        const fetchApiUser = async () => {
            const result = await authServices.getUserById(userIdLogin);
            setDataUser(result);
        }

        fetchApiUser();
    },[userIdLogin])

    return(
        <div className="container-main">
            <Notice/>
            <br /> <hr />

            <div className="profile-container">
                <ProfileSidebar dataU ={dataUser}/>
                <ProfileContent dataU ={dataUser}/>
            </div>

        </div>
    );
}

export default InfoAccount;