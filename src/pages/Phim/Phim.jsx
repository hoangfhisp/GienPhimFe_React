
import BoxTitle from "../../components/Commons/BoxTitle";
import FilmList from "../../components/Layouts/FilmList/FilmList";
import Notice from "../../components/Layouts/Notice/Notice";
import PhimBanner from "../../components/Layouts/PhimBanner/PhimBanner";
import { useParams } from "react-router-dom";
import TabsPhim from "../../components/Layouts/TabsPhim/TabsPhim";


function Phim(){
    const{id} = useParams();

    return(
        <div>
            <div className="container-main">
                <Notice/>

                <PhimBanner id={id}/>

                <TabsPhim id={id}/>

                <BoxTitle>Phim Liên Quan</BoxTitle>

                <FilmList top={20} page={1} limit={20}/>
            </div>
        </div>
    );
}

export default Phim;