import { useEffect, useState } from 'react';

import './TabsPhim.scss'

import Character from './Character';
import Detail from './Detail';
import * as phimServices from '../../../services/User/FilmService.jsx'
import Trailer from './Trailer.jsx';
import Avatar from './Avatar.jsx';

function TabsPhim({id}){
    const[activeTab, setActiveTab] = useState("info")
    const[dataPhim, setDataPhim] = useState([]);
    const[dataTap, setDataTap] = useState([]);

    useEffect(() => {
        if(id == null){
            return;
        }

        const fetchApi = async () => {
             const resultPhim = await phimServices.phim(id);
            const resultTapPhim = await phimServices.tapPhims(id);
            setDataPhim(resultPhim.data);
            setDataTap(resultTapPhim.data);
        }
        fetchApi();

    },[id])

  
    return(
        <>
            <nav className="tabs-phim">
                    <button className={`tab ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')} >📄 Thông tin phim</button>
                    <button className={`tab ${activeTab === 'characters' ? 'active' : ''}`} onClick={() => setActiveTab('characters')} >🎭 Nhân vật</button>
                    <button className={`tab ${activeTab === 'trailer' ? 'active' : ''}`} onClick={() => setActiveTab('trailer')}>🎥 Trailer</button>
                    <button className={`tab ${activeTab === 'avatar' ? 'active' : ''}`} onClick={() => setActiveTab('avatar')}>📸 Hình ảnh</button>
            </nav>

            <section className="phim-details-container">
                {activeTab === 'info' && <Detail data={dataPhim} dataTap ={dataTap}/>}
                {activeTab === 'characters' && <Character data={dataPhim} />}
                {activeTab === 'trailer' && <Trailer data={dataPhim} />}
                {activeTab === 'avatar' && <Avatar data={dataPhim} />}
            </section>
        </>
    );
}

export default TabsPhim;