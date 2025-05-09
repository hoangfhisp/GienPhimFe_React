import logo from '../../../assets/img/logo.png'


function Avatar({data}){
    return(
        <div className="avatar-wrapper">
            <div className='avatar-container'>
                <img src={data.avatarP} alt="avatar"/>
                <div className='logo-gienphim' >
                    <img src={logo} alt='Logo GienPhim'/>
                </div>
            </div>
        </div>
    );
};

export default Avatar;