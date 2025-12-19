import { useState, useEffect } from "react";

import Notice from "../../components/Layouts/Notice/Notice";
import ProfileContent from "../../components/Layouts/Profile/ProfileContent";
import ProfileSidebar from "../../components/Layouts/Profile/ProfileSidebar";
import * as authHook from "../../hooks/auth.jsx";
import * as authServices from "../../services/Admin/AuthenticationService.jsx";
import * as walletServices from "../../services/User/UserService.jsx";

function InfoAccount() {
    const [dataUser, setDataUser] = useState(null);
    const [walletData, setWalletData] = useState(null);
    const userIdLogin = authHook.getUserIdFromToken();

    useEffect(() => {
        if (!userIdLogin) return;

        const fetchAll = async () => {
            const userRes = await authServices.getUserById(userIdLogin);
            setDataUser(userRes);

            const walletRes = await walletServices.getWalletByUserId(userIdLogin);
            setWalletData(walletRes);
        };

        fetchAll();
    }, [userIdLogin]);

    return (
        <div className="container-main">
            <Notice />
            <br /> <hr />

            <div className="profile-container">
                <ProfileSidebar dataU={dataUser} walletData={walletData} />
                <ProfileContent dataU={dataUser} />
            </div>
        </div>
    );
}

export default InfoAccount;