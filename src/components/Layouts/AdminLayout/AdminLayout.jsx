import React, { useState, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar";
import SearchExpand from "../SearchExpand/SearchExpand";
import adminRouteTitles from "./adminRouteTitles";

import "./AdminLayout.scss";

export default function AdminLayout() {
    const [q, setQ] = useState("");
    const location = useLocation();

    const title = useMemo(() => {
        // fallback nếu chưa map
        return adminRouteTitles[location.pathname] || "BẢNG THÔNG TIN";
    }, [location.pathname]);

    return (
        <div className="AdminLayout">
            <Sidebar />

            <div className="AdminLayout__main">
                <div className="BackgroundHeader" />

                <div className="NavBar">
                    {/* Title giữa header */}
                    <div className="NavBar__title NavBar__title--center">{title}</div>

                    {/* Search dưới cùng */}
                    <div className="NavBar__searchBottom">
                        <SearchExpand
                            value={q}
                            onChange={setQ}
                            onSubmit={(text) => {
                                window.dispatchEvent(
                                    new CustomEvent("admin-search", { detail: text })
                                );
                            }}
                        />
                    </div>

                    {/* Admin góc phải trên */}
                    <div className="NavBar__right">
                        <div className="NavBar__name">Admin</div>
                        <img className="NavBar__avatar" src="/images/avataradmin.png" alt="avatar" />
                    </div>
                </div>

                <div className="AdminLayout__content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
