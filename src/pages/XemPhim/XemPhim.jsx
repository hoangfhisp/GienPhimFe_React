
import { useParams } from 'react-router-dom';

import './XemPhim.scss'

import FilmVideo from '../../components/Layouts/FilmVideo/FilmVideo';
import Notice from '../../components/Layouts/Notice/Notice';
import PhimBanner from '../../components/Layouts/PhimBanner/PhimBanner';
import BoxTitle from '../../components/Commons/BoxTitle';
import FilmList from '../../components/Layouts/FilmList/FilmList';

function XemPhim(){
    const {id,tap} = useParams();
    return(
        <>
            <div className="container-main">
                <Notice/>

                <FilmVideo id = {id} tap = {tap}/>

                <PhimBanner id = {id}/>

                <br />
                <BoxTitle>PHIM LIÊN QUAN</BoxTitle>

                <FilmList top={20} page={1} limit={20}/>
            </div>
        </>
    );
}     

export default XemPhim;