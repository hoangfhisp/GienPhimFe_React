export default function NavbarMenu({home}){
    return (
            <ul  class="navbar-nav me collapse navbar-collapse">
                <li class="nav-item">
                    <a class="nav-link @isHome" href="/">{home}</a>
                </li>
            </ul>
    );
}





