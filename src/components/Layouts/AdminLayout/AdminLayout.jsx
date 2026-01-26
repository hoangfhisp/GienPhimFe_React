import React, { useState, useMemo, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { decodeToken, getUserIdFromToken } from "../../../hooks/auth";
import Sidebar from "../Sidebar/Sidebar";
import SearchExpand from "../SearchExpand/SearchExpand";
import adminRouteTitles from "./adminRouteTitles";
import * as authServices from "../../../services/Admin/AuthenticationService.jsx";

import "./AdminLayout.scss";
import { SwitchMenu } from "../../Commons/SwithMenu/SwithMenu";
import useIsMobile from "../../../hooks/useIsMobile";

export default function AdminLayout() {
    const [q, setQ] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false); // 👈 STATE
    const [isLogin, setIsLogin] = useState(false);
    const [dataUser, setDataUser] = useState([]);

    const location = useLocation();
    const isMobile = useIsMobile();
    const title = useMemo(() => {
        return adminRouteTitles[location.pathname] || "BẢNG THÔNG TIN";
    }, [location.pathname]);

    const decoded = decodeToken();
    const userId = getUserIdFromToken();
    useEffect(() => {
        if (!userId) {
            setIsLogin(false);
            return;
        }
        setIsLogin(true);

        const fetchApi = async () => {
            var result = await authServices.getUserById(userId);
            setDataUser(result.data);
        }
        fetchApi();

    }, [userId]);
    return (
        <div className={`AdminLayout ${sidebarOpen ? "sidebar-open" : ""}`}>
            <Sidebar onClose={() => setSidebarOpen(false)} dataUser={dataUser} />
            {sidebarOpen && (
                <div
                    className="SidebarOverlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <div className="AdminLayout__main">
                <div className="BackgroundHeader" />

                <div className="NavBar">
                    {/* MENU BUTTON */}
                    {isMobile && (
                        <div className="NavBar__menu">
                            <SwitchMenu
                                open={sidebarOpen}
                                onToggle={() => setSidebarOpen(!sidebarOpen)}
                            />
                        </div>
                    )}

                    <div className="NavBar__title NavBar__title--center">
                        {title}
                    </div>

                    <div className="NavBar__searchBottom">
                        <SearchExpand
                            value={q}
                            onChange={setQ}
                            onSubmit={(text) => {
                                window.dispatchEvent(
                                    new CustomEvent("admin-search", { detail: text })
                                );
                                setSidebarOpen(false);
                            }}
                        />
                    </div>
                </div>


                <div className="AdminLayout__content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
