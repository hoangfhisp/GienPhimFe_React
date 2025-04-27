import NavbarFooter from "./NavbarFooter"

export default function footer(){
    return(
        <footer className="border-top footer text-muted">
            <nav className="navbar navbar-expand-lg navbar-dark bg-black">
                <div className="container text-center">
                <div className="mb-2">
                    <NavbarFooter>Giới Thiệu</NavbarFooter>
                    <NavbarFooter>Liên Hệ</NavbarFooter>
                    <NavbarFooter>Điều Khoản</NavbarFooter>
                    <NavbarFooter>Phim 18+</NavbarFooter>
                </div>
                <p className="mb-2">© 2025 by GhienPhim</p>
                    <div>
                        <a href="/" className="text-light me-3"><i className="fab fa-facebook-f"> </i></a>
                        <a href="/" className="text-light me-3"><i className="fab fa-twitter"></i></a>
                        <a href="/" className="text-light me-3"><i className="fab fa-instagram"></i></a>
                        <a href="/" className="text-light me-3"><i className="fab fa-youtube"></i></a>
                    </div>
                </div>
            </nav>
        </footer>
    );
}