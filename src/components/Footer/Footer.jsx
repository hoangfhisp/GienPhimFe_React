import NavbarFooter from "./NavbarFooter";
import "./Footer.scss";

export default function Footer() {
  return (
    <footer className="footer bg-black text-light">
      <div className="container py-4">

        {/* ===== TOP ===== */}
        <div className="row gy-3">

          {/* LOGO + DESC */}
          <div className="col-12 col-md-4 text-center text-md-start">
            <h4 className="footer-logo">GienPhim</h4>
            <p className="footer-desc">
              Nền tảng web xem phim trực tuyến chất lượng cao, cập nhật nhanh, giúp tăng
              trải nghiệm sống động trên mọi thiết bị.
              <hr />
              Có nhiều phim có nội dung 18+, vui lòng cân nhắc trước khi xem.
            </p>
            <br />
          </div>

          {/* MENU */}
          <div className="col-12 col-md-4 text-center">
            <h6 className="footer-title">Thông tin</h6>
            <div className="footer-links">
              <NavbarFooter>Giới thiệu</NavbarFooter>
              <NavbarFooter link="/LienHe">Liên hệ</NavbarFooter>
              <NavbarFooter link="/DieuKhoan">Điều khoản</NavbarFooter>
              <NavbarFooter link="/ChinhSach">Chính sách</NavbarFooter>
            </div>
          </div>

          {/* SOCIAL */}
          <div className="col-12 col-md-4 text-center text-md-end">
            <h6 className="footer-title">Kết nối</h6>
            <div className="footer-social">
              <a target="_blank" href="https://www.facebook.com/profile.php?id=61587108330332" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>
              <a target="_blank" href="https://x.com/GienPhim" aria-label="Twitter"><i className="fa-brands fa-x-twitter"></i></a>
              <a target="_blank" href="https://www.instagram.com/gienphimmanager/" aria-label="Instagram"><i className="fab fa-instagram" /></a>
              <a target="_blank" href="https://www.youtube.com/@Gien-Phim" aria-label="Youtube"><i className="fab fa-youtube" /></a>
            </div>
          </div>

        </div>

        {/* ===== BOTTOM ===== */}
        <div className="footer-bottom text-center mt-4">
          © 2025 <strong>GienPhim</strong>. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
