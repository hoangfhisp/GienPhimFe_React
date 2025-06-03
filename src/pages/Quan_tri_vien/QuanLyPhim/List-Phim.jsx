import AdminBoard from '../../../components/Layouts/Admin-board/Admin-board';
import '../../../components/Layouts/Admin-board/Admin-board.scss';
import LocPhim from '../../../components/Layouts/LocPhim/LocPhim.jsx'

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