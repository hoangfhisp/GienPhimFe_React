import React, { useEffect, useState } from 'react';
import AdminBoard from '../../../components/Layouts/Admin-board/Admin-board';
import Table from '../../../components/Table/Table';
import Card from '../../../components/Table/Card';
import '../../../components/Layouts/Admin-board/Admin-board.scss';
import Content from '../../../components/Layouts/AdminContent/Content';
import ListPhim from '../../../components/Layouts/AdminList/ListPhim';
import LocPhim from '../../../components/Layouts/LocPhim/LocPhim.jsx'
import { Link } from 'react-router-dom';

export default function PhimList() {
    return (

        <div className="wrapper d-flex">
            <AdminBoard username="Admin" />
            <div id="content" className="content p-4 p-md-5 pt-5">
                <div className="d-flex justify-content-center align-items-center mb-4">
                    <h1 className="mb-0">Danh sách phim</h1>
                </div>
                <hr />
                <LocPhim />
            </div>
        </div>

    );

}