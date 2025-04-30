import './Popper.scss'

function Wrapper({children}){
    return(
        <div className="wrapper-main">
            {children}
        </div>
    );
}

export default Wrapper;