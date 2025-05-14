
import AdminBoard from '../Admin-board/Admin-board';
import '../Admin-board/Admin-board.scss';
import ListPhim from '../AdminList/ListPhim';
import LocPhim from '../LocPhim/LocPhim';

function Content({ children, listphim, locphim }) {
    return (

        <div className="wrapper d-flex">
            <AdminBoard username="Admin" />
            <div id="content" className="content p-4 p-md-5 pt-5">
                <div className="d-flex justify-content-center align-items-center mb-4">
                    <h1 className="mb-0">{children}</h1>
                </div>
                <hr />
                {locphim && <LocPhim />}
                {listphim && < ListPhim />}

            </div>
        </div>
    );
}

export default Content;