
import { useParams } from 'react-router-dom';
import { useState } from 'react';

import './XemPhim.scss'

import FilmVideo from '../../components/Layouts/FilmVideo/FilmVideo';
import Notice from '../../components/Layouts/Notice/Notice';
import PhimBanner from '../../components/Layouts/PhimBanner/PhimBanner';
import BoxTitle from '../../components/Commons/BoxTitle';
import FilmList from '../../components/Layouts/FilmList/FilmList';
import * as authHook from '../../hooks/auth.jsx'
import Comment from '../../components/Layouts/Comment/Comment.jsx';
import ThongBao from '../../components/Layouts/ThongBao/ThongBao.jsx';

function XemPhim(){
    const {id,tap} = useParams();

    const[isThongBao,setIsThongBao] = useState(false);
    const[formThongBao,setFormThongBao] = useState({
            type: '',
            title: '',
            message: '',
            showButton: null,
            btnLabel: '',
            onBTNClick: null,
            onClose: null


        })
    
    var userIdLogin = authHook.getUserIdFromToken();
    var roleUser = authHook.getRolseUserFromToken();

    console.log(userIdLogin);
    return(
        <>
            <div className="container-main">
                <Notice/>

                <FilmVideo userId={userIdLogin} id = {id} tap = {tap}/>

                <PhimBanner id = {id}/>

                <br />
                <BoxTitle>PHIM LIÊN QUAN</BoxTitle>

                <FilmList top={20} page={1} limit={20}/>

                <Comment phimId={id} userId={userIdLogin} roleUser={roleUser} onformTB={setFormThongBao} onShowTB = {setIsThongBao} />
            </div>

            {isThongBao && <ThongBao
                show={isThongBao}
                type={formThongBao.type}
                title={formThongBao.title}
                message={formThongBao.message}
                showButton={formThongBao.showButton}
                btnLabel={formThongBao.btnLabel}
                onBTNClick={formThongBao.onBTNClick}
                onClose={formThongBao.onClose}
            ></ThongBao>}
        </>

    );
}     

export default XemPhim;