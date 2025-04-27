export default function NavbarMenu({}){
    return (
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul  className="navbar-nav me-auto collapse navbar-collapse">
                <NavbarSingle>HOME</NavbarSingle>
                <NavbarList>THỂ LOẠI</NavbarList>
            </ul>
        </div>
    );
}


function NavbarSingle({children}){
    return(
            <li className="nav-item">
                <a className="nav-link @isHome" href="/">{children}</a>
            </li>
    );
}

function NavbarList({children}){
    return(
        <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown">
                {children}
            </a>
            <ul className="dropdown-menu bg dropdown-menu-dark dropdown-menu-end">
                <li>
                    <a className="dropdown-item " href="/">Phim bộ</a>
                </li>
                <li>
                    <a className="dropdown-item" href="/">Phim lẻ</a>
                </li>
            </ul>
        </li>
    );
}